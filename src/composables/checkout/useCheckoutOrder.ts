import { computed, ref, type Ref } from 'vue'
import { checkoutCopy } from '@/config/copy.checkout'
import { orderService } from '@/services/order.service'
import { useCartStore } from '@/stores/cart'
import { toInternationalPhone } from '@/utils/ecuador'
import { useCheckoutForm } from './useCheckoutForm'
import type { QuoteStatus } from './useShippingQuote'
import type { PayphoneBuyer } from './usePayphoneBox'
import type { ApiError, CreateOrderResponse, Order } from '@/types'

/** form: llenando datos · card: Cajita de Payphone · transfer: cuentas y comprobante. */
export type CheckoutStage = 'form' | 'card' | 'transfer'

/**
 * Crea la orden y decide qué se muestra después. Cada envío crea una orden
 * nueva en el backend, así que el candado `submitting` es lo que impide que un
 * doble clic genere dos.
 */
export function useCheckoutOrder(quoteStatus: Ref<QuoteStatus>) {
  const cart = useCartStore()
  const { validate, buildPayload, reset } = useCheckoutForm()

  const stage = ref<CheckoutStage>('form')
  const submitting = ref(false)
  const submitError = ref('')
  const created = ref<CreateOrderResponse | null>(null)

  const order = computed<Order | null>(() => created.value?.order ?? null)
  const canPay = computed(() => quoteStatus.value === 'available')

  /** Datos reales del comprador para Payphone; nunca valores fijos. */
  const buyer = computed<PayphoneBuyer>(() => {
    const source = order.value
    return {
      email: source?.customer.email ?? '',
      phoneNumber: toInternationalPhone(source?.customer.phone ?? ''),
      documentId:
        source && source.billing.idType !== 'consumidor_final' ? source.billing.idNumber : '',
    }
  })

  async function submit(): Promise<boolean> {
    if (submitting.value) return false
    // El candado se cierra ANTES de cualquier await: validar es asíncrono y, si se
    // cerrara después, un doble clic pasaría dos veces por aquí y crearía dos órdenes.
    submitting.value = true
    submitError.value = ''
    try {
      if (!(await validate())) return false
      if (!canPay.value || cart.isEmpty) return false

      const response = await orderService.create(buildPayload())

      if (response.order.paymentMethod === 'card') {
        if (!response.payphone) throw { status: 500, message: '' } as ApiError
        created.value = response
        stage.value = 'card'
      } else {
        created.value = response
        stage.value = 'transfer'
        // La orden por transferencia ya es un pedido en firme: el carrito se cierra.
        // Con tarjeta se vacía recién cuando Payphone aprueba (página de respuesta).
        cart.clear()
        reset()
      }
      window.scrollTo({ top: 0 })
      return true
    } catch (error) {
      submitError.value = (error as ApiError).message || checkoutCopy.payment.createError
      return false
    } finally {
      submitting.value = false
    }
  }

  /** Volver del pago con tarjeta a corregir datos. La orden pendiente queda sin pagar. */
  function backToForm() {
    if (submitting.value) return
    stage.value = 'form'
    created.value = null
    submitError.value = ''
  }

  function setOrder(next: Order) {
    if (created.value) created.value = { ...created.value, order: next }
  }

  return {
    stage,
    submitting,
    submitError,
    created,
    order,
    canPay,
    buyer,
    submit,
    backToForm,
    setOrder,
  }
}
