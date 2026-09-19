import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderService } from '@/services/order.service'
import { useUserStore } from '@/stores/user'
import type { ApiError, Order } from '@/types'

/** ask: falta el correo · loading · ready · notFound: número o correo no coinciden · error. */
export type TrackingState = 'ask' | 'loading' | 'ready' | 'notFound' | 'error'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function firstValue(value: unknown): string {
  const raw = Array.isArray(value) ? value[0] : value
  return typeof raw === 'string' ? raw.trim() : ''
}

/**
 * Seguimiento público de un pedido. El correo viaja en la URL porque a esta
 * página llegan los enlaces de los correos; si falta, se pide antes de consultar.
 */
export function useOrderTracking() {
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()

  const number = computed(() => firstValue(route.params.number).toUpperCase())
  const email = computed(() => firstValue(route.query.email).toLowerCase())

  const state = ref<TrackingState>('ask')
  const order = ref<Order | null>(null)
  const message = ref('')
  // Con sesión, el correo de la cuenta es el candidato natural.
  const emailInput = ref(email.value || userStore.user?.email || '')
  const emailError = ref(false)

  let lastRequest = 0

  async function load() {
    const request = ++lastRequest
    message.value = ''

    if (!number.value || !email.value) {
      state.value = 'ask'
      return
    }

    state.value = 'loading'
    try {
      const result = await orderService.getByNumber(number.value, email.value)
      if (request !== lastRequest) return
      order.value = result
      state.value = 'ready'
    } catch (e) {
      if (request !== lastRequest) return
      const error = e as ApiError
      order.value = null
      message.value = error.message
      state.value = error.status === 404 ? 'notFound' : 'error'
    }
  }

  /** El correo escrito pasa a la URL: recargar o compartir el enlace sigue funcionando. */
  function submitEmail() {
    const value = emailInput.value.trim().toLowerCase()
    emailError.value = !EMAIL.test(value)
    if (emailError.value) return
    if (value === email.value) load()
    else router.replace({ params: route.params, query: { ...route.query, email: value } })
  }

  function setOrder(next: Order) {
    order.value = next
  }

  watch([number, email], load, { immediate: true })

  return {
    number,
    email,
    state,
    order,
    message,
    emailInput,
    emailError,
    load,
    submitEmail,
    setOrder,
  }
}
