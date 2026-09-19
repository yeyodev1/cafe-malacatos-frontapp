import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderStatus } from '@/config/copy.admin'
import { adminService } from '@/services/admin.service'
import { useAsyncData } from './useAsyncData'
import type { Order, OrderStatus, Paginated } from '@/types'

/**
 * El filtro y la página viven en la URL (?status=&page=): así las cifras del
 * panel enlazan a la lista ya filtrada y "atrás" devuelve a donde se estaba.
 */
export function useOrdersList() {
  const route = useRoute()
  const router = useRouter()

  const status = computed<OrderStatus | ''>(() => {
    const value = String(route.query.status || '')
    return value in orderStatus ? (value as OrderStatus) : ''
  })
  const page = computed(() => Math.max(1, parseInt(String(route.query.page || '1'), 10) || 1))

  const list = useAsyncData<Paginated<Order>>(() =>
    adminService.orders({ status: status.value, page: page.value }),
  )

  function setStatus(value: OrderStatus | '') {
    router.push({ query: value ? { status: value } : {} })
  }

  function setPage(value: number) {
    router.push({ query: { ...route.query, page: value > 1 ? String(value) : undefined } })
  }

  watch([status, page], () => list.load(), { immediate: true })

  return { status, page, list, setStatus, setPage }
}
