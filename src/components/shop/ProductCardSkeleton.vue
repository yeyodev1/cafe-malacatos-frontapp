<script setup lang="ts">
// Silueta de una tarjeta mientras carga el catálogo: mismo alto que la real para
// que la página no salte cuando llegan los datos.
</script>

<template>
  <div class="skeleton" aria-hidden="true">
    <div class="skeleton__media"></div>
    <div class="skeleton__body">
      <span class="skeleton__line skeleton__line--xs"></span>
      <span class="skeleton__line skeleton__line--lg"></span>
      <span class="skeleton__line"></span>
      <span class="skeleton__line skeleton__line--sm"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  @include card;
  max-width: 420px;
  overflow: hidden;
  border-radius: $radius-md;

  &__media {
    aspect-ratio: 4 / 5;
    background: $sand;
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.7rem);
    padding: 1.2rem;
  }

  &__line {
    width: 100%;
    height: 0.8rem;
    border-radius: $radius-pill;
    background: $sand;

    &--xs {
      width: 30%;
      height: 0.55rem;
    }

    &--lg {
      width: 75%;
      height: 1.3rem;
    }

    &--sm {
      width: 45%;
      margin-top: 0.6rem;
    }
  }

  &__media,
  &__line {
    animation: skeleton-pulse 1.4s ease-in-out infinite alternate;
  }
}

@keyframes skeleton-pulse {
  to {
    opacity: 0.45;
  }
}
</style>
