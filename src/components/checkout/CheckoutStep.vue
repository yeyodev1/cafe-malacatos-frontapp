<script setup lang="ts">
// Marco de cada paso del checkout: número, título y los campos en el slot.
defineProps<{ step: number; title: string; lead?: string }>()
</script>

<template>
  <fieldset class="step">
    <legend class="step__legend">
      <span class="step__number" aria-hidden="true">{{ step }}</span>
      <span class="step__title">{{ title }}</span>
    </legend>
    <p v-if="lead" class="step__lead">{{ lead }}</p>
    <div class="step__body"><slot /></div>
  </fieldset>
</template>

<style scoped lang="scss">
.step {
  @include card;
  min-width: 0;
  padding: 1.5rem 1.1rem;
  border-radius: $radius-md;

  @include from('md') {
    padding: 2rem;
  }

  // Un legend no admite display: flex en todos los navegadores: se usa float para
  // que quede dentro de la tarjeta y los hijos se alinean con inline-flex.
  &__legend {
    float: left;
    width: 100%;
    padding: 0;
  }

  &__number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.9rem;
    height: 1.9rem;
    margin-right: 0.6rem;
    border-radius: 50%;
    background: $ink;
    color: $paper;
    font-size: $text-sm;
    font-weight: 600;
    vertical-align: middle;
  }

  &__title {
    @include display($text-xl, 500);
    vertical-align: middle;
  }

  &__lead {
    clear: both;
    padding-top: 0.5rem;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__body {
    @include flex(column, stretch, flex-start, 1rem);
    clear: both;
    padding-top: 1.25rem;
  }
}
</style>
