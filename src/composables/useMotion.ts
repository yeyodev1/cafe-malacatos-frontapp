import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

/** ScrollTrigger se registra una sola vez en toda la app. */
export function ensureGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger)
    // Varias secciones animan elementos opcionales (la foto del hero, el sello):
    // que falten es un caso normal, no un aviso en consola.
    gsap.config({ nullTargetWarn: false })
    registered = true
  }
  return { gsap, ScrollTrigger }
}

export interface MotionEnv {
  /** Escritorio: acá sí caben pin y parallax amplio. */
  desktop: boolean
  /** Puntero fino con hover: efectos que dependen del mouse. */
  fine: boolean
}

// `motion` hace de condición "siempre": sin ella matchMedia no llamaría al
// callback en un móvil táctil, donde ninguna de las otras condiciones se cumple.
const QUERIES = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 1024px)',
  fine: '(hover: hover) and (pointer: fine)',
}

let refreshTimer: number | undefined

/** Recalcula los triggers tras cargar imágenes o datos; agrupa llamadas seguidas. */
export function refreshScroll() {
  if (!registered) return
  window.clearTimeout(refreshTimer)
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120)
}

/**
 * Animaciones de una sección, acotadas a su elemento raíz.
 *
 * Todo lo que `setup` crea queda dentro de un gsap.context que se revierte al
 * desmontar, así no sobreviven triggers al cambiar de ruta. Con
 * prefers-reduced-motion no se ejecuta `setup`: el contenido se queda como lo
 * pinta el CSS, que siempre es visible. Los estados ocultos se definen desde
 * acá (gsap.from / gsap.set), nunca desde CSS.
 */
export function useMotion(
  scope: Ref<HTMLElement | null>,
  setup: (env: MotionEnv) => void | (() => void),
) {
  let ctx: gsap.Context | null = null
  let mm: gsap.MatchMedia | null = null

  function build() {
    const root = scope.value
    if (!root || ctx) return
    ensureGsap()

    ctx = gsap.context(() => {
      mm = gsap.matchMedia(root)
      mm.add(QUERIES, (context) => {
        const { reduce, desktop, fine } = context.conditions as Record<string, boolean>
        if (reduce) return
        // Si setup devuelve una limpieza (quitar una clase, un listener), matchMedia
        // la ejecuta al revertir o cuando cambia el breakpoint.
        return setup({ desktop: Boolean(desktop), fine: Boolean(fine) })
      })
    }, root)
  }

  function destroy() {
    mm?.revert()
    ctx?.revert()
    mm = null
    ctx = null
  }

  /** Cuando llegan datos y cambia el DOM animado: se rehace todo desde cero. */
  function rebuild() {
    destroy()
    build()
    refreshScroll()
  }

  onMounted(build)
  onBeforeUnmount(destroy)

  return { rebuild }
}
