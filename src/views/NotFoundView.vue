<script setup lang="ts">
import { copy } from '@/config/copy'
import { useSeo } from '@/composables/useSeo'
import BaseCta from '@/components/ui/BaseCta.vue'
import CoffeeBean from '@/components/ui/CoffeeBean.vue'

const text = copy.notFound

useSeo(() => ({ title: text.title, noindex: true }))
</script>

<template>
  <section class="not-found">
    <p class="not-found__code" aria-hidden="true">
      4<span class="not-found__bean"><CoffeeBean tone="gold" /></span>4
    </p>
    <h1 class="not-found__title">{{ text.title }}</h1>
    <p class="not-found__text">{{ text.text }}</p>
    <div class="not-found__actions">
      <BaseCta to="/" variant="dark">{{ text.home }}</BaseCta>
      <BaseCta to="/tienda" variant="outline">{{ copy.common.goToShop }}</BaseCta>
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  @include container(640px);
  @include flex(column, center, center, 1rem);
  flex: 1;
  text-align: center;
  padding-block: $space-xl $space-section;

  &__code {
    @include flex(row, center, center, 0.35rem);
    @include display(clamp(5rem, 22vw, 9rem), 500);
    color: $accent;
  }

  &__bean {
    width: 0.5em;
    rotate: 20deg;
  }

  &__title {
    @include display($display-md);
  }

  &__text {
    color: $ink-soft;
  }

  &__actions {
    @include flex(row, center, center, 0.75rem);
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }
}
</style>
