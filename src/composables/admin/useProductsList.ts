import { ref } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { formatCents } from '@/utils/money'
import { useAsyncData } from './useAsyncData'
import type { ApiError, Product, ProductVariant } from '@/types'

/** Una presentación solo se vende en línea con peso y precio mayores a cero. */
export function isSellable(
  variant: Pick<ProductVariant, 'weightGrams' | 'priceCents' | 'isActive'>,
) {
  return variant.isActive && variant.weightGrams > 0 && variant.priceCents > 0
}

/** "$3.50 – $7.00" con las presentaciones activas; una sola cifra si coinciden. */
export function priceRange(product: Product): string {
  const prices = product.variants.filter((v) => v.isActive).map((v) => v.priceCents)
  if (!prices.length) return ''
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return min === max ? formatCents(min) : `${formatCents(min)} – ${formatCents(max)}`
}

export function useProductsList() {
  const text = adminCopy.products
  const toast = useToastStore()
  const list = useAsyncData<Product[]>(() => adminService.products())
  const togglingId = ref('')

  /** Publicar o pasar a borrador de un toque: se pinta al instante y se revierte si falla. */
  async function setPublished(product: Product, value: boolean) {
    if (togglingId.value) return
    togglingId.value = product.id
    const previous = product.isPublished
    product.isPublished = value
    try {
      const saved = await adminService.updateProduct(product.id, { isPublished: value })
      product.isPublished = saved.isPublished
      toast.success(value ? text.publishedToast(product.name) : text.draftToast(product.name))
    } catch (e) {
      product.isPublished = previous
      toast.error((e as ApiError).message)
    } finally {
      togglingId.value = ''
    }
  }

  return { list, togglingId, setPublished }
}
