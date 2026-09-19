<script setup lang="ts">
// Silueta de la página de producto mientras responde el API.
</script>

<template>
  <div class="skeleton" aria-hidden="true">
    <div class="skeleton__media"></div>
    <div class="skeleton__info">
      <span class="skeleton__line skeleton__line--xs"></span>
      <span class="skeleton__line skeleton__line--title"></span>
      <span class="skeleton__line"></span>
      <span class="skeleton__line skeleton__line--md"></span>
      <span class="skeleton__line skeleton__line--price"></span>
      <span class="skeleton__line skeleton__line--button"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  @include flex(column, stretch, flex-start, 1.75rem);

  @include from('lg') {
    flex-direction: row;
    gap: 4rem;
  }

  &__media {
    flex: 1 1 50%;
    aspect-ratio: 4 / 5;
    border-radius: $radius-md;
    background: $sand;
  }

  &__info {
    @include flex(column, flex-start, flex-start, 0.9rem);
    flex: 1 1 45%;
    padding-top: 0.5rem;
  }

  &__line {
    width: 100%;
    height: 0.85rem;
    border-radius: $radius-pill;
    background: $sand;

    &--xs {
      width: 25%;
      height: 0.6rem;
    }

    &--title {
      width: 80%;
      height: 2.4rem;
    }

    &--md {
      width: 65%;
    }

    &--price {
      width: 35%;
      height: 1.8rem;
      margin-top: 0.75rem;
    }

    &--button {
      height: 3rem;
      margin-top: 0.75rem;
    }
  }

  &__media,
  &__line {
    animation: product-skeleton-pulse 1.4s ease-in-out infinite alternate;
  }
}

@keyframes product-skeleton-pulse {
  to {
    opacity: 0.45;
  }
}
</style>
