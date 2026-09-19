import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import {
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useRouter,
  type RouteLocationRaw,
} from 'vue-router'

/**
 * Aviso de cambios sin guardar. Cubre las dos salidas: navegar dentro del panel
 * (modal propio, con BaseModal) y cerrar o recargar la pestaña (aviso del navegador).
 */
export function useUnsavedGuard(dirty: Ref<boolean>) {
  const router = useRouter()
  const asking = ref(false)
  let pending: RouteLocationRaw | null = null
  let allowed = false

  function guard(to: { fullPath: string }) {
    if (!dirty.value || allowed) return true
    pending = to.fullPath
    asking.value = true
    return false
  }

  onBeforeRouteLeave(guard)
  onBeforeRouteUpdate(guard)

  function stay() {
    asking.value = false
    pending = null
  }

  function leave() {
    asking.value = false
    allowed = true
    if (pending) router.push(pending).finally(() => (allowed = false))
    pending = null
  }

  /** Para navegar por código después de guardar o eliminar, sin que salte el aviso. */
  async function bypass(to: RouteLocationRaw, replace = false) {
    allowed = true
    try {
      await (replace ? router.replace(to) : router.push(to))
    } finally {
      allowed = false
    }
  }

  function onBeforeUnload(event: BeforeUnloadEvent) {
    if (!dirty.value) return
    event.preventDefault()
    event.returnValue = ''
  }

  onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
  onBeforeUnmount(() => window.removeEventListener('beforeunload', onBeforeUnload))

  return { asking, stay, leave, bypass }
}
