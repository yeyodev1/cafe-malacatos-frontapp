import { computed, ref } from 'vue'
import { checkoutCopy } from '@/config/copy.checkout'
import { useCheckoutForm } from './useCheckoutForm'

const PERMISSION_DENIED = 1
const COORD_DECIMALS = 6

/** Enlace que abre el punto en Google Maps; sirve también en el seguimiento. */
export function mapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`
}

/**
 * "Poner el puntito": guarda la ubicación actual del comprador en `shipping`.
 * Es opcional, así que ningún fallo (permiso negado, navegador sin soporte,
 * sin señal) bloquea la compra: solo se explica y se sigue con la dirección.
 */
export function useDeliveryPin() {
  const { form } = useCheckoutForm()
  const text = checkoutCopy.location

  const locating = ref(false)
  const error = ref('')

  const hasPin = computed(() => form.shipping.lat !== null && form.shipping.lng !== null)
  const label = computed(() => (hasPin.value ? `${form.shipping.lat}, ${form.shipping.lng}` : ''))
  const link = computed(() =>
    hasPin.value ? mapsLink(form.shipping.lat as number, form.shipping.lng as number) : '',
  )

  function round(value: number): number {
    return Number(value.toFixed(COORD_DECIMALS))
  }

  function locate() {
    if (locating.value) return
    error.value = ''

    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      error.value = text.unsupported
      return
    }

    locating.value = true
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.shipping.lat = round(position.coords.latitude)
        form.shipping.lng = round(position.coords.longitude)
        locating.value = false
      },
      (failure) => {
        error.value = failure.code === PERMISSION_DENIED ? text.denied : text.failed
        locating.value = false
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    )
  }

  function clear() {
    form.shipping.lat = null
    form.shipping.lng = null
    error.value = ''
  }

  return { locating, error, hasPin, label, link, locate, clear }
}
