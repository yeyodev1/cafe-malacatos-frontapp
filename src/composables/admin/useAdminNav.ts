import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminCopy } from '@/config/copy.admin'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { useAdminStats } from './useAdminStats'

export interface AdminNavItem {
  key: string
  label: string
  icon: string
  to: string
  /** En móvil solo caben cuatro en la barra: el resto vive bajo "Más". */
  primary: boolean
}

const text = adminCopy.nav

const items: AdminNavItem[] = [
  {
    key: 'dashboard',
    label: text.dashboard,
    icon: 'fa-solid fa-mug-hot',
    to: '/admin',
    primary: true,
  },
  {
    key: 'orders',
    label: text.orders,
    icon: 'fa-solid fa-receipt',
    to: '/admin/ordenes',
    primary: true,
  },
  {
    key: 'products',
    label: text.products,
    icon: 'fa-solid fa-bag-shopping',
    to: '/admin/productos',
    primary: true,
  },
  {
    key: 'customers',
    label: text.customers,
    icon: 'fa-solid fa-user-group',
    to: '/admin/clientes',
    primary: false,
  },
  {
    key: 'shipping',
    label: text.shipping,
    icon: 'fa-solid fa-truck',
    to: '/admin/envios',
    primary: false,
  },
  {
    key: 'settings',
    label: text.settings,
    icon: 'fa-solid fa-sliders',
    to: '/admin/ajustes',
    primary: false,
  },
]

export function useAdminNav() {
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const toast = useToastStore()
  const { stats } = useAdminStats()

  /** Lo que espera una acción suya: comprobantes por revisar y pedidos por despachar. */
  const pendingCount = computed(
    () => (stats.value?.pendingVerification || 0) + (stats.value?.toShip || 0),
  )

  function isActive(item: AdminNavItem): boolean {
    if (item.to === '/admin') return route.path === '/admin' || route.path === '/admin/'
    return route.path.startsWith(item.to)
  }

  function badgeFor(item: AdminNavItem): number {
    return item.key === 'orders' ? pendingCount.value : 0
  }

  async function logout() {
    userStore.clear()
    toast.info(text.loggedOut)
    await router.push('/login')
  }

  return {
    items,
    primaryItems: items.filter((item) => item.primary),
    secondaryItems: items.filter((item) => !item.primary),
    userName: computed(() => userStore.user?.name || userStore.user?.email || ''),
    isActive,
    badgeFor,
    logout,
  }
}
