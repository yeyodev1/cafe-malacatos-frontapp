<script setup lang="ts">
import { computed } from 'vue'
import { copy } from '@/config/copy'
import { formatCents } from '@/utils/money'
import ProductImage from './ProductImage.vue'
import QtyStepper from './QtyStepper.vue'
import type { CartLine } from '@/types'

const props = defineProps<{ line: CartLine }>()
const emit = defineEmits<{ 'update:qty': [value: number]; remove: [] }>()

const to = computed(() => `/producto/${props.line.slug}`)
const total = computed(() => formatCents(props.line.unitPriceCents * props.line.qty))
</script>

<template>
  <li class="line">
    <RouterLink :to="to" class="line__media" tabindex="-1" aria-hidden="true">
      <ProductImage :src="line.image" :alt="line.name" :width="240" sizes="96px" ratio="1 / 1" />
    </RouterLink>

    <div class="line__info">
      <h2 class="line__name">
        <RouterLink :to="to" class="line__link">{{ line.name }}</RouterLink>
      </h2>
      <p class="line__meta">{{ line.variantLabel }} · {{ formatCents(line.unitPriceCents) }}</p>

      <div class="line__controls">
        <QtyStepper
          :model-value="line.qty"
          :label="`${copy.product.qtyLabel}: ${line.name}`"
          @update:model-value="emit('update:qty', $event)"
        />
        <button class="line__remove" type="button" @click="emit('remove')">
          <i class="fa-regular fa-trash-can" aria-hidden="true"></i>
          <span>{{ copy.cart.remove }}</span>
          <span class="visually-hidden">{{ line.name }}</span>
        </button>
      </div>
    </div>

    <p class="line__total">{{ total }}</p>
  </li>
</template>

<style scoped lang="scss">
.line {
  @include flex(row, flex-start, flex-start, 1rem);
  flex-wrap: wrap;
  padding-block: 1.25rem;
  border-bottom: 1px solid $line;

  &__media {
    flex: none;
    width: 5rem;
    overflow: hidden;
    border-radius: $radius-sm;

    @include from('md') {
      width: 6.5rem;
    }
  }

  &__info {
    @include flex(column, flex-start, flex-start, 0.35rem);
    flex: 1 1 10rem;
    min-width: 0;
  }

  &__name {
    @include display($text-lg, 500);
    line-height: 1.2;
  }

  &__link {
    @include focus-ring;

    &:hover {
      color: $accent;
    }
  }

  &__meta {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__controls {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  &__remove {
    @include flex(row, center, center, 0.45rem);
    @include transition(color);
    @include focus-ring;
    min-height: 2.75rem;
    padding-inline: 0.6rem;
    font-size: $text-sm;
    color: $ink-soft;

    &:hover {
      color: $danger;
    }
  }

  &__total {
    flex: 1 1 100%;
    text-align: right;
    font-weight: 600;

    @include from('md') {
      flex: 0 0 6rem;
    }
  }
}
</style>
