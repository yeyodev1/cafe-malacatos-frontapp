<script setup lang="ts">
import { computed } from 'vue'
import { checkoutCopy } from '@/config/copy.checkout'
import { mapsLink } from '@/composables/checkout/useDeliveryPin'
import type { Order } from '@/types'

// Datos de entrega, factura y forma de pago de una orden ya creada.
const props = defineProps<{ order: Order }>()

const text = checkoutCopy.tracking
const hasPin = computed(
  () => props.order.shipping.lat !== null && props.order.shipping.lng !== null,
)
const pinLink = computed(() =>
  hasPin.value
    ? mapsLink(props.order.shipping.lat as number, props.order.shipping.lng as number)
    : '',
)
const paymentLabel = computed(() =>
  props.order.paymentMethod === 'card' ? checkoutCopy.payment.card : checkoutCopy.payment.transfer,
)
</script>

<template>
  <div class="details">
    <section class="details__block">
      <h3 class="details__title">{{ text.shippingTitle }}</h3>
      <p>
        <strong>{{ order.customer.name }}</strong>
      </p>
      <p>{{ order.shipping.address }}</p>
      <p>{{ order.shipping.city }}, {{ order.shipping.province }}</p>
      <p v-if="order.shipping.reference" class="details__soft">{{ order.shipping.reference }}</p>
      <p class="details__soft">{{ order.customer.phone }}</p>
      <a v-if="hasPin" class="details__link" :href="pinLink" target="_blank" rel="noopener">
        <i class="fa-solid fa-location-dot" aria-hidden="true"></i> {{ text.viewMap }}
      </a>
    </section>

    <section class="details__block">
      <h3 class="details__title">{{ text.billingTitle }}</h3>
      <p>
        <strong>{{ order.billing.name }}</strong>
      </p>
      <p>{{ checkoutCopy.idTypes[order.billing.idType] }}: {{ order.billing.idNumber }}</p>
      <p class="details__soft">{{ order.billing.email }}</p>
      <p class="details__soft">
        <i
          :class="order.invoiceIssued ? 'fa-solid fa-circle-check' : 'fa-regular fa-clock'"
          aria-hidden="true"
        ></i>
        {{ order.invoiceIssued ? text.invoiceIssued : text.invoicePending }}
      </p>
    </section>

    <section class="details__block">
      <h3 class="details__title">{{ text.paymentTitle }}</h3>
      <p>{{ paymentLabel }}</p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.details {
  @include flex-cards(220px, 1.5rem);

  &__block {
    @include flex(column, flex-start, flex-start, 0.2rem);
    font-size: $text-sm;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }

  &__title {
    @include eyebrow;
    margin-bottom: 0.35rem;
    color: $ink-soft;
  }

  &__soft {
    color: $ink-soft;
  }

  &__link {
    @include flex(row, center, flex-start, 0.4rem);
    @include focus-ring;
    min-height: 2.75rem;
    font-weight: 600;
    color: $accent;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
