import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { shippingService, type QuoteItem } from '@/services/shipping.service'
import { useCartStore } from '@/stores/cart'

/**
 * idle: falta provincia · loading · available: hay tarifa · unavailable: la
 * provincia no tiene tarifa (se cierra por WhatsApp) · error: falló la consulta.
 */
export type QuoteStatus = 'idle' | 'loading' | 'available' | 'unavailable' | 'error'

const DEBOUNCE_MS = 350

/**
 * Cotiza el envío cada vez que cambia la provincia o el carrito. El stepper de
 * cantidad dispara muchos cambios seguidos: se espera a que el comprador pare
 * (debounce) y cada consulta lleva un número, para que una respuesta vieja que
 * llega tarde no pise a la más reciente.
 */
export function useShippingQuote(province: Ref<string>) {
  const cart = useCartStore()

  const status = ref<QuoteStatus>('idle')
  const shippingCents = ref<number | null>(null)

  let timer: ReturnType<typeof setTimeout> | undefined
  let lastRequest = 0

  const items = computed<QuoteItem[]>(() =>
    cart.lines.map((line) => ({
      productId: line.productId,
      variantId: line.variantId,
      qty: line.qty,
    })),
  )
  // Firma del carrito: el watcher solo se dispara si cambia algo que afecte al peso.
  const signature = computed(() =>
    items.value.map((item) => `${item.variantId}x${item.qty}`).join('|'),
  )

  const totalCents = computed(() =>
    status.value === 'available' && shippingCents.value !== null
      ? cart.subtotalCents + shippingCents.value
      : null,
  )

  async function run() {
    const request = ++lastRequest
    const target = province.value

    if (!target || !items.value.length) {
      status.value = 'idle'
      shippingCents.value = null
      return
    }

    status.value = 'loading'
    try {
      const quote = await shippingService.quote(target, items.value)
      if (request !== lastRequest) return

      // Con `available: false` el backend manda `shippingCents: null`.
      const cents = quote.available ? (quote.shippingCents ?? null) : null
      shippingCents.value = cents
      status.value = cents === null ? 'unavailable' : 'available'
    } catch {
      if (request !== lastRequest) return
      shippingCents.value = null
      status.value = 'error'
    }
  }

  function schedule() {
    clearTimeout(timer)
    // Invalida cualquier consulta en vuelo: su respuesta ya no corresponde a lo que se ve.
    lastRequest++
    shippingCents.value = null
    status.value = province.value && items.value.length ? 'loading' : 'idle'
    timer = setTimeout(run, DEBOUNCE_MS)
  }

  function retry() {
    clearTimeout(timer)
    run()
  }

  watch([province, signature], schedule, { immediate: true })
  onBeforeUnmount(() => {
    clearTimeout(timer)
    lastRequest++
  })

  return { status, shippingCents, totalCents, retry }
}
