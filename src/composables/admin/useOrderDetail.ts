import { computed, ref, watch, type Ref } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { useAdminStats } from './useAdminStats'
import { useAsyncData } from './useAsyncData'
import type { ApiError, Order } from '@/types'

export type OrderAction = 'approve' | 'ship' | 'deliver' | 'cancel' | 'invoice' | 'note'

/**
 * Detalle de una orden y sus acciones. Toda acción pasa por `run`: una sola a
 * la vez, aviso al terminar y, si el backend responde 409 (la orden cambió de
 * estado por otro lado), se muestra su mensaje tal cual y se vuelve a cargar.
 */
export function useOrderDetail(id: Ref<string>) {
  const text = adminCopy.order
  const toast = useToastStore()
  const { refresh: refreshStats } = useAdminStats()

  const {
    data: order,
    loading,
    error,
    load,
  } = useAsyncData<Order>(() => adminService.order(id.value))
  const busy = ref<OrderAction | ''>('')
  const noteDraft = ref('')
  const noteDirty = computed(() => noteDraft.value !== (order.value?.adminNote || ''))

  watch(id, () => load(), { immediate: true })
  watch(order, (value) => (noteDraft.value = value?.adminNote || ''))

  async function run(action: OrderAction, call: () => Promise<Order>, success: string) {
    if (busy.value || !order.value) return false
    busy.value = action
    try {
      order.value = await call()
      toast.success(success)
      if (action !== 'note' && action !== 'invoice') refreshStats()
      return true
    } catch (e) {
      const apiError = e as ApiError
      toast.error(apiError.message)
      if (apiError.status === 409) await load({ silent: true })
      return false
    } finally {
      busy.value = ''
    }
  }

  const approve = () => run('approve', () => adminService.approveTransfer(id.value), text.approved)
  const ship = (trackingNote: string) =>
    run('ship', () => adminService.shipOrder(id.value, trackingNote), text.shipped)
  const deliver = () => run('deliver', () => adminService.deliverOrder(id.value), text.delivered)
  const cancel = () => run('cancel', () => adminService.cancelOrder(id.value), text.cancelled)
  const setInvoice = (issued: boolean) =>
    run(
      'invoice',
      () => adminService.setInvoiceIssued(id.value, issued),
      issued ? text.invoiceOn : text.invoiceOff,
    )
  const saveNote = () =>
    run('note', () => adminService.setOrderNote(id.value, noteDraft.value.trim()), text.noteSaved)

  return {
    order,
    loading,
    error,
    load,
    busy,
    noteDraft,
    noteDirty,
    approve,
    ship,
    deliver,
    cancel,
    setInvoice,
    saveNote,
  }
}
