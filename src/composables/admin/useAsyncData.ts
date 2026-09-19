import { ref, type Ref } from 'vue'
import type { ApiError } from '@/types'

/**
 * Carga con sus tres estados de verdad: cargando, error y dato. Cada pantalla
 * del panel pinta los tres, así que el patrón vive en un solo sitio.
 *
 * `load` descarta respuestas viejas: si se pide la página 2 y enseguida la 3,
 * la 2 no pisa a la 3 aunque llegue después.
 */
export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref('')
  let ticket = 0

  async function load(options: { silent?: boolean } = {}): Promise<T | null> {
    const mine = ++ticket
    if (!options.silent) loading.value = true
    error.value = ''
    try {
      const result = await fetcher()
      if (mine !== ticket) return null
      data.value = result
      return result
    } catch (e) {
      if (mine !== ticket) return null
      error.value = (e as ApiError).message || 'Error'
      return null
    } finally {
      if (mine === ticket) loading.value = false
    }
  }

  return { data, loading, error, load }
}
