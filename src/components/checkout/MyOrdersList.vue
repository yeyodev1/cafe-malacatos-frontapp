<script setup lang="ts">
import { copy } from '@/config/copy'
import { checkoutCopy } from '@/config/copy.checkout'
import { useMyOrders } from '@/composables/checkout/useMyOrders'
import { formatCents } from '@/utils/money'
import { formatDate } from '@/utils/format'
import OrderStatusBadge from './OrderStatusBadge.vue'
import type { Order } from '@/types'

// "Mis pedidos" de la cuenta: cada fila lleva al seguimiento público del pedido.
const text = checkoutCopy.myOrders
const { orders, loading, error, load } = useMyOrders()

function trackingRoute(order: Order) {
  return {
    name: 'OrderTracking',
    params: { number: order.number },
    query: { email: order.customer.email },
  }
}

function unitsLabel(order: Order): string {
  const units = order.items.reduce((sum, item) => sum + item.qty, 0)
  return `${units} ${units === 1 ? text.item : text.items}`
}
</script>

<template>
  <section class="orders" aria-labelledby="orders-title">
    <h2 id="orders-title" class="orders__title">{{ text.title }}</h2>

    <p v-if="loading" class="orders__state" role="status">
      <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> {{ text.loading }}
    </p>

    <p v-else-if="error" class="orders__state orders__state--error" role="alert">
      {{ error || text.errorText }}
      <button class="orders__retry" type="button" @click="load">{{ copy.common.retry }}</button>
    </p>

    <div v-else-if="!orders.length" class="orders__empty">
      <strong>{{ text.emptyTitle }}</strong>
      <p>{{ text.emptyText }}</p>
    </div>

    <ul v-else class="orders__list">
      <li v-for="order in orders" :key="order.id">
        <RouterLink class="orders__item" :to="trackingRoute(order)">
          <span class="orders__info">
            <strong>{{ order.number }}</strong>
            <span>{{ formatDate(order.createdAt) }} · {{ unitsLabel(order) }}</span>
          </span>
          <span class="orders__side">
            <OrderStatusBadge :status="order.status" />
            <span class="orders__total">{{ formatCents(order.totalCents) }}</span>
          </span>
          <span class="orders__go">
            {{ text.view }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.orders {
  @include flex(column, stretch, flex-start, 1rem);
  width: 100%;

  &__title {
    @include display($text-xl, 500);
  }

  &__state {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    color: $ink-soft;

    &--error {
      color: $danger-text;
    }
  }

  &__retry {
    @include focus-ring;
    font-weight: 600;
    color: $accent;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &__empty {
    padding: 1.25rem;
    border: 1px dashed $line;
    border-radius: $radius-sm;
    background: $sand;
    font-size: $text-sm;
    line-height: 1.55;
    color: $ink-soft;

    strong {
      color: $ink;
    }
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.75rem);
    list-style: none;
  }

  &__item {
    @include card;
    @include flex(row, center, space-between, 0.75rem 1rem);
    @include transition(border-color);
    @include focus-ring;
    flex-wrap: wrap;
    padding: 1rem 1.1rem;
    border-radius: $radius-sm;

    &:hover {
      border-color: $accent;
    }
  }

  &__info {
    @include flex(column, flex-start, flex-start, 0.15rem);
    flex: 1 1 9rem;
    min-width: 0;
    font-size: $text-xs;
    color: $ink-soft;

    strong {
      font-size: $text-base;
      color: $ink;
    }
  }

  &__side {
    @include flex(row, center, flex-end, 0.75rem);
    flex-wrap: wrap;
  }

  &__total {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  &__go {
    @include flex(row, center, flex-start, 0.4rem);
    flex: 1 1 100%;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent;

    @include from('md') {
      flex: 0 0 auto;
    }
  }
}
</style>
