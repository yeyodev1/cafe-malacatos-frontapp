import type { Ref } from 'vue'
import { gsap } from 'gsap'
import { revealIn } from './useScrollReveal'
import { useMotion } from './useMotion'

/**
 * "Nuestra historia".
 *
 * Escritorio: el escenario se fija y los capítulos se suceden con scrub mientras
 * la barra dorada avanza. La clase `pinnedClass` cambia el layout a capas
 * apiladas; se pone desde acá para que sin JS (o con reduce) los capítulos sigan
 * siendo una lista normal, legible de arriba abajo.
 *
 * Móvil: sin pin. Un scroll atrapado en 360 px se siente roto, así que los
 * capítulos se apilan y solo aparecen al entrar.
 */
export function useStoryMotion(root: Ref<HTMLElement | null>, pinnedClass: string) {
  return useMotion(root, (env) => {
    const el = root.value
    if (!el) return

    revealIn(el, env)
    if (!env.desktop) {
      gsap.utils.toArray<HTMLElement>('[data-chapter]', el).forEach((chapter) => {
        gsap.from(chapter, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: chapter, start: 'top 85%', once: true },
        })
      })
      return
    }

    const stage = el.querySelector<HTMLElement>('[data-story-stage]')
    const bar = el.querySelector<HTMLElement>('[data-story-bar]')
    const medias = gsap.utils.toArray<HTMLElement>('[data-chapter-media]', el)
    const bodies = gsap.utils.toArray<HTMLElement>('[data-chapter-body]', el)
    const labels = gsap.utils.toArray<HTMLElement>('[data-story-label]', el)
    const total = bodies.length
    if (!stage || !bar || total < 2 || medias.length !== total || labels.length !== total) return

    el.classList.add(pinnedClass)

    gsap.set(medias.slice(1), { opacity: 0, scale: 1.08 })
    gsap.set(bodies.slice(1), { opacity: 0, yPercent: 35 })
    gsap.set(labels.slice(1), { opacity: 0.4 })

    const timeline = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * (total - 1) * 0.95)}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    // Cada capítulo ocupa una unidad de tiempo; la barra recorre todas de corrido.
    timeline.fromTo(bar, { scaleX: 1 / total }, { scaleX: 1, ease: 'none', duration: total - 1 }, 0)

    // Los tres arreglos salen del mismo v-for, así que comparten largo e índice.
    const at = <T>(list: T[], index: number) => list[index] as T

    for (let i = 1; i < total; i += 1) {
      const start = i - 1 + 0.2
      timeline
        .to(at(bodies, i - 1), { opacity: 0, yPercent: -35, duration: 0.3 }, start)
        .to(at(medias, i - 1), { opacity: 0, scale: 0.95, duration: 0.45 }, start)
        .to(at(labels, i - 1), { opacity: 0.4, duration: 0.3 }, start)
        .to(at(medias, i), { opacity: 1, scale: 1, duration: 0.5 }, start + 0.1)
        .to(at(bodies, i), { opacity: 1, yPercent: 0, duration: 0.35 }, start + 0.3)
        .to(at(labels, i), { opacity: 1, duration: 0.3 }, start + 0.3)
    }

    return () => el.classList.remove(pinnedClass)
  })
}
