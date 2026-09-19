<script setup lang="ts">
import { checkoutCopy } from '@/config/copy.checkout'
import { useDeliveryPin } from '@/composables/checkout/useDeliveryPin'

// Punto de entrega opcional con la ubicación del dispositivo. Sin librería de
// mapas: se guardan las coordenadas y se verifican abriendo Google Maps.
const { locating, error, hasPin, label, link, locate, clear } = useDeliveryPin()
const text = checkoutCopy.location
</script>

<template>
  <div class="pin">
    <p class="pin__title">
      {{ text.title }} <span class="pin__optional">({{ checkoutCopy.fields.optional }})</span>
    </p>
    <p class="pin__lead">{{ text.lead }}</p>

    <div v-if="hasPin" class="pin__saved">
      <p class="pin__coords">
        <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
        <span>
          <strong>{{ text.saved }}</strong>
          <span class="pin__numbers">{{ label }}</span>
        </span>
      </p>
      <div class="pin__actions">
        <a class="pin__link" :href="link" target="_blank" rel="noopener">
          {{ text.viewMap }}
          <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
        </a>
        <button class="pin__link pin__link--quiet" type="button" @click="clear">
          {{ text.remove }}
        </button>
      </div>
    </div>

    <button v-else class="pin__button" type="button" :disabled="locating" @click="locate">
      <i
        :class="locating ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-location-crosshairs'"
        aria-hidden="true"
      ></i>
      {{ locating ? text.locating : text.use }}
    </button>

    <p class="pin__status" role="status" aria-live="polite">
      <span v-if="error" class="pin__error">{{ error }}</span>
    </p>
  </div>
</template>

<style scoped lang="scss">
.pin {
  @include flex(column, stretch, flex-start, 0.6rem);
  padding: 1rem;
  border: 1px dashed $line;
  border-radius: $radius-sm;
  background: $paper;

  &__title {
    font-size: $text-sm;
    font-weight: 600;
  }

  &__optional {
    font-weight: 400;
    color: $ink-soft;
  }

  &__lead {
    font-size: $text-xs;
    line-height: 1.5;
    color: $ink-soft;
  }

  &__button {
    @include flex(row, center, center, 0.5rem);
    @include transition;
    @include focus-ring;
    min-height: 3rem;
    padding: 0.7rem 1.2rem;
    border: 1px solid $ink;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;

    &:hover {
      background: $ink;
      color: $paper;
    }

    &:disabled {
      opacity: 0.6;
      pointer-events: none;
    }

    @include from('md') {
      align-self: flex-start;
    }
  }

  &__saved {
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__coords {
    @include flex(row, flex-start, flex-start, 0.6rem);
    font-size: $text-sm;
    color: $success-text;

    i {
      margin-top: 0.2rem;
    }

    strong {
      display: block;
    }
  }

  &__numbers {
    color: $ink-soft;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }

  &__actions {
    @include flex(row, center, flex-start, 1.25rem);
    flex-wrap: wrap;
  }

  &__link {
    @include flex(row, center, flex-start, 0.4rem);
    @include focus-ring;
    min-height: 2.75rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent;
    text-decoration: underline;
    text-underline-offset: 3px;

    &--quiet {
      color: $ink-soft;
      font-weight: 500;
    }
  }

  &__status:empty {
    display: none;
  }

  &__error {
    font-size: $text-xs;
    line-height: 1.5;
    color: $danger-text;
  }
}
</style>
