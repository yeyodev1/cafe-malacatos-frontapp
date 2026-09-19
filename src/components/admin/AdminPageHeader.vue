<script setup lang="ts">
// Cabecera de cada pantalla: migas de vuelta, título, bajada y acciones a la derecha.
defineProps<{
  title: string
  lead?: string
  eyebrow?: string
  backTo?: string
  backLabel?: string
}>()
</script>

<template>
  <header class="page-head">
    <RouterLink v-if="backTo" :to="backTo" class="page-head__back">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>{{ backLabel }}
    </RouterLink>
    <div class="page-head__row">
      <div class="page-head__text">
        <p v-if="eyebrow" class="page-head__eyebrow">{{ eyebrow }}</p>
        <h1 class="page-head__title">{{ title }}</h1>
        <p v-if="lead" class="page-head__lead">{{ lead }}</p>
      </div>
      <div class="page-head__actions"><slot /></div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.page-head {
  @include flex(column, stretch, flex-start, 0.75rem);
  margin-bottom: 1.5rem;

  @include from('md') {
    margin-bottom: 2rem;
  }

  &__back {
    @include flex(row, center, flex-start, 0.5rem);
    @include focus-ring;
    align-self: flex-start;
    min-height: 2.75rem;
    color: $accent;
    font-size: $text-sm;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  &__row {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.45rem);
    min-width: 0;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 500);
    overflow-wrap: anywhere;
  }

  &__lead {
    max-width: 60ch;
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    flex-shrink: 0;

    &:empty {
      display: none;
    }
  }
}
</style>
