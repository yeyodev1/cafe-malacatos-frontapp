<script setup lang="ts">
import { adminCopy } from '@/config/copy.admin'
import { cldUrl } from '@/utils/image'
import { formatCents, formatWeight } from '@/utils/money'
import AdminSection from './AdminSection.vue'
import type { Order } from '@/types'

const text = adminCopy.order
defineProps<{ order: Order }>()
</script>

<template>
  <AdminSection :title="text.itemsTitle" icon="fa-solid fa-basket-shopping">
    <ul class="summary__items">
      <li
        v-for="item in order.items"
        :key="`${item.product}-${item.variantId}`"
        class="summary__item"
      >
        <img
          v-if="item.image"
          :src="cldUrl(item.image, 120)"
          alt=""
          class="summary__thumb"
          width="56"
          height="56"
          loading="lazy"
        />
        <span v-else class="summary__thumb summary__thumb--empty" aria-hidden="true">
          <i class="fa-solid fa-mug-hot"></i>
        </span>
        <div class="summary__info">
          <p class="summary__name">{{ item.name }}</p>
          <p class="summary__meta">
            {{ item.variantLabel }} · {{ text.qty }}: <strong>{{ item.qty }}</strong> ·
            {{ formatCents(item.unitPriceCents) }} {{ text.unit }}
          </p>
        </div>
        <span class="summary__line">{{ formatCents(item.lineTotalCents) }}</span>
      </li>
    </ul>

    <dl class="summary__totals">
      <div class="summary__total-row">
        <dt>{{ text.subtotal }}</dt>
        <dd>{{ formatCents(order.subtotalCents) }}</dd>
      </div>
      <div class="summary__total-row">
        <dt>{{ text.shipping }} · {{ order.shipping.province }}</dt>
        <dd>{{ formatCents(order.shippingCents) }}</dd>
      </div>
      <div class="summary__total-row summary__total-row--grand">
        <dt>{{ text.total }}</dt>
        <dd>{{ formatCents(order.totalCents) }}</dd>
      </div>
      <div class="summary__total-row summary__total-row--muted">
        <dt>{{ text.weight }}</dt>
        <dd>{{ formatWeight(order.totalWeightGrams) }}</dd>
      </div>
    </dl>
  </AdminSection>
</template>

<style scoped lang="scss">
.summary {
  &__items {
    @include flex(column, stretch, flex-start);
    list-style: none;
  }

  &__item {
    @include flex(row, center, flex-start, 0.85rem);
    padding: 0.8rem 0;
    border-bottom: 1px solid $line;

    &:first-child {
      padding-top: 0;
    }
  }

  &__thumb {
    flex: 0 0 3.5rem;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: $radius-sm;
    background: $sand;
    object-fit: cover;

    &--empty {
      @include flex(row, center, center);
      color: $ink-muted;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-weight: 600;
  }

  &__meta {
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__line {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__totals {
    @include flex(column, stretch, flex-start, 0.45rem);
  }

  &__total-row {
    @include flex(row, baseline, space-between, 1rem);
    font-size: $text-sm;
    color: $ink-soft;

    dd {
      font-variant-numeric: tabular-nums;
    }

    &--grand {
      padding-top: 0.6rem;
      border-top: 1px solid $line;
      color: $ink;
      font-size: $text-lg;
      font-weight: 700;
    }

    &--muted {
      color: $ink-muted;
      font-size: $text-xs;
    }
  }
}
</style>
