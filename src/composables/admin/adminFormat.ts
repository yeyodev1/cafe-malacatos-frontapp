/**
 * Conversión entre lo que escribe la dueña (dólares, con punto o coma) y lo
 * que habla el API (enteros en centavos). Nada de restas ni sumas en coma
 * flotante: se redondea una sola vez, al convertir.
 */

const MONEY = /^\d+([.,]\d{1,2})?$/
const DECIMAL = /^\d+([.,]\d+)?$/
const INTEGER = /^\d+$/

/** '' → null (sin valor) · inválido → NaN · '4,5' → 450 */
export function dollarsToCents(input: string): number | null {
  const value = String(input ?? '').trim()
  if (!value) return null
  if (!MONEY.test(value)) return NaN
  return Math.round(parseFloat(value.replace(',', '.')) * 100)
}

export function centsToInput(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return ''
  return (cents / 100).toFixed(2)
}

/** '' → null · inválido → NaN */
export function parseInteger(input: string): number | null {
  const value = String(input ?? '').trim()
  if (!value) return null
  return INTEGER.test(value) ? parseInt(value, 10) : NaN
}

/** '' → null · inválido → NaN · acepta coma decimal */
export function parseDecimal(input: string): number | null {
  const value = String(input ?? '').trim()
  if (!value) return null
  return DECIMAL.test(value) ? parseFloat(value.replace(',', '.')) : NaN
}

export function isInvalid(value: number | null): boolean {
  return value !== null && Number.isNaN(value)
}

/** Mismo algoritmo que el backend, para que el slug que se ve sea el que se guarda. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Comparación tolerante (mayúsculas, tildes, espacios) para confirmar escribiendo un nombre. */
export function sameText(a: string, b: string): boolean {
  const clean = (text: string) =>
    text.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
  return clean(a) === clean(b)
}

/** Fórmula de envío del contrato: base + max(0, ceil(kg - incluidos)) * porKg. */
export function shippingCostCents(
  baseCents: number,
  includedKg: number,
  extraPerKgCents: number,
  weightKg: number,
): { totalCents: number; extraKg: number } {
  const extraKg = Math.max(0, Math.ceil(weightKg - includedKg))
  return { totalCents: baseCents + extraKg * extraPerKgCents, extraKg }
}

const dateTime = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : dateTime.format(date)
}

/**
 * Deja un teléfono ecuatoriano listo para wa.me: solo dígitos y con 593.
 * "0985 366 039" → "593985366039". Si ya trae código de país se respeta.
 */
export function toWhatsappNumber(phone: string): string {
  const digits = String(phone ?? '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('593')) return digits
  if (digits.startsWith('0')) return `593${digits.slice(1)}`
  return digits.length === 9 ? `593${digits}` : digits
}
