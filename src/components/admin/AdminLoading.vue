<script setup lang="ts">
import { adminCopy } from '@/config/copy.admin'

// Esqueleto de carga: filas que laten en vez de un spinner suelto en media pantalla.
withDefaults(defineProps<{ rows?: number }>(), { rows: 4 })
</script>

<template>
  <div class="loading" role="status" aria-live="polite">
    <span class="visually-hidden">{{ adminCopy.common.loading }}</span>
    <div v-for="n in rows" :key="n" class="loading__row" aria-hidden="true">
      <span class="loading__bar loading__bar--short"></span>
      <span class="loading__bar"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading {
  @include flex(column, stretch, flex-start, 0.75rem);

  &__row {
    @include card;
    @include flex(column, stretch, flex-start, 0.6rem);
    padding: 1.1rem 1rem;
  }

  &__bar {
    height: 0.8rem;
    border-radius: $radius-pill;
    background: $sand;
    animation: loading-pulse 1.4s ease-in-out infinite;

    &--short {
      width: 38%;
      background: $line;
    }
  }
}

@keyframes loading-pulse {
  50% {
    opacity: 0.45;
  }
}
</style>
