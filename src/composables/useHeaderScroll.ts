import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Estado del header según el scroll: `scrolled` lo vuelve sólido y `hidden` lo
 * esconde al bajar y lo devuelve al subir. Un solo listener pasivo, con la
 * lectura agrupada en requestAnimationFrame.
 */
export function useHeaderScroll(solidAfter = 24, hideAfter = 180) {
  const scrolled = ref(false)
  const hidden = ref(false)

  let lastY = 0
  let frame = 0

  function read() {
    frame = 0
    const y = Math.max(0, window.scrollY)
    const delta = y - lastY

    scrolled.value = y > solidAfter
    // Umbral pequeño para que el rebote de un trackpad no lo haga parpadear.
    if (y < hideAfter) hidden.value = false
    else if (delta > 6) hidden.value = true
    else if (delta < -6) hidden.value = false

    if (Math.abs(delta) > 6 || y < hideAfter) lastY = y
  }

  function onScroll() {
    if (!frame) frame = requestAnimationFrame(read)
  }

  onMounted(() => {
    lastY = window.scrollY
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    if (frame) cancelAnimationFrame(frame)
  })

  return { scrolled, hidden }
}
