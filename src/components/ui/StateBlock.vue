<script setup lang="ts">
// Estado vacío o de error: un bloque con título, texto y acciones en el slot.
withDefaults(
  defineProps<{
    title: string
    text?: string
    icon?: string
    tone?: 'soft' | 'error'
    /** h1 cuando el estado ES la página (producto no encontrado); h2 dentro de una vista con título. */
    headingLevel?: 'h1' | 'h2'
  }>(),
  {
    headingLevel: 'h2',
    text: '',
    icon: 'fa-solid fa-mug-hot',
    tone: 'soft',
  },
)
</script>

<template>
  <div class="state" :class="`state--${tone}`" :role="tone === 'error' ? 'alert' : undefined">
    <span class="state__icon"><i :class="icon" aria-hidden="true"></i></span>
    <component :is="headingLevel" class="state__title">{{ title }}</component>
    <p v-if="text" class="state__text">{{ text }}</p>
    <div class="state__actions"><slot /></div>
  </div>
</template>

<style scoped lang="scss">
.state {
  @include flex(column, center, center, 0.9rem);
  width: 100%;
  padding: 3rem 1.25rem;
  border: 1px dashed $line;
  border-radius: $radius-md;
  background: $sand;
  text-align: center;

  @include from('md') {
    padding: 4.5rem 2rem;
  }

  &--error {
    background: $danger-bg;
    border-color: rgba($danger, 0.35);
  }

  &__icon {
    @include flex(row, center, center);
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background: $gold-soft;
    color: $accent-deep;
    font-size: 1.25rem;
  }

  &__title {
    @include display($display-sm);
    max-width: 22ch;
  }

  &__text {
    color: $ink-soft;
    max-width: 48ch;
  }

  &__actions {
    @include flex(row, center, center, 0.75rem);
    flex-wrap: wrap;
    margin-top: 0.5rem;

    &:empty {
      display: none;
    }
  }
}
</style>
