<script setup lang="ts">
import { computed } from 'vue'
import { checkoutCopy } from '@/config/copy.checkout'
import { formatDate } from '@/utils/format'
import type { Order, OrderStatus } from '@/types'

/**
 * Línea de tiempo del pedido. Con transferencia hay un paso más (comprobante por
 * verificar). Un pedido cancelado no tiene camino: se muestra solo el aviso.
 */
const props = defineProps<{ order: Order }>()
const text = checkoutCopy.status

const path = computed<OrderStatus[]>(() =>
  props.order.paymentMethod === 'transfer'
    ? ['pending', 'awaiting_verification', 'paid', 'shipped', 'delivered']
    : ['pending', 'paid', 'shipped', 'delivered'],
)

const isCancelled = computed(() => props.order.status === 'cancelled')
const currentIndex = computed(() => Math.max(0, path.value.indexOf(props.order.status)))

const DATES: Partial<Record<OrderStatus, keyof Order>> = {
  pending: 'createdAt',
  paid: 'paidAt',
  shipped: 'shippedAt',
}

const steps = computed(() =>
  path.value.map((status, index) => {
    const dateKey = DATES[status]
    const raw = dateKey ? (props.order[dateKey] as string | null) : null
    // "Entregado" es el final: al llegar ahí también cuenta como completado.
    const isLast = index === path.value.length - 1
    const done = index < currentIndex.value || (isLast && index === currentIndex.value)
    const current = index === currentIndex.value && !done
    return {
      status,
      label: text[status].step,
      date: raw && index <= currentIndex.value ? formatDate(raw) : '',
      done,
      current,
      stateLabel: done ? text.done : current ? text.current : text.upcoming,
    }
  }),
)
</script>

<template>
  <p v-if="isCancelled" class="timeline__cancelled" role="status">
    <i class="fa-solid fa-ban" aria-hidden="true"></i> {{ text.cancelledText }}
  </p>

  <ol v-else class="timeline">
    <li
      v-for="step in steps"
      :key="step.status"
      class="timeline__step"
      :class="{ 'timeline__step--done': step.done, 'timeline__step--current': step.current }"
      :aria-current="step.current ? 'step' : undefined"
    >
      <span class="timeline__dot" aria-hidden="true">
        <i v-if="step.done" class="fa-solid fa-check"></i>
      </span>
      <span class="timeline__text">
        <strong>{{ step.label }}</strong>
        <span class="visually-hidden">({{ step.stateLabel }})</span>
        <span v-if="step.date" class="timeline__date">{{ step.date }}</span>
      </span>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.timeline {
  @include flex(column, stretch, flex-start, 0);
  list-style: none;

  &__step {
    @include flex(row, flex-start, flex-start, 0.9rem);
    position: relative;
    padding-bottom: 1.4rem;
    color: $ink-soft;

    // El tramo que une este punto con el siguiente.
    &::before {
      content: '';
      position: absolute;
      top: 1.6rem;
      bottom: 0;
      left: calc(0.8rem - 1px);
      width: 2px;
      background: $line;
    }

    &:last-child {
      padding-bottom: 0;

      &::before {
        display: none;
      }
    }

    &--done {
      color: $ink;

      &::before {
        background: $success-text;
      }
    }

    &--current {
      color: $ink;
    }
  }

  &__dot {
    @include flex(row, center, center);
    position: relative;
    flex: 0 0 1.6rem;
    height: 1.6rem;
    border: 2px solid $line;
    border-radius: 50%;
    background: $surface;
    font-size: 0.7rem;
    color: $surface;
  }

  &__step--done &__dot {
    border-color: $success-text;
    background: $success-text;
  }

  &__step--current &__dot {
    border-color: $accent;
    box-shadow: 0 0 0 4px rgba($accent, 0.16);

    &::after {
      content: '';
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 50%;
      background: $accent;
    }
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.1rem);
    padding-top: 0.1rem;
    font-size: $text-sm;

    strong {
      font-weight: 500;
    }
  }

  &__step--done strong,
  &__step--current strong {
    font-weight: 600;
  }

  &__date {
    font-size: $text-xs;
    color: $ink-soft;
  }

  &__cancelled {
    @include flex(row, flex-start, flex-start, 0.6rem);
    padding: 0.9rem 1rem;
    border-radius: $radius-sm;
    background: $danger-bg;
    color: $danger-text;
    font-size: $text-sm;
    line-height: 1.5;

    i {
      margin-top: 0.2rem;
    }
  }
}
</style>
