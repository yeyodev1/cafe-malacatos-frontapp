import { useRoute } from 'vue-router'
import { scrollToElement, scrollToTop } from './useSmoothScroll'

/**
 * Navegación principal: qué enlace está activo y cómo se baja a una sección.
 *
 * RouterLink ignora el hash al marcar activos ("/", "/#historia" y "/#contacto"
 * quedarían activos a la vez en la home), así que se calcula acá.
 */
export function useSiteNav() {
  const route = useRoute()

  function isActive(to: string): boolean {
    const [path, hash] = to.split('#')
    if (hash) return route.path === path && route.hash === `#${hash}`
    if (path === '/') return route.path === '/' && !route.hash
    if (path === '/tienda') return route.path === '/tienda' || route.path.startsWith('/producto/')
    return route.path === path
  }

  /** Si ya estamos en la home, el router no vuelve a navegar al mismo hash: se baja a mano. */
  function onNavigate(to: string) {
    const [path, hash] = to.split('#')
    if (route.path !== (path || '/')) return
    window.setTimeout(() => {
      if (hash) {
        const target = document.getElementById(hash)
        if (target) scrollToElement(target, 0)
      } else {
        scrollToTop()
      }
    }, 60)
  }

  return { isActive, onNavigate }
}
