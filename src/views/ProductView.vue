<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import { copy } from '@/config/copy'
import { useSeo } from '@/composables/useSeo'
import { useProductDetail } from '@/composables/useProductDetail'
import { useWhatsappOrder } from '@/composables/useWhatsappOrder'
import { productSchema } from '@/utils/schema'
import BaseCta from '@/components/ui/BaseCta.vue'
import StateBlock from '@/components/ui/StateBlock.vue'
import ProductBuyBox from '@/components/shop/ProductBuyBox.vue'
import ProductGallery from '@/components/shop/ProductGallery.vue'
import ProductSkeleton from '@/components/shop/ProductSkeleton.vue'

const text = copy.product
const { product, status, load } = useProductDetail()
const { askLink } = useWhatsappOrder()

const isError = computed(() => status.value === 'error')
const category = computed(() =>
  product.value ? (site.categories[product.value.category] ?? product.value.category) : '',
)
const askHref = computed(() => askLink(`${text.askMessage} ${product.value?.name ?? ''}`.trim()))

useSeo(() => {
  const item = product.value
  if (!item) {
    // Una página de error o de "no existe" no debe quedar indexada.
    return {
      title: status.value === 'not-found' ? text.notFoundTitle : undefined,
      noindex: status.value !== 'loading',
    }
  }
  return {
    title: item.name,
    description: item.shortDescription || item.description,
    path: `/producto/${item.slug}`,
    image: item.images[0]?.url,
    type: 'product',
    jsonLd: productSchema(item),
  }
})
</script>

<template>
  <div class="product">
    <ProductSkeleton v-if="status === 'loading'" />

    <StateBlock
      v-else-if="!product"
      heading-level="h1"
      :tone="isError ? 'error' : 'soft'"
      :icon="isError ? 'fa-solid fa-plug-circle-xmark' : 'fa-solid fa-magnifying-glass'"
      :title="isError ? text.errorTitle : text.notFoundTitle"
      :text="isError ? text.errorText : text.notFoundText"
    >
      <button v-if="isError" class="btn btn--dark" type="button" @click="load">
        <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> {{ copy.common.retry }}
      </button>
      <BaseCta to="/tienda" variant="outline">{{ copy.common.backToShop }}</BaseCta>
    </StateBlock>

    <template v-else>
      <nav class="product__crumbs" :aria-label="text.breadcrumbLabel">
        <RouterLink class="product__crumb" to="/tienda">{{ copy.shop.eyebrow }}</RouterLink>
        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        <RouterLink
          class="product__crumb"
          :to="{ path: '/tienda', query: { categoria: product.category } }"
        >
          {{ category }}
        </RouterLink>
      </nav>

      <article class="product__layout">
        <ProductGallery
          :key="product.id"
          class="product__gallery"
          :images="product.images"
          :name="product.name"
        />

        <div class="product__info">
          <p class="product__category">{{ category }}</p>
          <h1 class="product__name">{{ product.name }}</h1>
          <p v-if="product.shortDescription" class="product__short">
            {{ product.shortDescription }}
          </p>

          <ProductBuyBox :key="product.id" :product="product" />

          <BaseCta :href="askHref" variant="outline" icon="fa-brands fa-whatsapp" block>
            {{ text.ask }}
          </BaseCta>
          <p class="product__hint">
            <i class="fa-solid fa-truck-fast" aria-hidden="true"></i> {{ text.shippingHint }}
          </p>

          <section v-if="product.description" class="product__section">
            <h2 class="product__heading">{{ text.descriptionTitle }}</h2>
            <p class="product__copy">{{ product.description }}</p>
          </section>
          <section v-if="product.usage" class="product__section">
            <h2 class="product__heading">{{ text.usageTitle }}</h2>
            <p class="product__copy">{{ product.usage }}</p>
          </section>
        </div>
      </article>
    </template>
  </div>
</template>

<style scoped lang="scss">
.product {
  @include container;
  padding-block: $space-md $space-section;

  &__crumbs {
    @include flex(row, center, flex-start, 0.6rem);
    margin-bottom: $space-md;
    font-size: $text-xs;
    color: $ink-soft;

    i {
      font-size: 0.6rem;
    }
  }

  &__crumb {
    @include focus-ring;
    padding-block: 0.5rem;
    font-weight: 500;

    &:hover {
      color: $accent;
    }
  }

  &__layout {
    @include flex(column, stretch, flex-start, 1.75rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 4rem;
    }
  }

  &__gallery {
    flex: 1 1 50%;
    min-width: 0;

    @include from('lg') {
      position: sticky;
      top: 5.5rem;
    }
  }

  &__info {
    @include flex(column, stretch, flex-start, 1.1rem);
    flex: 1 1 45%;
    min-width: 0;
  }

  &__category {
    @include eyebrow;
  }

  &__name {
    @include display($display-md);
  }

  &__short {
    font-size: $text-lg;
    color: $ink-soft;
  }

  &__hint {
    @include flex(row, flex-start, flex-start, 0.6rem);
    font-size: $text-sm;
    color: $ink-soft;

    i {
      margin-top: 0.3rem;
      color: $accent;
    }
  }

  &__section {
    padding-top: 1.25rem;
    border-top: 1px solid $line;
  }

  &__heading {
    @include eyebrow;
    margin-bottom: 0.6rem;
  }

  &__copy {
    color: $ink-soft;
    white-space: pre-line;
  }
}
</style>
