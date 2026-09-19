import { computed } from 'vue'
import { checkoutCopy } from '@/config/copy.checkout'
import { useWhatsappOrder } from '@/composables/useWhatsappOrder'
import { useCheckoutForm } from './useCheckoutForm'

/**
 * Cuando la provincia no tiene tarifa en línea, el pedido se cierra por
 * WhatsApp. Al mensaje del carrito se le suma lo que el comprador ya escribió
 * (destino y nombre) para que la tienda pueda cotizar el envío sin preguntar.
 */
export function useCheckoutWhatsapp() {
  const { form } = useCheckoutForm()
  const { orderMessage, askLink } = useWhatsappOrder()
  const text = checkoutCopy.whatsapp

  const link = computed(() => {
    const { province, city, address } = form.shipping
    const destination = [address.trim(), city.trim(), province].filter(Boolean).join(', ')
    const name = form.customer.name.trim()

    const extra = [
      destination ? `${text.shipTo}: ${destination}` : '',
      name ? `${text.customer}: ${name}` : '',
    ].filter(Boolean)

    return askLink(
      extra.length ? [orderMessage.value, '', ...extra].join('\n') : orderMessage.value,
    )
  })

  return { link }
}
