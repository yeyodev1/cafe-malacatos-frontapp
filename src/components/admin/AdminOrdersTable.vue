<script setup lang="ts">
import { useRouter } from 'vue-router'
import { adminCopy, paymentMethod } from '@/config/copy.admin'
import { formatCents } from '@/utils/money'
import { formatDateTime } from '@/composables/admin/adminFormat'
import AdminStatusBadge from './AdminStatusBadge.vue'
import type { Order } from '@/types'

// Tabla real en escritorio; en el celular cada fila se vuelve una tarjeta apilada.
const text = adminCopy.orders
defineProps<{ orders: Order[]; caption: string }>()

const router = useRouter()
const detail = (order: Order) => `/admin/ordenes/${order.id}`
</script>

<template>
  <table class="orders">
    <caption class="visually-hidden">
      {{
        caption
      }}
    </caption>
    <thead>
      <tr>
        <th scope="col">{{ text.columns.number }}</th>
        <th scope="col">{{ text.columns.date }}</th>
        <th scope="col">{{ text.columns.customer }}</th>
        <th scope="col">{{ text.columns.payment }}</th>
        <th scope="col">{{ text.columns.status }}</th>
        <th scope="col" class="orders__num">{{ text.columns.total }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="order in orders"
        :key="order.id"
        class="orders__row"
        @click="router.push(detail(order))"
      >
        <td class="orders__number">
          <RouterLink :to="detail(order)" :aria-label="`${text.open} ${order.number}`" @click.stop>
            {{ order.number }}
          </RouterLink>
        </td>
        <td class="orders__date">{{ formatDateTime(order.createdAt) }}</td>
        <td class="orders__customer">{{ order.customer.name }}</td>
        <td class="orders__payment">
          <i :class="paymentMethod[order.paymentMethod]?.icon" aria-hidden="true"></i>
          {{ paymentMethod[order.paymentMethod]?.label || order.paymentMethod }}
        </td>
        <td class="orders__status"><AdminStatusBadge :status="order.status" /></td>
        <td class="orders__total orders__num">{{ formatCents(order.totalCents) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
.orders {
  width: 100%;
  border-collapse: collapse;
  font-size: $text-sm;

  // Móvil: sin cabecera visible, cada fila es una tarjeta con flex.
  thead {
    @include until('lg') {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
    }
  }

  tbody {
    @include until('lg') {
      @include flex(column, stretch, flex-start, 0.75rem);
    }
  }

  th {
    padding: 0.7rem 0.9rem;
    border-bottom: 1px solid $line;
    color: $ink-muted;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-align: left;
    text-transform: uppercase;
  }

  &__num {
    text-align: right !important;
  }

  &__row {
    @include transition(background-color);
    cursor: pointer;

    &:hover {
      background: $sand;
    }

    @include until('lg') {
      @include card;
      @include flex(row, center, space-between, 0.35rem 0.75rem);
      flex-wrap: wrap;
      padding: 0.95rem 1rem;
    }
  }

  td {
    @include from('lg') {
      padding: 0.9rem;
      border-bottom: 1px solid $line;
      vertical-align: middle;
    }
  }

  &__number a {
    @include focus-ring;
    font-weight: 700;
    color: $accent-deep;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &__date,
  &__payment {
    color: $ink-soft;

    i {
      margin-right: 0.3rem;
      color: $ink-muted;
    }
  }

  &__total {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  @include until('lg') {
    &__number {
      order: 1;
    }

    &__status {
      order: 2;
    }

    &__customer {
      order: 3;
      flex: 1 1 100%;
      font-size: $text-base;
      font-weight: 600;
    }

    &__date {
      order: 4;
      flex: 1 1 100%;
    }

    &__payment {
      order: 5;
    }

    &__total {
      order: 6;
      font-size: $text-base;
    }
  }
}
</style>
