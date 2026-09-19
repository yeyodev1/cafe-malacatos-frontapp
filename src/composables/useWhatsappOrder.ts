import { computed } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { copy } from '@/config/copy'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'
import { formatCents } from '@/utils/money'

/**
 * "Terminar compra por WhatsApp": arma el mensaje con el detalle del carrito y
 * lo abre contra el número que el admin tenga en ajustes (site.ts de respaldo).
 */
export function useWhatsappOrder() {
  const cart = useCartStore()
  const settings = useSettingsStore()

  const number = computed(() => settings.whatsapp || site.whatsapp)

  const orderMessage = computed(() => {
    const text = copy.whatsappOrder
    const lines = cart.lines.map(
      (line) =>
        `• ${line.qty} x ${line.name} (${line.variantLabel}) — ${formatCents(line.unitPriceCents * line.qty)}`,
    )
    return [
      text.greeting,
      '',
      ...lines,
      '',
      `${text.subtotal}: ${formatCents(cart.subtotalCents)}`,
      text.shippingLine,
    ].join('\n')
  })

  /** Con carrito, el pedido completo; sin carrito, un saludo para abrir la conversación. */
  const hasOrder = computed(() => cart.lines.length > 0)
  const orderLink = computed(() => whatsappLink(orderMessage.value, number.value))
  const contactLink = computed(() => whatsappLink(copy.common.whatsappGreeting, number.value))
  const smartLink = computed(() => (hasOrder.value ? orderLink.value : contactLink.value))

  function askLink(message: string): string {
    return whatsappLink(message, number.value)
  }

  return { number, hasOrder, orderMessage, orderLink, contactLink, smartLink, askLink }
}
