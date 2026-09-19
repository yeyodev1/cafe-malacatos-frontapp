import type { Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotion, type MotionEnv } from './useMotion'

/**
 * Entradas al hacer scroll, declaradas en el template:
 *   data-reveal          el elemento sube y aparece al entrar al viewport
 *   data-reveal-group    sus hijos [data-reveal-item] entran escalonados
 *
 * Solo se animan transform y opacity. El estado oculto lo pone gsap.from, así
 * que sin JS (o con reduce) todo queda visible.
 */
export function revealIn(root: HTMLElement, env: MotionEnv) {
  const distance = env.desktop ? 36 : 22

  gsap.utils.toArray<HTMLElement>('[data-reveal]', root).forEach((el) => {
    gsap.from(el, {
      y: distance,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })

  gsap.utils.toArray<HTMLElement>('[data-reveal-group]', root).forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('[data-reveal-item]')
    if (!items.length) return
    gsap.set(items, { y: distance + 12, opacity: 0 })
    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.09,
          overwrite: true,
        }),
    })
  })
}

export function useScrollReveal(scope: Ref<HTMLElement | null>) {
  return useMotion(scope, (env) => {
    if (scope.value) revealIn(scope.value, env)
  })
}
