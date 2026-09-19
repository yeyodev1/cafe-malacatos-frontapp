<script setup lang="ts">
import { computed, ref } from 'vue'
import { site } from '@/config/site'
import { copy } from '@/config/copy'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { useTilt } from '@/composables/useTilt'
import { formatCents } from '@/utils/money'
import { activeVariants, cheapestVariant } from '@/utils/product'
import ProductImage from './ProductImage.vue'
import type { Product } from '@/types'

const props = withDefaults(defineProps<{ product: Product; headingLevel?: 'h2' | 'h3' }>(), {
  headingLevel: 'h3',
})

const cart = useCartStore()
const toast = useToastStore()
const tilt = ref<HTMLElement | null>(null)

const variants = computed(() => activeVariants(props.product))
const cheapest = computed(() => cheapestVariant(props.product))
const single = computed(() => (variants.value.length === 1 ? variants.value[0] : null))
const to = computed(() => `/producto/${props.product.slug}`)

const priceLabel = computed(() => {
  if (!cheapest.value) return ''
  const price = formatCents(cheapest.value.priceCents)
  return variants.value.length > 1 ? `${copy.product.from} ${price}` : price
})

const variantLabel = computed(() =>
  single.value ? single.value.label : `${variants.value.length} ${copy.product.variantsCount}`,
)

function addSingle() {
  if (!single.value) return
  cart.add(props.product, single.value, 1)
  toast.success(`${copy.product.added}: ${props.product.name}`)
}

useTilt(tilt)
</script>

<template>
  <article class="card">
    <div ref="tilt" class="card__tilt">
      <RouterLink :to="to" class="card__media" tabindex="-1" aria-hidden="true">
        <ProductImage :src="product.images[0]?.url" :alt="product.name" />
      </RouterLink>

      <div class="card__body">
        <p class="card__category">{{ site.categories[product.category] ?? product.category }}</p>
        <component :is="headingLevel" class="card__name">
          <RouterLink :to="to" class="card__link">{{ product.name }}</RouterLink>
        </component>
        <p v-if="product.shortDescription" class="card__text">{{ product.shortDescription }}</p>

        <div class="card__foot">
          <p v-if="cheapest" class="card__price">
            <span class="card__amount">{{ priceLabel }}</span>
            <span class="card__variant">{{ variantLabel }}</span>
          </p>

          <button v-if="single" class="card__action" type="button" @click="addSingle">
            <i class="fa-solid fa-plus" aria-hidden="true"></i>
            <span>{{ copy.product.addShort }}</span>
            <span class="visually-hidden">{{ product.name }}</span>
          </button>
          <RouterLink v-else :to="to" class="card__action">
            <span>{{ cheapest ? copy.product.choose : copy.product.view }}</span>
            <span class="visually-hidden">{{ product.name }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.card {
  @include flex(column, stretch, flex-start);
  // Las tarjetas de la última fila no deben estirarse a todo el ancho.
  max-width: 420px;

  &__tilt {
    @include card;
    @include flex(column, stretch, flex-start);
    @include transition(border-color);
    flex: 1;
    overflow: hidden;
    border-radius: $radius-md;
    transform-style: preserve-3d;

    &:hover {
      border-color: $gold-deep;
    }

    &:hover :deep(.product-image__img) {
      transform: scale(1.05);
    }
  }

  &__media {
    display: block;

    :deep(.product-image__img) {
      transition: transform 0.9s $ease;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.45rem);
    flex: 1;
    padding: 1.2rem 1.2rem 1.3rem;
  }

  &__category {
    @include eyebrow;
  }

  &__name {
    @include display($text-xl, 500);
    line-height: 1.15;
  }

  &__link {
    @include focus-ring;
    border-radius: 4px;

    &:hover {
      color: $accent;
    }
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__foot {
    @include flex(row, flex-end, space-between, 0.75rem);
    flex-wrap: wrap;
    margin-top: auto;
    padding-top: 0.9rem;
  }

  &__price {
    @include flex(column, flex-start, flex-start);
    line-height: 1.25;
  }

  &__amount {
    font-size: $text-lg;
    font-weight: 600;
    color: $ink;
  }

  &__variant {
    font-size: $text-xs;
    color: $ink-soft;
  }

  &__action {
    @include flex(row, center, center, 0.45rem);
    @include transition;
    @include focus-ring;
    min-height: 2.75rem;
    padding: 0.55rem 1.1rem;
    border: 1px solid $ink;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: $ink;

    &:hover {
      background: $ink;
      color: $paper;
    }
  }
}
</style>
