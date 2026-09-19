import { defineStore } from 'pinia'
import type { CartLine, Product, ProductVariant } from '@/types'

const STORAGE_KEY = 'cm_cart_v1'
const MIN_QTY = 1
const MAX_QTY = 99

function clampQty(qty: number): number {
  const value = Math.round(Number(qty))
  if (!Number.isFinite(value)) return MIN_QTY
  return Math.min(MAX_QTY, Math.max(MIN_QTY, value))
}

/** Una línea es un producto en una presentación concreta. */
export function lineKey(line: Pick<CartLine, 'productId' | 'variantId'>): string {
  return `${line.productId}:${line.variantId}`
}

function isLine(value: unknown): value is CartLine {
  const line = value as CartLine
  return Boolean(
    line &&
    typeof line.productId === 'string' &&
    typeof line.variantId === 'string' &&
    typeof line.unitPriceCents === 'number' &&
    typeof line.qty === 'number',
  )
}

function readStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isLine).map((line) => ({ ...line, qty: clampQty(line.qty) }))
  } catch {
    // Storage bloqueado o JSON corrupto: se empieza con el carrito vacío.
    return []
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    lines: readStorage(),
  }),

  getters: {
    count: (s) => s.lines.reduce((sum, line) => sum + line.qty, 0),
    subtotalCents: (s) => s.lines.reduce((sum, line) => sum + line.unitPriceCents * line.qty, 0),
    totalWeightGrams: (s) => s.lines.reduce((sum, line) => sum + line.weightGrams * line.qty, 0),
    isEmpty: (s) => s.lines.length === 0,
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lines))
      } catch {
        // Modo privado o cuota llena: el carrito vive lo que dure la pestaña.
      }
    },

    add(product: Product, variant: ProductVariant, qty = 1) {
      const key = lineKey({ productId: product.id, variantId: variant.id })
      const existing = this.lines.find((line) => lineKey(line) === key)

      if (existing) {
        existing.qty = clampQty(existing.qty + qty)
        // El precio pudo cambiar desde el admin: se refresca con el último visto.
        existing.unitPriceCents = variant.priceCents
        existing.weightGrams = variant.weightGrams
      } else {
        this.lines.push({
          productId: product.id,
          variantId: variant.id,
          slug: product.slug,
          name: product.name,
          variantLabel: variant.label,
          weightGrams: variant.weightGrams,
          unitPriceCents: variant.priceCents,
          image: product.images[0]?.url ?? '',
          qty: clampQty(qty),
        })
      }
      this.persist()
    },

    setQty(productId: string, variantId: string, qty: number) {
      const key = lineKey({ productId, variantId })
      const line = this.lines.find((item) => lineKey(item) === key)
      if (!line) return
      line.qty = clampQty(qty)
      this.persist()
    },

    remove(productId: string, variantId: string) {
      const key = lineKey({ productId, variantId })
      this.lines = this.lines.filter((line) => lineKey(line) !== key)
      this.persist()
    },

    clear() {
      this.lines = []
      this.persist()
    },
  },
})
