import { nextTick, reactive, watch } from 'vue'
import { checkoutCopy } from '@/config/copy.checkout'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { isValidCedula, isValidRuc, onlyDigits } from '@/utils/ecuador'
import type { BillingIdType, CreateOrderPayload, PaymentMethod } from '@/types'

/** Campos con validación, en el orden en que aparecen: así el foco va al primero con error. */
const FIELD_ORDER = [
  'name',
  'email',
  'phone',
  'province',
  'city',
  'address',
  'idNumber',
  'billingName',
  'billingAddress',
  'billingEmail',
  'billingPhone',
] as const

export type CheckoutFieldKey = (typeof FIELD_ORDER)[number]

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const text = checkoutCopy.errors

function blankForm() {
  return {
    customer: { name: '', email: '', phone: '' },
    shipping: {
      province: '',
      city: '',
      address: '',
      reference: '',
      lat: null as number | null,
      lng: null as number | null,
    },
    billing: {
      idType: 'cedula' as BillingIdType,
      idNumber: '',
      name: '',
      address: '',
      email: '',
      phone: '',
    },
    // Marcado: la factura sale con los datos de contacto y la dirección de envío.
    billingSameAsContact: true,
    paymentMethod: 'card' as PaymentMethod,
  }
}

// Estado de módulo: si el comprador vuelve al carrito a cambiar algo, no pierde lo escrito.
const form = reactive(blankForm())
const errors = reactive<Partial<Record<CheckoutFieldKey, string>>>({})

function isPhone(value: string): boolean {
  const digits = onlyDigits(value)
  return /^[+\d\s()-]+$/.test(value.trim()) && digits.length >= 7 && digits.length <= 15
}

function idNumberError(): string {
  const value = form.billing.idNumber.trim()
  if (!value) return text.idNumber
  if (form.billing.idType === 'cedula') return isValidCedula(value) ? '' : text.cedula
  if (form.billing.idType === 'ruc') return isValidRuc(value) ? '' : text.ruc
  return /^[A-Za-z0-9-]{5,20}$/.test(value) ? '' : text.pasaporte
}

/** Devuelve el mensaje de error del campo, o '' si está bien o no aplica. */
function check(field: CheckoutFieldKey): string {
  const { customer, shipping, billing } = form
  const isConsumer = billing.idType === 'consumidor_final'
  // Con "usar mis datos" o consumidor final, los campos propios de factura no se piden.
  const ownBilling = !isConsumer && !form.billingSameAsContact

  switch (field) {
    case 'name':
      return customer.name.trim().length >= 3 ? '' : text.name
    case 'email':
      return EMAIL.test(customer.email.trim()) ? '' : text.email
    case 'phone':
      return isPhone(customer.phone) ? '' : text.phone
    case 'province':
      return shipping.province ? '' : text.province
    case 'city':
      return shipping.city.trim() ? '' : text.city
    case 'address':
      return shipping.address.trim().length >= 5 ? '' : text.address
    case 'idNumber':
      return isConsumer ? '' : idNumberError()
    case 'billingName':
      return !ownBilling || billing.name.trim().length >= 3 ? '' : text.billingName
    case 'billingAddress':
      return !ownBilling || billing.address.trim().length >= 5 ? '' : text.billingAddress
    case 'billingEmail':
      return !ownBilling || EMAIL.test(billing.email.trim()) ? '' : text.billingEmail
    case 'billingPhone':
      return !ownBilling || isPhone(billing.phone) ? '' : text.billingPhone
  }
}

function setError(field: CheckoutFieldKey, message: string) {
  if (message) errors[field] = message
  else delete errors[field]
}

// Mientras se corrige un campo marcado, el error se revalida en vivo. También cubre
// el cambio de tipo de identificación o de "usar mis datos", que vuelven
// innecesarios algunos campos de factura.
watch(
  form,
  () => {
    for (const field of FIELD_ORDER) if (errors[field]) setError(field, check(field))
  },
  { deep: true },
)

export function fieldId(field: CheckoutFieldKey): string {
  return `checkout-${field}`
}

export function useCheckoutForm() {
  const cart = useCartStore()
  const userStore = useUserStore()

  /** Al salir de un campo se valida: el error aparece cuando ya se terminó de escribir. */
  function touch(field: CheckoutFieldKey) {
    setError(field, check(field))
  }

  /** Valida todo y lleva el foco al primer campo con error. */
  async function validate(): Promise<boolean> {
    for (const field of FIELD_ORDER) setError(field, check(field))
    const first = FIELD_ORDER.find((field) => errors[field])
    if (!first) return true

    await nextTick()
    const node = document.getElementById(fieldId(first))
    node?.focus({ preventScroll: true })
    node?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    return false
  }

  /** Con sesión se precargan los datos, sin pisar lo que el comprador ya escribió. */
  function prefillFromSession() {
    const user = userStore.user
    if (!user) return
    if (!form.customer.name) form.customer.name = user.name || ''
    if (!form.customer.email) form.customer.email = user.email || ''
    if (!form.customer.phone) form.customer.phone = user.phone || ''
  }

  function buildPayload(): CreateOrderPayload {
    const customer = {
      name: form.customer.name.trim(),
      email: form.customer.email.trim().toLowerCase(),
      phone: form.customer.phone.trim(),
    }
    const shipping = {
      province: form.shipping.province,
      city: form.shipping.city.trim(),
      address: form.shipping.address.trim(),
      reference: form.shipping.reference.trim(),
      lat: form.shipping.lat,
      lng: form.shipping.lng,
    }

    const idType = form.billing.idType
    const idNumber = idType === 'consumidor_final' ? '' : form.billing.idNumber.trim()
    // Consumidor final viaja vacío: el backend completa la factura con sus valores.
    const blank = { idType, idNumber: '', name: '', address: '', email: '', phone: '' }
    const own = {
      idType,
      idNumber,
      name: form.billing.name.trim(),
      address: form.billing.address.trim(),
      email: form.billing.email.trim().toLowerCase(),
      phone: form.billing.phone.trim(),
    }
    const same = { ...customer, idType, idNumber, address: shipping.address }
    const billing = idType === 'consumidor_final' ? blank : form.billingSameAsContact ? same : own

    return {
      items: cart.lines.map((line) => ({
        productId: line.productId,
        variantId: line.variantId,
        qty: line.qty,
      })),
      customer,
      shipping,
      billing,
      paymentMethod: form.paymentMethod,
    }
  }

  /** Tras una compra cerrada, el siguiente pedido empieza en limpio. */
  function reset() {
    Object.assign(form, blankForm())
    for (const field of FIELD_ORDER) delete errors[field]
  }

  return {
    form,
    errors,
    touch,
    validate,
    prefillFromSession,
    buildPayload,
    reset,
  }
}
