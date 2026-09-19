<script setup lang="ts">
// Marco común de ingresar y crear cuenta: título, formulario (slot) y enlace cruzado (slot "foot").
defineProps<{ eyebrow: string; title: string; lead?: string; error?: string }>()
defineEmits<{ submit: [] }>()
</script>

<template>
  <section class="auth">
    <form class="auth__card" novalidate @submit.prevent="$emit('submit')">
      <header class="auth__head">
        <p class="auth__eyebrow">{{ eyebrow }}</p>
        <h1 class="auth__title">{{ title }}</h1>
        <p v-if="lead" class="auth__lead">{{ lead }}</p>
      </header>

      <slot />

      <Transition name="rise">
        <p v-if="error" class="auth__error" role="alert">
          <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
        </p>
      </Transition>

      <slot name="actions" />
    </form>

    <p class="auth__foot"><slot name="foot" /></p>
  </section>
</template>

<style scoped lang="scss">
.auth {
  @include container(500px);
  @include flex(column, stretch, center, 1.25rem);
  flex: 1;
  padding-block: $space-lg $space-xl;

  &__card {
    @include card;
    @include flex(column, stretch, flex-start, 1rem);
    padding: 1.75rem 1.25rem;
    border-radius: $radius-md;
    border-top: 3px solid $gold-deep;
    box-shadow: $shadow-sm;

    @include from('sm') {
      padding: 2.25rem 2rem;
    }
  }

  &__head {
    @include flex(column, flex-start, flex-start, 0.5rem);
    margin-bottom: 0.4rem;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 500);
  }

  &__lead {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__error {
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
    background: $danger-bg;
    // El rojo de estado no llega a AA sobre su propio fondo: se oscurece para texto.
    color: darken($danger, 18%);
    font-size: $text-sm;
  }

  &__foot {
    text-align: center;
    font-size: $text-sm;
    color: $ink-soft;

    :deep(a) {
      color: $accent;
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
}
</style>
