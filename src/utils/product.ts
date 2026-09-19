import { copy } from '@/config/copy'
import { formatCents } from './money'
import type { Product, ProductVariant } from '@/types'

export function activeVariants(product: Product): ProductVariant[] {
  return (product.variants || []).filter((variant) => variant.isActive !== false)
}

export function cheapestVariant(product: Product): ProductVariant | null {
  const variants = activeVariants(product)
  if (!variants.length) return null
  return variants.reduce((min, variant) => (variant.priceCents < min.priceCents ? variant : min))
}

/** "Al por mayor: $4.50 desde 12 unidades". Informativo: no se aplica en el checkout. */
export function wholesaleNote(variant: ProductVariant | null): string {
  if (!variant || !variant.wholesalePriceCents || !variant.wholesaleMinQty) return ''
  const { wholesalePrefix, wholesaleFrom, wholesaleUnits } = copy.product
  return `${wholesalePrefix} ${formatCents(variant.wholesalePriceCents)} ${wholesaleFrom} ${variant.wholesaleMinQty} ${wholesaleUnits}`
}
