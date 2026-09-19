import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { productService } from '@/services/product.service'
import { useProductsStore } from '@/stores/products'
import type { ApiError, Product } from '@/types'

type Status = 'loading' | 'ready' | 'not-found' | 'error'

/** Carga el producto de la ruta actual y expone su estado (cargando, listo, no existe, error). */
export function useProductDetail() {
  const route = useRoute()
  const catalog = useProductsStore()

  const product = ref<Product | null>(null)
  const status = ref<Status>('loading')

  // Cada carga lleva un número: si el usuario cambia de producto antes de que
  // responda el API, la respuesta vieja se descarta.
  let request = 0

  async function load() {
    const slug = String(route.params.slug || '')
    const current = ++request

    // Si el catálogo ya está en memoria se pinta al instante y se refresca por detrás.
    const cached = catalog.items.find((item) => item.slug === slug) ?? null
    product.value = cached
    status.value = cached ? 'ready' : 'loading'

    try {
      const data = await productService.getBySlug(slug)
      if (current !== request) return
      product.value = data
      status.value = 'ready'
    } catch (e) {
      if (current !== request || cached) return
      status.value = (e as ApiError).status === 404 ? 'not-found' : 'error'
    }
  }

  // Mismo componente, otro producto. Durante la transición de salida la ruta ya
  // es otra: solo se recarga si seguimos en la página de producto.
  watch(
    () => route.params.slug,
    () => {
      if (route.name === 'Product') load()
    },
    { immediate: true },
  )

  return { product, status, load }
}
