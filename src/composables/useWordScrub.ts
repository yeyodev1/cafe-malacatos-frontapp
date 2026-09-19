import type { Ref } from 'vue'
import { gsap } from 'gsap'
import { revealIn } from './useScrollReveal'
import { useMotion } from './useMotion'

/**
 * Texto que se "enciende" palabra por palabra con el scroll.
 * Cada bloque [data-words] contiene spans [data-word]; se atenúan desde JS y el
 * scrub los lleva a opacidad plena. Sin JS el párrafo se lee completo.
 */
export function useWordScrub(root: Ref<HTMLElement | null>) {
  return useMotion(root, (env) => {
    const el = root.value
    if (!el) return

    revealIn(el, env)

    gsap.utils.toArray<HTMLElement>('[data-words]', el).forEach((block) => {
      const words = block.querySelectorAll<HTMLElement>('[data-word]')
      if (!words.length) return
      gsap.fromTo(
        words,
        { opacity: 0.18 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: {
            trigger: block,
            start: 'top 82%',
            end: env.desktop ? 'bottom 55%' : 'bottom 65%',
            scrub: env.desktop ? true : 0.4,
          },
        },
      )
    })
  })
}
