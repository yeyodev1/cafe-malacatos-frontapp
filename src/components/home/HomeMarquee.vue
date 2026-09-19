<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { useMarqueeMotion } from '@/composables/useMarqueeMotion'
import CoffeeBean from '@/components/ui/CoffeeBean.vue'

const root = ref<HTMLElement | null>(null)

// Cuatro copias: cada mitad del track (dos copias) debe ser más ancha que
// cualquier pantalla para que el salto del bucle nunca se vea.
const COPIES = 4

useMarqueeMotion(root, 'marquee--running')
</script>

<template>
  <div ref="root" class="marquee">
    <div class="marquee__track" data-marquee-track>
      <ul
        v-for="copy in COPIES"
        :key="copy"
        class="marquee__set"
        :class="{ 'marquee__set--clone': copy > 1 }"
        :aria-hidden="copy > 1 ? 'true' : undefined"
      >
        <li v-for="badge in site.badges" :key="badge" class="marquee__item">
          <span class="marquee__text">{{ badge }}</span>
          <span class="marquee__bean"><CoffeeBean tone="dark" /></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.marquee {
  overflow: hidden;
  padding-block: 1.1rem;
  // Brillo metálico de la funda: el único lugar donde el dorado es fondo.
  background: linear-gradient(
    100deg,
    $gold-deep 0%,
    $gold 28%,
    $gold-soft 50%,
    $gold 72%,
    $gold-deep 100%
  );
  color: $roast;

  @include from('md') {
    padding-block: 1.6rem;
  }

  // Estado base (sin JS o con movimiento reducido): una fila centrada que envuelve.
  &__set {
    @include flex(row, center, center);
    flex-wrap: wrap;
    row-gap: 0.4rem;
    list-style: none;

    &--clone {
      display: none;
    }
  }

  &__item {
    @include flex(row, center, flex-start, 1.25rem);
    padding-right: 1.25rem;

    @include from('md') {
      gap: 2.25rem;
      padding-right: 2.25rem;
    }
  }

  &__text {
    @include display($text-xl, 500);
    font-size: clamp(1.25rem, 1rem + 2vw, 2.6rem);
    font-style: italic;
    white-space: nowrap;
  }

  &__bean {
    flex: none;
    width: 0.9rem;
    rotate: 28deg;

    @include from('md') {
      width: 1.3rem;
    }
  }

  &--running {
    .marquee__track {
      display: flex;
      width: max-content;
      will-change: transform;
    }

    .marquee__set {
      flex: none;
      flex-wrap: nowrap;

      &--clone {
        display: flex;
      }
    }
  }
}
</style>
