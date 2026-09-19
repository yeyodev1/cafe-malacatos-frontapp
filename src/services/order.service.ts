import APIBase from './httpBase'
import type { CreateOrderPayload, CreateOrderResponse, Order } from '@/types'

// Confirmar y subir la foto dependen de terceros (Payphone, Cloudinary): se les
// da más aire que los 15 s por defecto para no cortar una respuesta que sí llega.
const SLOW_TIMEOUT = 40000

class OrderService extends APIBase {
  /** El servidor recalcula precios, envío y total: los montos del cliente no viajan. */
  async create(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const { data } = await this.post<CreateOrderResponse>('orders', payload)
    return data
  }

  /** Confirma el cobro contra Payphone. Idempotente: se puede repetir al recargar. */
  async confirm(id: number, clientTransactionId: string): Promise<Order> {
    const { data } = await this.post<{ order: Order }>(
      'orders/confirm',
      { id, clientTransactionId },
      undefined,
      { timeout: SLOW_TIMEOUT },
    )
    return data.order
  }

  /** Comprobante de transferencia: solo imágenes. El correo debe ser el de la orden. */
  async uploadProof(number: string, email: string, file: File): Promise<Order> {
    const body = new FormData()
    body.append('email', email)
    body.append('file', file)
    const { data } = await this.post<{ order: Order }>(
      `orders/${encodeURIComponent(number)}/proof`,
      body,
      undefined,
      { timeout: SLOW_TIMEOUT },
    )
    return data.order
  }

  /** Seguimiento público: el backend responde 404 si el correo no coincide. */
  async getByNumber(number: string, email: string): Promise<Order> {
    const { data } = await this.get<{ order: Order }>(
      `orders/${encodeURIComponent(number)}`,
      undefined,
      { params: { email } },
    )
    return data.order
  }

  async mine(): Promise<Order[]> {
    const { data } = await this.get<Order[]>('orders/mine')
    return Array.isArray(data) ? data : []
  }
}

export const orderService = new OrderService()
