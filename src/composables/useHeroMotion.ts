import type { Ref } from 'vue'
import { gsap } from 'gsap'
import { useMotion } from './useMotion'

// Posición, tamaño y velocidad de cada grano del hero: los más grandes se mueven
// más, como si estuvieran más cerca de la cámara.
export const HERO_BEANS = [
  { top: '14%', left: '6%', size: '2.4rem', rotate: '-24deg', speed: 0.25, tone: 'brown' },
  { top: '64%', left: '3%', size: '3.6rem', rotate: '38deg', speed: 0.6, tone: 'gold' },
  { top: '9%', left: '58%', size: '1.7rem', rotate: '70deg', speed: 0.18, tone: 'gold' },
  { top: '30%', left: '88%', size: '3rem', rotate: '-52deg', speed: 0.48, tone: 'brown' },
  { top: '78%', left: '76%', size: '2.1rem', rotate: '16deg', speed: 0.34, tone: 'brown' },
  { top: '86%', left: '40%', size: '1.5rem', rotate: '-80deg', speed: 0.15, tone: 'gold' },
] as const

/** Agrupa las palabras del titular por renglón real, según dónde las dejó el navegador. */
function groupByLine(words: HTMLElement[]): HTMLElement[][] {
  const lines = new Map<number, HTMLElement[]>()
  words.forEach((word) => {
    const top = Math.round((word.parentElement ?? word).offsetTop)
    lines.set(top, [...(lines.get(top) ?? []), word])
  })
  return [...lines.entries()].sort((a, b) => a[0] - b[0]).map(([, group]) => group)
}

/**
 * Hero: entrada con el titular revelado por líneas y, ligado al scroll,
 * parallax de la imagen, del texto y de los granos a distinta velocidad.
 * La entrada y el parallax usan elementos distintos (interno / externo) para
 * que ningún tween pelee con otro por la misma propiedad.
 */
export function useHeroMotion(root: Ref<HTMLElement | null>) {
  return useMotion(root, ({ desktop }) => {
    const el = root.value
    if (!el) return
    const q = gsap.utils.selector(el)

    // Entrada
    const intro = gsap.timeline({ delay: 0.15 })
    groupByLine(q('[data-hero-word]') as HTMLElement[]).forEach((line, index) => {
      intro.from(line, { yPercent: 118, duration: 1.15, ease: 'power4.out' }, index * 0.13)
    })
    intro
      .from(
        q('[data-hero-fade]'),
        { y: 22, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 },
        0.45,
      )
      .from(
        q('[data-hero-visual-inner]'),
        { opacity: 0, scale: 0.93, yPercent: 6, duration: 1.4, ease: 'power3.out' },
        0.25,
      )
      .from(q('[data-bean-inner]'), { opacity: 0, duration: 1.2, stagger: 0.07 }, 0.4)

    // Scroll: en móvil la amplitud baja a menos de la mitad y nada hace pin.
    const amp = desktop ? 1 : 0.4
    const scrollTrigger = {
      trigger: el,
      start: 'top top',
      end: 'bottom top',
      scrub: desktop ? true : 0.5,
      invalidateOnRefresh: true,
    }

    gsap.to(q('[data-hero-visual]'), { yPercent: 12 * amp, ease: 'none', scrollTrigger })
    gsap.to(q('[data-hero-content]'), {
      yPercent: -14 * amp,
      opacity: 0.1,
      ease: 'none',
      scrollTrigger,
    })

    ;(q('[data-bean]') as HTMLElement[]).forEach((bean) => {
      const speed = Number(bean.dataset.speed || 0.3)
      gsap.to(bean, {
        y: () => -window.innerHeight * speed * amp,
        rotation: speed * 60 * amp,
        ease: 'none',
        scrollTrigger,
      })
    })
  })
}

/**
 * Lo que depende de la foto (escalado de la imagen, giro del sello) va aparte:
 * la foto llega cuando responde el API y hay que rehacer solo esto, sin repetir
 * la entrada del titular.
 */
export function useHeroMediaMotion(root: Ref<HTMLElement | null>, visual: Ref<HTMLElement | null>) {
  return useMotion(visual, ({ desktop }) => {
    const el = visual.value
    if (!el || !root.value) return
    const q = gsap.utils.selector(el)
    const amp = desktop ? 1 : 0.4
    const scrollTrigger = {
      trigger: root.value,
      start: 'top top',
      end: 'bottom top',
      scrub: desktop ? true : 0.5,
    }

    gsap.fromTo(
      q('[data-hero-img]'),
      { scale: 1.02 },
      { scale: 1.02 + 0.12 * amp, ease: 'none', scrollTrigger },
    )
    gsap.to(q('[data-hero-seal]'), { rotation: 70 * amp, ease: 'none', scrollTrigger })
  })
}
