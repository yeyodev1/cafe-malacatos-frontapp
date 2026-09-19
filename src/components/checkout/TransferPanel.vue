<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import { checkoutCopy } from '@/config/copy.checkout'
import { formatCents } from '@/utils/money'
import BaseCta from '@/components/ui/BaseCta.vue'
import BankAccountList from './BankAccountList.vue'
import ProofUploader from './ProofUploader.vue'
import OrderStatusBadge from './OrderStatusBadge.vue'
import type { BankAccount, Order } from '@/types'

/**
 * Lo que ve el comprador tras crear una orden por transferencia: a dónde
 * transferir, cuánto exactamente, y dónde subir el comprobante.
 */
const props = defineProps<{
  order: Order
  accounts: BankAccount[]
  instructions?: string
  /** En el seguimiento el encabezado ya lo pone la vista. */
  compact?: boolean
}>()

defineEmits<{ uploaded: [order: Order] }>()
const text = checkoutCopy.transfer

const trackingPath = computed(
  () => `/pedido/${props.order.number}?email=${encodeURIComponent(props.order.customer.email)}`,
)
</script>

<template>
  <section class="transfer" :class="{ 'transfer--compact': compact }">
    <header v-if="!compact" class="transfer__head">
      <p class="transfer__eyebrow">{{ text.eyebrow }}</p>
      <h2 class="transfer__title">{{ text.title }}</h2>
      <p class="transfer__meta">
        {{ text.order }} <strong>{{ order.number }}</strong>
        <OrderStatusBadge :status="order.status" />
      </p>
      <p class="transfer__lead">{{ text.lead }}</p>
    </header>

    <p class="transfer__total">
      <span>{{ text.total }}</span>
      <strong>{{ formatCents(order.totalCents) }}</strong>
    </p>

    <div v-if="accounts.length" class="transfer__block">
      <h3 class="transfer__subtitle">{{ text.accountsTitle }}</h3>
      <BankAccountList :accounts="accounts" />
    </div>
    <p v-if="instructions" class="transfer__instructions">{{ instructions }}</p>

    <ProofUploader :order="order" @uploaded="$emit('uploaded', $event)" />

    <!-- Con el comprobante enviado, la misma nota ya aparece dentro del aviso de recibido. -->
    <p v-if="!order.transferProof" class="transfer__note">
      <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
      {{ site.checkout.transferNote }}
      <template v-if="!compact">{{ text.emailSent }}</template>
    </p>

    <BaseCta
      v-if="!compact"
      :to="trackingPath"
      variant="outline"
      icon-right="fa-solid fa-arrow-right"
    >
      {{ text.track }}
    </BaseCta>
  </section>
</template>

<style scoped lang="scss">
.transfer {
  @include card;
  @include flex(column, stretch, flex-start, 1.25rem);
  min-width: 0;
  padding: 1.5rem 1.1rem;
  border-radius: $radius-md;
  border-top: 3px solid $gold-deep;

  @include from('md') {
    padding: 2rem;
  }

  &--compact {
    border-top: 1px solid $line;
  }

  &__head {
    @include flex(column, flex-start, flex-start, 0.5rem);
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 500);
  }

  &__meta {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    color: $ink-soft;

    strong {
      color: $ink;
    }
  }

  &__lead,
  &__instructions {
    font-size: $text-sm;
    line-height: 1.55;
    color: $ink-soft;
    white-space: pre-line;
  }

  &__total {
    @include flex(row, baseline, space-between, 1rem);
    flex-wrap: wrap;
    padding: 1rem;
    border-radius: $radius-sm;
    background: $sand;
    font-size: $text-sm;

    strong {
      font-size: $text-xl;
      font-variant-numeric: tabular-nums;
    }
  }

  &__block {
    @include flex(column, stretch, flex-start, 0.75rem);
  }

  &__subtitle {
    font-size: $text-base;
    font-weight: 600;
  }

  &__note {
    @include flex(row, flex-start, flex-start, 0.55rem);
    font-size: $text-xs;
    line-height: 1.55;
    color: $ink-soft;

    i {
      margin-top: 0.2rem;
      color: $accent;
    }
  }
}
</style>
