import { onMounted, ref } from 'vue'
import { orderService } from '@/services/order.service'
import type { ApiError, Order } from '@/types'

/** Pedidos hechos con la sesión abierta (`GET /orders/mine`), del más nuevo al más viejo. */
export function useMyOrders() {
  const orders = ref<Order[]>([])
  const loading = ref(true)
  const error = ref('')

  async function load() {
    loading.value = true
    error.value = ''
    try {
      orders.value = await orderService.mine()
    } catch (e) {
      error.value = (e as ApiError).message
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { orders, loading, error, load }
}
