import APIBase from './httpBase'
import type {
  AdminCustomer,
  AdminStats,
  BankAccount,
  Order,
  OrderStatus,
  Paginated,
  Product,
  ProductCategory,
  PublicSettings,
  ShippingZone,
} from '@/types'

/** Lo que de verdad devuelve /admin/customers: no trae `accountType`, sí el estado de la cuenta. */
export type AdminCustomerRow = Omit<AdminCustomer, 'accountType'> & {
  isActive: boolean
  lastLoginAt: string | null
}

export type AdminSettings = PublicSettings

/** Una variante nueva viaja sin `id`; una existente lo conserva para no romper las órdenes. */
export interface VariantPayload {
  id?: string
  label: string
  weightGrams: number
  priceCents: number
  wholesalePriceCents: number | null
  wholesaleMinQty: number | null
  isActive: boolean
}

export interface ProductPayload {
  name: string
  slug: string
  category: ProductCategory
  shortDescription: string
  description: string
  usage: string
  sortOrder: number
  isPublished: boolean
  variants: VariantPayload[]
}

export type ZonePayload = Partial<
  Pick<ShippingZone, 'baseCents' | 'extraPerKgCents' | 'includedKg' | 'isActive'>
>

export interface SettingsPayload {
  whatsapp: string
  contactEmail: string
  contactPhone: string
  social: PublicSettings['social']
  bankAccounts: (Omit<BankAccount, 'id'> & { id?: string })[]
  transferInstructions: string
}

class AdminService extends APIBase {
  async stats(): Promise<AdminStats> {
    return (await this.get<AdminStats>('admin/stats')).data
  }

  // ─── Órdenes ───────────────────────────────────────────────────────────────
  async orders(params: { status?: OrderStatus | ''; page?: number }): Promise<Paginated<Order>> {
    const query = new URLSearchParams()
    if (params.status) query.set('status', params.status)
    if (params.page && params.page > 1) query.set('page', String(params.page))
    const suffix = query.toString() ? `?${query}` : ''
    return (await this.get<Paginated<Order>>(`admin/orders${suffix}`)).data
  }

  async order(id: string): Promise<Order> {
    return (await this.get<Order>(`admin/orders/${id}`)).data
  }

  async approveTransfer(id: string): Promise<Order> {
    return (await this.post<Order>(`admin/orders/${id}/approve-transfer`, {})).data
  }

  async shipOrder(id: string, trackingNote: string): Promise<Order> {
    return (await this.post<Order>(`admin/orders/${id}/ship`, { trackingNote })).data
  }

  async deliverOrder(id: string): Promise<Order> {
    return (await this.post<Order>(`admin/orders/${id}/deliver`, {})).data
  }

  async cancelOrder(id: string): Promise<Order> {
    return (await this.post<Order>(`admin/orders/${id}/cancel`, {})).data
  }

  async setInvoiceIssued(id: string, issued: boolean): Promise<Order> {
    return (await this.post<Order>(`admin/orders/${id}/invoice`, { issued })).data
  }

  async setOrderNote(id: string, adminNote: string): Promise<Order> {
    return (await this.patch<Order>(`admin/orders/${id}/note`, { adminNote })).data
  }

  // ─── Productos ─────────────────────────────────────────────────────────────
  async products(): Promise<Product[]> {
    return (await this.get<Product[]>('admin/products')).data
  }

  async product(id: string): Promise<Product> {
    return (await this.get<Product>(`admin/products/${id}`)).data
  }

  async createProduct(payload: ProductPayload): Promise<Product> {
    return (await this.post<Product>('admin/products', payload)).data
  }

  async updateProduct(id: string, payload: Partial<ProductPayload>): Promise<Product> {
    return (await this.put<Product>(`admin/products/${id}`, payload)).data
  }

  async deleteProduct(id: string): Promise<void> {
    await this.delete(`admin/products/${id}`)
  }

  async addProductImage(id: string, file: File): Promise<Product> {
    const form = new FormData()
    form.append('file', file)
    // Una foto de celular pesa varios MB y sube por datos móviles: más margen que el resto.
    return (
      await this.post<Product>(`admin/products/${id}/images`, form, undefined, {
        timeout: 60000,
      })
    ).data
  }

  async removeProductImage(id: string, publicId: string): Promise<Product> {
    // El publicId de Cloudinary trae "/": sin codificar partiría la ruta.
    const encoded = encodeURIComponent(publicId)
    return (await this.delete<Product>(`admin/products/${id}/images/${encoded}`)).data
  }

  // ─── Clientes ──────────────────────────────────────────────────────────────
  async customers(page = 1): Promise<Paginated<AdminCustomerRow>> {
    const suffix = page > 1 ? `?page=${page}` : ''
    return (await this.get<Paginated<AdminCustomerRow>>(`admin/customers${suffix}`)).data
  }

  // ─── Envíos ────────────────────────────────────────────────────────────────
  async shippingZones(): Promise<ShippingZone[]> {
    return (await this.get<ShippingZone[]>('admin/shipping/zones')).data
  }

  async updateShippingZone(id: string, payload: ZonePayload): Promise<ShippingZone> {
    return (await this.put<ShippingZone>(`admin/shipping/zones/${id}`, payload)).data
  }

  // ─── Ajustes ───────────────────────────────────────────────────────────────
  async settings(): Promise<AdminSettings> {
    return (await this.get<AdminSettings>('admin/settings')).data
  }

  async updateSettings(payload: SettingsPayload): Promise<AdminSettings> {
    return (await this.put<AdminSettings>('admin/settings', payload)).data
  }
}

export const adminService = new AdminService()
