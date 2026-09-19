import { computed } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { adminService } from '@/services/admin.service'
import { formatCents } from '@/utils/money'
import { useAdminStats } from './useAdminStats'
import { useAsyncData } from './useAsyncData'
import type { Order } from '@/types'

/**
 * Panel: las cuatro cifras como atajos y, arriba, lo que espera una acción.
 * Primero los comprobantes por revisar (hay un cliente esperando respuesta) y
 * después lo pagado que falta despachar; dentro de cada grupo, lo más antiguo primero.
 */
export function useDashboard() {
  const text = adminCopy.dashboard.stats
  const { stats, loading: statsLoading, error: statsError, refresh } = useAdminStats()

  const action = useAsyncData<Order[]>(async () => {
    const [toVerify, toShip] = await Promise.all([
      adminService.orders({ status: 'awaiting_verification' }),
      adminService.orders({ status: 'paid' }),
    ])
    const oldestFirst = (a: Order, b: Order) => a.createdAt.localeCompare(b.createdAt)
    return [...toVerify.items.sort(oldestFirst), ...toShip.items.sort(oldestFirst)]
  })

  const cards = computed(() => {
    const s = stats.value
    if (!s) return []
    return [
      {
        ...text.pendingVerification,
        value: String(s.pendingVerification),
        to: '/admin/ordenes?status=awaiting_verification',
        icon: 'fa-solid fa-magnifying-glass-dollar',
        alert: s.pendingVerification > 0,
      },
      {
        ...text.toShip,
        value: String(s.toShip),
        to: '/admin/ordenes?status=paid',
        icon: 'fa-solid fa-box-open',
        alert: s.toShip > 0,
      },
      {
        ...text.ordersToday,
        value: String(s.ordersToday),
        to: '/admin/ordenes',
        icon: 'fa-solid fa-receipt',
        alert: false,
      },
      {
        ...text.revenueMonth,
        value: formatCents(s.revenueMonthCents),
        to: '/admin/ordenes',
        icon: 'fa-solid fa-sack-dollar',
        alert: false,
      },
    ]
  })

  function load() {
    // Las cifras ya las pide el layout al entrar; aquí solo si faltan.
    if (!stats.value && !statsLoading.value) refresh()
    action.load()
  }

  function retry() {
    refresh()
    action.load()
  }

  return { cards, stats, statsLoading, statsError, action, load, retry }
}
