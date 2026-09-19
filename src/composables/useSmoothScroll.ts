import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Lenis from 'lenis'
import { ensureGsap } from './useMotion'

// Una sola instancia para toda la app; las secciones la consultan con getLenis().
let lenis: Lenis | null = null

export function getLenis(): Lenis | null {
  return lenis
}

/** Baja hasta un elemento con Lenis si está activo, o con el scroll nativo si no. */
export function scrollToElement(target: HTMLElement, offset = -72) {
  if (lenis) {
    lenis.scrollTo(target, { offset })
    return
  }
  const top = target.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: 'auto' })
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: 'auto' })
}

/**
 * Scroll suave global. Se llama una vez desde App.vue.
 *
 * Lenis corre sobre el ticker de GSAP y avisa a ScrollTrigger en cada scroll,
 * así ambos leen la misma posición en el mismo frame. Con
 * prefers-reduced-motion Lenis no se crea y el scroll queda nativo.
 */
export function useSmoothScroll() {
  const router = useRouter()
  const { gsap, ScrollTrigger } = ensureGsap()
  let mm: gsap.MatchMedia | null = null
  let stopRouterHook: (() => void) | null = null

  onMounted(() => {
    mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const instance = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: false })
      lenis = instance

      const onScroll = () => ScrollTrigger.update()
      const tick = (time: number) => instance.raf(time * 1000)
      instance.on('scroll', onScroll)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      // useBodyScroll congela el fondo con overflow en <body> (menú, modales):
      // Lenis mueve la ventana por código, así que hay que pararlo también.
      const syncLock = () => {
        if (document.body.style.overflow === 'hidden') instance.stop()
        else instance.start()
      }
      const observer = new MutationObserver(syncLock)
      observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })
      syncLock()

      return () => {
        observer.disconnect()
        gsap.ticker.remove(tick)
        instance.destroy()
        if (lenis === instance) lenis = null
      }
    })

    // Al cambiar de ruta se corta la inercia pendiente: si no, Lenis seguiría
    // animando hacia la posición de la página anterior después del salto arriba.
    stopRouterHook = router.afterEach((to, from) => {
      if (!lenis || to.path === from.path) return
      lenis.stop()
      lenis.start()
      if (document.body.style.overflow === 'hidden') lenis.stop()
    })
  })

  onBeforeUnmount(() => {
    stopRouterHook?.()
    mm?.revert()
  })
}
