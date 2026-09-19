import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { orderService } from '@/services/order.service'
import { useCartStore } from '@/stores/cart'
import { useCheckoutForm } from './useCheckoutForm'
import type { ApiError, Order, OrderStatus } from '@/types'

/**
 * missing: llegaron sin parámetros · confirming · approved · rejected: Payphone
 * canceló o rechazó · pending: Payphone aún no aprueba (409) · error: red o 5xx.
 */
export type ConfirmState = 'missing' | 'confirming' | 'approved' | 'rejected' | 'pending' | 'error'

const PAID: OrderStatus[] = ['paid', 'shipped', 'delivered']

function firstValue(value: unknown): string {
  const raw = Array.isArray(value) ? value[0] : value
  return typeof raw === 'string' ? raw.trim() : ''
}

/**
 * Confirmación del pago con tarjeta. Se dispara apenas carga la vista: si nadie
 * confirma en 5 minutos, Payphone reversa el cobro. El backend es idempotente,
 * así que recargar o reintentar nunca cobra ni marca dos veces.
 */
export function usePaymentConfirm() {
  const route = useRoute()
  const cart = useCartStore()
  const { reset } = useCheckoutForm()

  const id = Number(firstValue(route.query.id))
  const clientTransactionId = firstValue(route.query.clientTransactionId)
  const hasParams = Number.isInteger(id) && id > 0 && Boolean(clientTransactionId)

  const state = ref<ConfirmState>(hasParams ? 'confirming' : 'missing')
  const order = ref<Order | null>(null)
  const message = ref('')
  const busy = ref(false)

  const trackingLink = computed(() =>
    order.value
      ? {
          name: 'OrderTracking',
          params: { number: order.value.number },
          query: { email: order.value.customer.email },
        }
      : null,
  )

  async function confirm() {
    if (!hasParams || busy.value) return
    busy.value = true
    message.value = ''
    // En un reintento no se vuelve a la pantalla completa de carga: el botón ya avisa.
    if (state.value !== 'error' && state.value !== 'pending') state.value = 'confirming'

    try {
      const result = await orderService.confirm(id, clientTransactionId)
      order.value = result

      if (PAID.includes(result.status)) {
        state.value = 'approved'
        cart.clear()
        reset()
      } else {
        state.value = 'rejected'
      }
    } catch (e) {
      const error = e as ApiError
      message.value = error.message
      // 409: el cobro no está aprobado o el monto no cuadra. 404/400: enlace inválido.
      // El resto (502, red, timeout) es transitorio y se puede reintentar.
      if (error.status === 409) state.value = 'pending'
      else if (error.status === 404 || error.status === 400) state.value = 'missing'
      else state.value = 'error'
    } finally {
      busy.value = false
    }
  }

  return { state, order, message, busy, trackingLink, confirm }
}
