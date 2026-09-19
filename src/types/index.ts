/** Forma con la que httpBase rechaza cualquier error del API. */
export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

/** Lo que devuelve el backapp en /auth/login y /auth/me. */
export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: 'customer' | 'admin' | string
}

// ─── Contrato del API (ver CONTRATO-API.md en la carpeta del cliente) ────────
// Todos los montos son enteros en centavos.

export type ProductCategory = 'cafe' | 'harinas' | 'endulzantes' | 'untables' | 'dulces'

export interface ProductImage {
  url: string
  publicId: string
}

export interface ProductVariant {
  id: string
  label: string
  weightGrams: number
  priceCents: number
  wholesalePriceCents: number | null
  wholesaleMinQty: number | null
  isActive: boolean
}

export interface Product {
  id: string
  slug: string
  name: string
  category: ProductCategory
  shortDescription: string
  description: string
  usage: string
  images: ProductImage[]
  variants: ProductVariant[]
  isPublished: boolean
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

export interface CartLine {
  productId: string
  variantId: string
  slug: string
  name: string
  variantLabel: string
  weightGrams: number
  unitPriceCents: number
  image: string
  qty: number
}

export interface ShippingZonePublic {
  province: string
  available: boolean
}

export interface ShippingZone {
  id: string
  province: string
  // null = tarifa sin definir: esa provincia solo cierra por WhatsApp
  baseCents: number | null
  extraPerKgCents: number
  includedKg: number
  isActive: boolean
}

export interface ShippingQuote {
  available: boolean
  // null cuando la provincia no tiene tarifa: el backend no inventa un monto
  shippingCents: number | null
  totalWeightGrams: number
}

export interface BankAccount {
  id: string
  bank: string
  accountType: string
  number: string
  holder: string
  idNumber: string
}

export interface PublicSettings {
  whatsapp: string
  contactEmail: string
  contactPhone: string
  social: { instagram: string; facebook: string; tiktok: string }
  bankAccounts: BankAccount[]
  transferInstructions: string
  transferEnabled: boolean
}

export type PaymentMethod = 'card' | 'transfer'
export type OrderStatus =
  'pending' | 'awaiting_verification' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
export type BillingIdType = 'cedula' | 'ruc' | 'pasaporte' | 'consumidor_final'

export interface OrderCustomer {
  name: string
  email: string
  phone: string
}

export interface OrderShipping {
  province: string
  city: string
  address: string
  reference: string
  lat: number | null
  lng: number | null
}

export interface OrderBilling {
  idType: BillingIdType
  idNumber: string
  name: string
  address: string
  email: string
  phone: string
}

export interface OrderItem {
  product: string
  variantId: string
  name: string
  variantLabel: string
  weightGrams: number
  unitPriceCents: number
  qty: number
  lineTotalCents: number
  image: string
}

export interface Order {
  id: string
  number: string
  user: string | null
  customer: OrderCustomer
  shipping: OrderShipping
  billing: OrderBilling
  items: OrderItem[]
  subtotalCents: number
  shippingCents: number
  totalCents: number
  totalWeightGrams: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  clientTransactionId: string
  transferProof: ProductImage | null
  invoiceIssued: boolean
  trackingNote: string
  adminNote: string
  paidAt: string | null
  shippedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateOrderPayload {
  items: { productId: string; variantId: string; qty: number }[]
  customer: OrderCustomer
  shipping: OrderShipping
  billing: OrderBilling
  paymentMethod: PaymentMethod
}

/** Lo que el backend entrega para montar la Cajita de Pagos. */
export interface PayphoneBoxConfig {
  token: string
  storeId: string
  clientTransactionId: string
  amount: number
  amountWithoutTax: number
  currency: 'USD'
  reference: string
}

export interface CreateOrderResponse {
  order: Order
  payphone?: PayphoneBoxConfig
  bankAccounts?: BankAccount[]
  transferInstructions?: string
}

export interface AdminStats {
  ordersToday: number
  pendingVerification: number
  toShip: number
  revenueMonthCents: number
}

export interface AdminCustomer extends SessionUser {
  ordersCount: number
  createdAt: string
}
