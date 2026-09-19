<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { cldUrl } from '@/utils/image'
import { useBodyScroll } from '@/composables/useBodyScroll'

// El comprobante se revisa con lupa: monto, fecha y cuenta. Por eso se abre a pantalla completa.
const text = adminCopy.order
defineProps<{ url: string }>()

const zoomed = ref(false)
useBodyScroll(zoomed)

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') zoomed.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <figure class="proof">
    <figcaption class="proof__title">{{ text.proofTitle }}</figcaption>
    <button type="button" class="proof__open" @click="zoomed = true">
      <img :src="cldUrl(url, 900)" :alt="text.proofAlt" class="proof__img" loading="lazy" />
      <span class="proof__zoom">
        <i class="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i>{{ text.proofZoom }}
      </span>
    </button>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="zoomed"
          class="proof__lightbox"
          role="dialog"
          aria-modal="true"
          :aria-label="text.proofTitle"
          data-lenis-prevent
          @click.self="zoomed = false"
        >
          <button type="button" class="proof__close" @click="zoomed = false">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>{{ text.proofClose }}
          </button>
          <img :src="cldUrl(url, 1800)" :alt="text.proofAlt" class="proof__full" />
        </div>
      </Transition>
    </Teleport>
  </figure>
</template>

<style scoped lang="scss">
.proof {
  @include flex(column, stretch, flex-start, 0.5rem);

  &__title {
    font-size: $text-sm;
    font-weight: 700;
  }

  &__open {
    @include focus-ring;
    position: relative;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $sand;
    overflow: hidden;
    cursor: zoom-in;
  }

  &__img {
    width: 100%;
    max-height: 26rem;
    object-fit: contain;
  }

  &__zoom {
    @include flex(row, center, center, 0.5rem);
    position: absolute;
    right: 0.6rem;
    bottom: 0.6rem;
    min-height: 2.5rem;
    padding: 0.4rem 0.9rem;
    border-radius: $radius-pill;
    background: $roast;
    color: $paper;
    font-size: $text-xs;
    font-weight: 700;
  }

  &__lightbox {
    @include flex(column, center, flex-start, 0.75rem);
    position: fixed;
    inset: 0;
    z-index: 250;
    padding: 1rem;
    background: rgba($roast, 0.94);
    overflow: auto;
  }

  &__close {
    @include flex(row, center, center, 0.5rem);
    @include focus-ring($gold);
    align-self: flex-end;
    flex: 0 0 auto;
    min-height: 2.75rem;
    padding: 0.5rem 1.1rem;
    border-radius: $radius-pill;
    background: $paper;
    color: $ink;
    font-size: $text-sm;
    font-weight: 700;
  }

  &__full {
    width: auto;
    max-width: 100%;
    margin: auto;
    border-radius: $radius-sm;
  }
}
</style>
