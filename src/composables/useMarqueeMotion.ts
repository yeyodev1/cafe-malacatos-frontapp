import type { Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotion } from './useMotion'

/**
 * Marquesina infinita cuya velocidad y sentido siguen al scroll.
 *
 * El track lleva el contenido duplicado y se desplaza -50% en bucle. Mientras la
 * banda está a la vista, la velocidad del scroll acelera el bucle (timeScale) y
 * luego vuelve sola a su ritmo de crucero. Sin JS o con reduce, la clase
 * `--running` no se pone y las insignias quedan como una fila estática.
 */
export function useMarqueeMotion(root: Ref<HTMLElement | null>, runningClass: string) {
  return useMotion(root, ({ desktop }) => {
    const el = root.value
    const track = el?.querySelector<HTMLElement>('[data-marquee-track]')
    if (!el || !track) return

    el.classList.add(runningClass)

    const loop = gsap.to(track, {
      xPercent: -50,
      ease: 'none',
      duration: desktop ? 38 : 26,
      repeat: -1,
    })
    // Arranca "a mitad de camino" para que también pueda retroceder sin toparse con el inicio.
    loop.totalTime(loop.duration() * 200)

    let direction = 1
    const settle = gsap
      .delayedCall(0.25, () => {
        gsap.to(loop, { timeScale: direction, duration: 1.4, ease: 'power2.out', overwrite: true })
      })
      .pause()

    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate(self) {
        const velocity = self.getVelocity()
        if (Math.abs(velocity) < 20) return
        direction = velocity < 0 ? -1 : 1
        const boost = gsap.utils.clamp(1, desktop ? 7 : 4, 1 + Math.abs(velocity) / 320)
        gsap.to(loop, { timeScale: direction * boost, duration: 0.3, overwrite: true })
        settle.restart(true)
      },
    })

    return () => el.classList.remove(runningClass)
  })
}
