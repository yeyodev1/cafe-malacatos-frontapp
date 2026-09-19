<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { copy } from '@/config/copy'
import { useProductsStore } from '@/stores/products'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useWhatsappOrder } from '@/composables/useWhatsappOrder'
import BaseCta from '@/components/ui/BaseCta.vue'
import ProductCard from '@/components/shop/ProductCard.vue'
import ProductCardSkeleton from '@/components/shop/ProductCardSkeleton.vue'

const FEATURED = 4

const root = ref<HTMLElement | null>(null)
const products = useProductsStore()
const { contactLink } = useWhatsappOrder()
const text = copy.home.featured

const featured = computed(() => products.sorted.slice(0, FEATURED))
const isEmpty = computed(() => !products.isLoading && featured.value.length === 0)

const { rebuild } = useScrollReveal(root)

// Las tarjetas llegan después del montaje: cuando están en el DOM se rehacen
// los triggers para que entren escalonadas.
watch(
  () => products.status,
  async () => {
    await nextTick()
    rebuild()
  },
)
</script>

<template>
  <section ref="root" class="featured" aria-labelledby="featured-title">
    <header class="featured__head">
      <div class="featured__titles">
        <p class="featured__eyebrow" data-reveal>{{ text.eyebrow }}</p>
        <h2 id="featured-title" class="featured__title" data-reveal>{{ text.title }}</h2>
        <p class="featured__lead" data-reveal>{{ text.lead }}</p>
      </div>
      <BaseCta to="/tienda" variant="outline" icon-right="fa-solid fa-arrow-right" data-reveal>
        {{ text.cta }}
      </BaseCta>
    </header>

    <div v-if="products.isLoading" class="featured__list" aria-busy="true">
      <ProductCardSkeleton v-for="n in FEATURED" :key="n" />
    </div>

    <!-- Sin catálogo (o con el API apagado) la home sigue vendiendo: se ofrece WhatsApp. -->
    <div v-else-if="isEmpty" class="featured__empty" data-reveal>
      <h3 class="featured__empty-title">{{ text.emptyTitle }}</h3>
      <p>{{ text.emptyText }}</p>
      <BaseCta :href="contactLink" variant="dark" icon="fa-brands fa-whatsapp">
        {{ copy.common.whatsappAsk }}
      </BaseCta>
    </div>

    <ul v-else class="featured__list" data-reveal-group>
      <li v-for="product in featured" :key="product.id" class="featured__item" data-reveal-item>
        <ProductCard :product="product" />
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.featured {
  @include container;
  padding-block: $space-section;

  &__head {
    @include flex(column, flex-start, flex-start, 1.5rem);
    margin-bottom: $space-lg;

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }

  &__titles {
    @include flex(column, flex-start, flex-start, 0.75rem);
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
  }

  &__lead {
    color: $ink-soft;
    max-width: 52ch;
  }

  &__list {
    @include flex-cards(240px, 1.25rem);
    list-style: none;

    @include from('md') {
      gap: 1.5rem;
    }
  }

  &__item {
    display: flex;
    max-width: 420px;

    > * {
      flex: 1;
    }
  }

  &__empty {
    @include flex(column, flex-start, flex-start, 1rem);
    padding: 2rem 1.5rem;
    border: 1px dashed $line;
    border-radius: $radius-md;
    background: $sand;
    color: $ink-soft;

    @include from('md') {
      padding: 3rem;
    }
  }

  &__empty-title {
    @include display($display-sm);
    color: $ink;
  }
}
</style>
