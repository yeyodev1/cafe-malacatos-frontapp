<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import CoffeeBean from '@/components/ui/CoffeeBean.vue'

// Sello tipográfico: el nombre y el origen girando alrededor de un grano.
// Es la composición del hero cuando todavía no hay foto de producto.
const ring = computed(
  () => `${site.name} · ${site.hero.eyebrow} · ${site.name} · ${site.hero.eyebrow} · `,
)
</script>

<template>
  <div class="seal" aria-hidden="true">
    <svg class="seal__ring" viewBox="0 0 400 400" data-hero-seal>
      <defs>
        <path id="seal-circle" d="M200,200 m-165,0 a165,165 0 1,1 330,0 a165,165 0 1,1 -330,0" />
      </defs>
      <circle class="seal__line" cx="200" cy="200" r="192" />
      <circle class="seal__line seal__line--inner" cx="200" cy="200" r="138" />
      <text class="seal__text">
        <textPath href="#seal-circle" textLength="1030" lengthAdjust="spacing">{{ ring }}</textPath>
      </text>
    </svg>
    <div class="seal__bean">
      <CoffeeBean tone="gold" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.seal {
  position: relative;
  width: 100%;
  aspect-ratio: 1;

  &__ring {
    display: block;
    width: 100%;
    height: 100%;
  }

  &__line {
    fill: none;
    stroke: rgba($gold, 0.55);
    stroke-width: 1;

    &--inner {
      stroke: rgba($gold, 0.25);
    }
  }

  &__text {
    font-family: $font-principal;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    fill: $gold;
  }

  &__bean {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30%;
    transform: translate(-50%, -50%) rotate(24deg);
  }
}
</style>
