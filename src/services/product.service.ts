import APIBase from './httpBase'
import type { Product, ProductCategory } from '@/types'

class ProductService extends APIBase {
  /** Productos publicados, con sus variantes activas. */
  async list(category?: ProductCategory): Promise<Product[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : ''
    const { data } = await this.get<Product[]>(`products${query}`)
    return Array.isArray(data) ? data : []
  }

  async getBySlug(slug: string): Promise<Product> {
    const { data } = await this.get<Product>(`products/${encodeURIComponent(slug)}`)
    return data
  }
}

export const productService = new ProductService()
