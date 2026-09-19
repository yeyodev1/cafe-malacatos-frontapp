import { formatMoney } from './format'

/** El API habla en centavos enteros; la interfaz, en dólares. */
export function formatCents(cents: number): string {
  return formatMoney((cents || 0) / 100)
}

/** Precio en dólares con dos decimales y punto, como lo pide schema.org. */
export function centsToDecimal(cents: number): string {
  return ((cents || 0) / 100).toFixed(2)
}

/** Peso legible: gramos hasta 999, después kilos con un decimal si hace falta. */
export function formatWeight(grams: number): string {
  if (grams < 1000) return `${grams} g`
  const kg = grams / 1000
  return `${Number.isInteger(kg) ? kg : kg.toFixed(1)} kg`
}
