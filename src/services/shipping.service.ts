import APIBase from './httpBase'
import type { ShippingQuote, ShippingZonePublic } from '@/types'

export interface QuoteItem {
  productId: string
  variantId: string
  qty: number
}

class ShippingService extends APIBase {
  /** Las 24 provincias y si tienen tarifa en línea (`available`). */
  async zones(): Promise<ShippingZonePublic[]> {
    const { data } = await this.get<ShippingZonePublic[]>('shipping/zones')
    return Array.isArray(data) ? data : []
  }

  /** El servidor calcula el envío: el cliente nunca arma el monto. */
  async quote(province: string, items: QuoteItem[]): Promise<ShippingQuote> {
    const { data } = await this.post<ShippingQuote>('shipping/quote', { province, items })
    return data
  }
}

export const shippingService = new ShippingService()
