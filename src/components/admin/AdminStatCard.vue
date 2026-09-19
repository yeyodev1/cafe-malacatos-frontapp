<script setup lang="ts">
// Cifra del panel que además es un atajo: toda la tarjeta lleva a la lista filtrada.
defineProps<{
  to: string
  label: string
  value: string
  hint: string
  icon: string
  /** Resalta la cifra cuando pide una acción (hay algo por revisar o enviar). */
  alert?: boolean
}>()
</script>

<template>
  <RouterLink :to="to" class="stat" :class="{ 'stat--alert': alert }">
    <span class="stat__label"><i :class="icon" aria-hidden="true"></i>{{ label }}</span>
    <span class="stat__value">{{ value }}</span>
    <span class="stat__hint">
      {{ hint }}<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </span>
  </RouterLink>
</template>

<style scoped lang="scss">
.stat {
  @include card;
  @include flex(column, flex-start, flex-start, 0.4rem);
  @include transition;
  @include focus-ring;
  padding: 1.1rem 1rem;
  border-radius: $radius-md;
  border-top: 3px solid $line;

  @include from('md') {
    padding: 1.4rem 1.5rem;
  }

  &:hover {
    border-color: $accent;
    box-shadow: $shadow-sm;
    transform: translateY(-2px);
  }

  &--alert {
    border-top-color: $gold-deep;
    background: linear-gradient(180deg, rgba($gold-soft, 0.5), $surface 70%);
  }

  &__label {
    @include flex(row, center, flex-start, 0.5rem);
    color: $ink-soft;
    font-size: $text-sm;
    font-weight: 600;

    i {
      color: $accent;
    }
  }

  &__value {
    font-family: $font-display;
    font-size: $display-sm;
    font-weight: 500;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }

  &__hint {
    @include flex(row, center, flex-start, 0.4rem);
    color: $accent;
    font-size: $text-xs;
    font-weight: 600;

    i {
      font-size: 0.7rem;
    }
  }
}
</style>
