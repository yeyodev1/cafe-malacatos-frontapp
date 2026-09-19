<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  video?: string
  poster?: string
}>()

const el = ref<HTMLVideoElement | null>(null)
const ready = ref(false)
let observer: IntersectionObserver | null = null

// Con "reducir movimiento" no se reproduce nada: queda el fotograma fijo del póster.
const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  const node = el.value
  if (!node || !props.video || reduced) return

  // El archivo no se pide hasta que el capítulo se acerca a la pantalla, y se pausa
  // al salir: tres videos en bucle fuera de vista gastan datos y batería por nada.
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (!node.src) node.src = props.video as string
          node.play().catch(() => {
            // Autoplay bloqueado (ahorro de datos, batería baja): se queda el póster.
          })
        } else {
          node.pause()
        }
      }
    },
    { rootMargin: '300px 0px' },
  )
  observer.observe(node)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <video
    v-if="video"
    ref="el"
    class="story-media"
    :class="{ 'story-media--ready': ready || reduced }"
    :poster="poster"
    muted
    loop
    playsinline
    preload="none"
    disablepictureinpicture
    tabindex="-1"
    @playing="ready = true"
  ></video>
</template>

<style scoped lang="scss">
.story-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  // Aparece sobre el degradado del capítulo solo cuando ya hay imagen que mostrar.
  opacity: 0;
  @include transition(opacity);

  &--ready,
  &[poster] {
    opacity: 1;
  }
}
</style>
