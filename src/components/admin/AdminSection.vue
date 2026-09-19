<script setup lang="ts">
// Bloque de contenido del panel: papel blanco, título con serif y una bajada opcional.
withDefaults(
  defineProps<{
    title?: string
    lead?: string
    icon?: string
    tone?: 'plain' | 'highlight' | 'danger'
  }>(),
  { title: '', lead: '', icon: '', tone: 'plain' },
)
</script>

<template>
  <section class="section" :class="`section--${tone}`">
    <header v-if="title" class="section__head">
      <div class="section__heading">
        <h2 class="section__title">
          <i v-if="icon" :class="icon" aria-hidden="true"></i>{{ title }}
        </h2>
        <p v-if="lead" class="section__lead">{{ lead }}</p>
      </div>
      <div class="section__aside"><slot name="aside" /></div>
    </header>
    <slot />
  </section>
</template>

<style scoped lang="scss">
.section {
  @include card;
  @include flex(column, stretch, flex-start, 1.1rem);
  padding: 1.15rem 1rem;
  border-radius: $radius-md;

  @include from('md') {
    padding: 1.6rem 1.75rem;
  }

  &--highlight {
    border-color: $gold-deep;
    border-top-width: 3px;
    background: linear-gradient(180deg, rgba($gold-soft, 0.35), $surface 5rem);
  }

  &--danger {
    border-color: rgba($danger, 0.4);
    background: $danger-bg;
  }

  &__head {
    @include flex(row, flex-start, space-between, 0.75rem);
    flex-wrap: wrap;
  }

  &__heading {
    @include flex(column, flex-start, flex-start, 0.3rem);
    flex: 1 1 14rem;
    min-width: 0;
  }

  &__title {
    @include flex(row, center, flex-start, 0.6rem);
    font-size: $text-lg;
    font-weight: 600;

    i {
      color: $accent;
      font-size: 0.95em;
    }
  }

  &__lead {
    max-width: 62ch;
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__aside:empty {
    display: none;
  }
}
</style>
