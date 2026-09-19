<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { site } from '@/config/site'
import { copy } from '@/config/copy'
import { useProductsStore } from '@/stores/products'
import { useSeo } from '@/composables/useSeo'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useWhatsappOrder } from '@/composables/useWhatsappOrder'
import { shopSchema } from '@/utils/schema'
import BaseCta from '@/components/ui/BaseCta.vue'
import StateBlock from '@/components/ui/StateBlock.vue'
import ProductCard from '@/components/shop/ProductCard.vue'
import ProductCardSkeleton from '@/components/shop/ProductCardSkeleton.vue'
import type { ProductCategory } from '@/types'

const route = useRoute()
const router = useRouter()
const products = useProductsStore()
const { contactLink } = useWhatsappOrder()
const root = ref<HTMLElement | null>(null)
const text = copy.shop

const categoryKeys = Object.keys(site.categories) as ProductCategory[]

// La categoría vive en la URL (?categoria=cafe) para poder compartirla y enlazarla.
const active = computed<ProductCategory | null>(() => {
  const value = route.query.categoria
  return typeof value === 'string' && categoryKeys.includes(value as ProductCategory)
    ? (value as ProductCategory)
    : null
})

// Solo se ofrecen las categorías que tienen algún producto publicado.
const filters = computed(() =>
  categoryKeys.filter((key) => products.items.some((product) => product.category === key)),
)

const visible = computed(() =>
  active.value
    ? products.sorted.filter((product) => product.category === active.value)
    : products.sorted,
)

function select(category: ProductCategory | null) {
  router.replace({ query: category ? { categoria: category } : {} })
}

useSeo(() => ({
  title: copy.seo.shopTitle,
  description: copy.seo.shopDescription,
  path: '/tienda',
  jsonLd: products.items.length ? shopSchema(products.sorted) : null,
}))

const { rebuild } = useScrollReveal(root)

watch([() => products.status, active], async () => {
  await nextTick()
  rebuild()
})

onMounted(() => products.load())
</script>

<template>
  <section ref="root" class="shop">
    <header class="shop__head">
      <p class="shop__eyebrow">{{ text.eyebrow }}</p>
      <h1 class="shop__title">{{ text.title }}</h1>
      <p class="shop__lead">{{ text.lead }}</p>
    </header>

    <nav v-if="filters.length > 1" class="shop__filters" :aria-label="text.filterLabel">
      <button
        class="shop__filter"
        :class="{ 'shop__filter--active': !active }"
        type="button"
        :aria-pressed="!active"
        @click="select(null)"
      >
        {{ text.all }}
      </button>
      <button
        v-for="key in filters"
        :key="key"
        class="shop__filter"
        :class="{ 'shop__filter--active': active === key }"
        type="button"
        :aria-pressed="active === key"
        @click="select(key)"
      >
        {{ site.categories[key] }}
      </button>
    </nav>

    <div v-if="products.isLoading" class="shop__list" aria-busy="true">
      <span class="visually-hidden" role="status">{{ text.title }}</span>
      <ProductCardSkeleton v-for="n in 6" :key="n" />
    </div>

    <StateBlock
      v-else-if="products.status === 'error'"
      tone="error"
      icon="fa-solid fa-plug-circle-xmark"
      :title="text.errorTitle"
      :text="text.errorText"
    >
      <button class="btn btn--dark" type="button" @click="products.load(true)">
        <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> {{ copy.common.retry }}
      </button>
      <BaseCta :href="contactLink" variant="outline" icon="fa-brands fa-whatsapp">
        {{ copy.common.whatsappAsk }}
      </BaseCta>
    </StateBlock>

    <StateBlock v-else-if="!products.items.length" :title="text.emptyTitle" :text="text.emptyText">
      <BaseCta :href="contactLink" variant="dark" icon="fa-brands fa-whatsapp">
        {{ copy.common.whatsappAsk }}
      </BaseCta>
    </StateBlock>

    <StateBlock
      v-else-if="!visible.length"
      :title="text.emptyCategoryTitle"
      :text="text.emptyCategoryText"
    >
      <button class="btn btn--dark" type="button" @click="select(null)">{{ text.seeAll }}</button>
      <BaseCta :href="contactLink" variant="outline" icon="fa-brands fa-whatsapp">
        {{ copy.common.whatsappAsk }}
      </BaseCta>
    </StateBlock>

    <ul v-else class="shop__list" data-reveal-group>
      <li v-for="product in visible" :key="product.id" class="shop__item" data-reveal-item>
        <ProductCard :product="product" heading-level="h2" />
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.shop {
  @include container;
  padding-block: $space-lg $space-section;

  &__head {
    @include flex(column, flex-start, flex-start, 0.75rem);
    margin-bottom: $space-md;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-lg);
  }

  &__lead {
    font-size: $text-lg;
    color: $ink-soft;
    max-width: 56ch;
  }

  // En móvil los filtros se deslizan en una fila; desde md envuelven.
  &__filters {
    @include flex(row, center, flex-start, 0.5rem);
    margin: 0 -1.25rem $space-md;
    padding: 0.25rem 1.25rem;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('md') {
      flex-wrap: wrap;
      margin-inline: 0;
      padding-inline: 0;
      overflow: visible;
    }
  }

  &__filter {
    @include transition;
    @include focus-ring;
    flex: none;
    min-height: 2.75rem;
    padding: 0.5rem 1.2rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    background: $surface;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;

    &:hover {
      border-color: $ink;
      color: $ink;
    }

    &--active {
      background: $ink;
      border-color: $ink;
      color: $paper;

      &:hover {
        color: $paper;
      }
    }
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
}
</style>
