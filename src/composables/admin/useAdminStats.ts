import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import type { AdminStats } from '@/types'

// Estado de módulo: la navegación (globo de pendientes) y el panel leen lo mismo,
// y el detalle de una orden lo refresca después de aprobar o enviar.
const stats = ref<AdminStats | null>(null)
const loading = ref(false)
const error = ref('')

async function refresh() {
  loading.value = true
  error.value = ''
  try {
    stats.value = await adminService.stats()
  } catch (e) {
    error.value = (e as { message?: string }).message || 'Error'
  } finally {
    loading.value = false
  }
}

export function useAdminStats() {
  return { stats, loading, error, refresh }
}
