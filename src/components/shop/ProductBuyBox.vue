<script setup lang="ts">
import { computed, ref } from 'vue'
import { copy } from '@/config/copy'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { formatCents } from '@/utils/money'
import { activeVariants, wholesaleNote } from '@/utils/product'
import QtyStepper from './QtyStepper.vue'
import type { Product } from '@/types'

// Se monta con :key del producto, así que el estado arranca limpio en cada uno.
const props = defineProps<{ product: Product }>()

const cart = useCartStore()
const toast = useToastStore()
const text = copy.product

const variants = computed(() => activeVariants(props.product))
const variantId = ref(variants.value[0]?.id ?? '')
const qty = ref(1)

const variant = computed(
  () => variants.value.find((item) => item.id === variantId.value) ?? variants.value[0] ?? null,
)
const wholesale = computed(() => wholesaleNote(variant.value))

function addToCart() {
  if (!variant.value) return
  cart.add(props.product, variant.value, qty.value)
  toast.success(`${text.added}: ${props.product.name}`)
  qty.value = 1
}
</script>

<template>
  <div v-if="variant" class="buy">
    <p class="buy__price">
      <span class="buy__amount">{{ formatCents(variant.priceCents) }}</span>
      <span class="buy__unit">{{ variant.label }}</span>
    </p>
    <p v-if="wholesale" class="buy__wholesale">
      <i class="fa-solid fa-boxes-stacked" aria-hidden="true"></i> {{ wholesale }}
    </p>

    <fieldset v-if="variants.length > 1" class="buy__variants">
      <legend class="buy__legend">{{ text.variantLabel }}</legend>
      <label v-for="item in variants" :key="item.id" class="buy__variant">
        <input
          v-model="variantId"
          class="buy__radio visually-hidden"
          type="radio"
          name="variant"
          :value="item.id"
        />
        <span class="buy__pill">
          {{ item.label }} <small>{{ formatCents(item.priceCents) }}</small>
        </span>
      </label>
    </fieldset>

    <div class="buy__row">
      <QtyStepper v-model="qty" />
      <button class="buy__add" type="button" @click="addToCart">
        <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> {{ text.add }}
      </button>
    </div>
  </div>
  <p v-else class="buy__wholesale">{{ text.unavailable }}</p>
</template>

<style scoped lang="scss">
.buy {
  @include flex(column, stretch, flex-start, 1rem);

  &__price {
    @include flex(row, baseline, flex-start, 0.6rem);
    flex-wrap: wrap;
  }

  &__amount {
    @include display($display-sm, 500);
  }

  &__unit {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__wholesale {
    @include flex(row, center, flex-start, 0.6rem);
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
    background: $gold-soft;
    color: $ink;
    font-size: $text-sm;
  }

  &__variants {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    border: none;
  }

  &__legend {
    @include eyebrow;
    width: 100%;
    margin-bottom: 0.6rem;
    color: $ink-soft;
  }

  &__variant {
    margin: 0;
    cursor: pointer;
  }

  &__pill {
    @include flex(row, center, center, 0.5rem);
    @include transition;
    min-height: 2.75rem;
    padding: 0.5rem 1.1rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    background: $surface;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink;

    small {
      font-size: $text-xs;
      color: $ink-soft;
    }
  }

  &__radio:checked + &__pill {
    background: $ink;
    border-color: $ink;
    color: $paper;

    small {
      color: rgba($paper, 0.75);
    }
  }

  &__radio:focus-visible + &__pill {
    outline: 2px solid $accent;
    outline-offset: 3px;
  }

  &__row {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
  }

  &__add {
    @include flex(row, center, center, 0.6rem);
    @include transition;
    @include focus-ring;
    flex: 1 1 12rem;
    min-height: 3rem;
    padding: 0.8rem 1.5rem;
    border-radius: $radius-pill;
    background: $accent;
    color: $surface;
    font-size: $text-sm;
    font-weight: 600;
    letter-spacing: 0.04em;

    &:hover {
      background: $accent-deep;
      transform: translateY(-2px);
    }
  }
}
</style>
