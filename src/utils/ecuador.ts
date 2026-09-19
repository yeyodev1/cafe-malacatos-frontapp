/**
 * Datos y validaciones propias de Ecuador: provincias para el envío y los
 * algoritmos de dígito verificador de cédula y RUC que pide la factura.
 */

/** Las 24 provincias, escritas igual que las zonas de envío del backend. */
export const PROVINCES = [
  'Azuay',
  'Bolívar',
  'Cañar',
  'Carchi',
  'Chimborazo',
  'Cotopaxi',
  'El Oro',
  'Esmeraldas',
  'Galápagos',
  'Guayas',
  'Imbabura',
  'Loja',
  'Los Ríos',
  'Manabí',
  'Morona Santiago',
  'Napo',
  'Orellana',
  'Pastaza',
  'Pichincha',
  'Santa Elena',
  'Santo Domingo de los Tsáchilas',
  'Sucumbíos',
  'Tungurahua',
  'Zamora Chinchipe',
] as const

export type Province = (typeof PROVINCES)[number]

export function onlyDigits(value: string): string {
  return (value || '').replace(/\D/g, '')
}

/** Los dos primeros dígitos son la provincia de emisión: 01 a 24, o 30 para el exterior. */
function hasValidProvinceCode(digits: string): boolean {
  const code = Number(digits.slice(0, 2))
  return (code >= 1 && code <= 24) || code === 30
}

/** Módulo 10 sobre los nueve primeros dígitos: es el verificador de la cédula. */
function passesModulo10(digits: string): boolean {
  const sum = digits
    .slice(0, 9)
    .split('')
    .reduce((acc, char, index) => {
      const product = Number(char) * (index % 2 === 0 ? 2 : 1)
      return acc + (product > 9 ? product - 9 : product)
    }, 0)
  const check = (10 - (sum % 10)) % 10
  return check === Number(digits[9])
}

/** Módulo 11 con los coeficientes del SRI; `checkIndex` es la posición del verificador. */
function passesModulo11(digits: string, coefficients: number[], checkIndex: number): boolean {
  const sum = coefficients.reduce((acc, factor, index) => acc + Number(digits[index]) * factor, 0)
  const remainder = sum % 11
  const check = remainder === 0 ? 0 : 11 - remainder
  // Un resultado de 10 no puede ser un dígito: ese número no existe.
  return check !== 10 && check === Number(digits[checkIndex])
}

export function isValidCedula(value: string): boolean {
  const digits = (value || '').trim()
  if (!/^\d{10}$/.test(digits)) return false
  if (!hasValidProvinceCode(digits)) return false
  // El tercer dígito de una persona natural va de 0 a 5.
  if (Number(digits[2]) > 5) return false
  return passesModulo10(digits)
}

export function isValidRuc(value: string): boolean {
  const digits = (value || '').trim()
  if (!/^\d{13}$/.test(digits)) return false
  if (!hasValidProvinceCode(digits)) return false

  const third = Number(digits[2])

  // Persona natural: la cédula más el establecimiento (001 en adelante).
  if (third <= 5) return isValidCedula(digits.slice(0, 10)) && digits.slice(10) !== '000'

  // Entidad pública: verificador en la novena posición y establecimiento de cuatro dígitos.
  if (third === 6) {
    return passesModulo11(digits, [3, 2, 7, 6, 5, 4, 3, 2], 8) && digits.slice(9) !== '0000'
  }

  // Sociedad privada o extranjero sin cédula.
  if (third === 9) {
    return passesModulo11(digits, [4, 3, 2, 7, 6, 5, 4, 3, 2], 9) && digits.slice(10) !== '000'
  }

  return false
}

/**
 * Teléfono como lo espera Payphone: con "+" y código de país. Un celular
 * escrito "0985 366 039" sale como "+593985366039".
 */
export function toInternationalPhone(value: string): string {
  const raw = (value || '').trim()
  const digits = onlyDigits(raw)
  if (!digits) return ''
  if (raw.startsWith('+')) return `+${digits}`
  if (digits.startsWith('593')) return `+${digits}`
  if (digits.startsWith('0')) return `+593${digits.slice(1)}`
  return `+593${digits}`
}
