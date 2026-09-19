import { defineStore } from 'pinia'
import { productService } from '@/services/product.service'
import type { ApiError, Product } from '@/types'

type Status = 'idle' | 'loading' | 'ready' | 'error'

let pending: Promise<void> | null = null

/**
 * Catálogo público. La home (hero y destacados) y la tienda leen la misma lista,
 * así que se pide una vez y se comparte.
 */
export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [] as Product[],
    status: 'idle' as Status,
    error: '',
  }),

  getters: {
    sorted: (s) => [...s.items].sort((a, b) => a.sortOrder - b.sortOrder),
    isLoading: (s) => s.status === 'idle' || s.status === 'loading',
  },

  actions: {
    load(force = false): Promise<void> {
      if (this.status === 'ready' && !force) return Promise.resolve()
      if (pending) return pending

      this.status = 'loading'
      this.error = ''
      pending = productService
        .list()
        .then((items) => {
          this.items = items
          this.status = 'ready'
        })
        .catch((e: ApiError) => {
          this.error = e?.message || ''
          this.status = 'error'
        })
        .finally(() => {
          pending = null
        })
      return pending
    },
  },
})
