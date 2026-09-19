import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { gsap } from 'gsap'

/**
 * Inclinación sutil de una tarjeta siguiendo al mouse. Solo con puntero fino y
 * hover, y nunca con prefers-reduced-motion: en táctil no hay "hover" que seguir.
 * Anima únicamente rotationX / rotationY (transform).
 */
export function useTilt(target: Ref<HTMLElement | null>, max = 5) {
  let mm: gsap.MatchMedia | null = null

  onMounted(() => {
    const el = target.value
    if (!el) return

    mm = gsap.matchMedia()
    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      gsap.set(el, { transformPerspective: 900 })
      const rotateX = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' })
      const rotateY = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' })

      const onMove = (event: PointerEvent) => {
        const box = el.getBoundingClientRect()
        const x = (event.clientX - box.left) / box.width - 0.5
        const y = (event.clientY - box.top) / box.height - 0.5
        rotateY(x * max * 2)
        rotateX(-y * max * 2)
      }
      const onLeave = () => {
        rotateX(0)
        rotateY(0)
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      return () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      }
    })
  })

  onBeforeUnmount(() => mm?.revert())
}
