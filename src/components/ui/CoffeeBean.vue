<script setup lang="ts">
// Grano de café dibujado en SVG: decoración pura, sin imágenes externas.
withDefaults(defineProps<{ tone?: 'gold' | 'brown' | 'dark' }>(), { tone: 'brown' })
</script>

<template>
  <svg
    class="bean"
    :class="`bean--${tone}`"
    viewBox="0 0 64 88"
    aria-hidden="true"
    focusable="false"
  >
    <ellipse class="bean__body" cx="32" cy="44" rx="28" ry="40" />
    <ellipse class="bean__shine" cx="22" cy="30" rx="9" ry="16" />
    <path class="bean__cut" d="M35 7 C 17 30, 47 58, 29 81" />
  </svg>
</template>

<style scoped lang="scss">
.bean {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;

  &__shine {
    fill: rgba($surface, 0.12);
  }

  &__cut {
    fill: none;
    stroke-width: 5;
    stroke-linecap: round;
  }

  &--brown {
    .bean__body {
      fill: $accent;
    }
    .bean__cut {
      stroke: $roast;
    }
  }

  &--gold {
    .bean__body {
      fill: $gold;
    }
    .bean__cut {
      stroke: $gold-deep;
    }
  }

  &--dark {
    .bean__body {
      fill: $roast;
    }
    .bean__cut {
      stroke: rgba($gold, 0.55);
    }
  }
}
</style>
