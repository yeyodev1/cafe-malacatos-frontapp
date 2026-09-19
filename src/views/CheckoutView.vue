<script setup lang="ts">
import { computed, onMounted, toRef, watch } from 'vue'
import { copy } from '@/config/copy'
import { checkoutCopy } from '@/config/copy.checkout'
import { lineKey, useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
import { useSeo } from '@/composables/useSeo'
import { useCheckoutForm } from '@/composables/checkout/useCheckoutForm'
import { useShippingQuote } from '@/composables/checkout/useShippingQuote'
import { useCheckoutOrder } from '@/composables/checkout/useCheckoutOrder'
import BaseCta from '@/components/ui/BaseCta.vue'
import StateBlock from '@/components/ui/StateBlock.vue'
import CheckoutContact from '@/components/checkout/CheckoutContact.vue'
import CheckoutShipping from '@/components/checkout/CheckoutShipping.vue'
import CheckoutBilling from '@/components/checkout/CheckoutBilling.vue'
import CheckoutPayment from '@/components/checkout/CheckoutPayment.vue'
import CheckoutSummary, { type SummaryItem } from '@/components/checkout/CheckoutSummary.vue'
import PayphoneBox from '@/components/checkout/PayphoneBox.vue'
import TransferPanel from '@/components/checkout/TransferPanel.vue'

const cart = useCartStore()
const settings = useSettingsStore()
const userStore = useUserStore()
const text = checkoutCopy.page

const { form, errors, prefillFromSession } = useCheckoutForm()
const quote = useShippingQuote(toRef(form.shipping, 'province'))
const checkout = useCheckoutOrder(quote.status)
const { stage, order, created } = checkout

const hasFieldErrors = computed(() => Object.keys(errors).length > 0)

// Con la orden creada manda lo que calculó el servidor; antes, el carrito y la cotización.
const summary = computed(() => {
  if (order.value) {
    const items: SummaryItem[] = order.value.items.map((item) => ({
      key: `${item.product}:${item.variantId}`,
      name: item.name,
      variantLabel: item.variantLabel,
      qty: item.qty,
      lineTotalCents: item.lineTotalCents,
      image: item.image,
    }))
    return {
      items,
      subtotalCents: order.value.subtotalCents,
      shippingCents: order.value.shippingCents,
      quoteStatus: 'available' as const,
      province: order.value.shipping.province,
    }
  }
  const items: SummaryItem[] = cart.lines.map((line) => ({
    key: lineKey(line),
    name: line.name,
    variantLabel: line.variantLabel,
    qty: line.qty,
    lineTotalCents: line.unitPriceCents * line.qty,
    image: line.image,
  }))
  return {
    items,
    subtotalCents: cart.subtotalCents,
    shippingCents: quote.shippingCents.value,
    quoteStatus: quote.status.value,
    province: form.shipping.province,
  }
})

onMounted(() => {
  settings.load()
  prefillFromSession()
})
// La sesión se restaura en segundo plano: si llega después de montar, igual se precarga.
watch(() => userStore.user, prefillFromSession)

useSeo(() => ({ title: text.eyebrow, path: '/checkout', noindex: true }))
</script>

<template>
  <section class="checkout">
    <header class="checkout__head">
      <p class="checkout__eyebrow">{{ text.eyebrow }}</p>
      <h1 class="checkout__title">{{ text.title }}</h1>
      <p v-if="stage === 'form' && !cart.isEmpty" class="checkout__lead">{{ text.lead }}</p>
    </header>

    <StateBlock
      v-if="stage === 'form' && cart.isEmpty"
      icon="fa-solid fa-bag-shopping"
      :title="text.emptyTitle"
      :text="text.emptyText"
    >
      <BaseCta to="/tienda" variant="dark" icon-right="fa-solid fa-arrow-right">
        {{ copy.common.goToShop }}
      </BaseCta>
    </StateBlock>

    <div v-else class="checkout__layout">
      <!-- Primero en el DOM: en móvil el total (producto + envío) se ve antes de llenar nada. -->
      <div class="checkout__aside">
        <CheckoutSummary v-bind="summary" :editable="stage === 'form'" @retry="quote.retry()" />
      </div>

      <div class="checkout__main">
        <form
          v-if="stage === 'form'"
          class="checkout__form"
          novalidate
          :aria-label="text.formLabel"
          @submit.prevent="checkout.submit()"
        >
          <CheckoutContact />
          <CheckoutShipping />
          <CheckoutBilling />
          <CheckoutPayment
            :quote-status="quote.status.value"
            :total-cents="quote.totalCents.value"
            :submitting="checkout.submitting.value"
            :submit-error="checkout.submitError.value"
            :has-field-errors="hasFieldErrors"
          />
          <RouterLink to="/carrito" class="checkout__back">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ text.backToCart }}
          </RouterLink>
        </form>

        <PayphoneBox
          v-else-if="stage === 'card' && order && created?.payphone"
          :key="created.payphone.clientTransactionId"
          :config="created.payphone"
          :buyer="checkout.buyer.value"
          :order="order"
          :busy="checkout.submitting.value"
          @new-attempt="checkout.submit()"
          @back="checkout.backToForm()"
        />

        <TransferPanel
          v-else-if="stage === 'transfer' && order"
          :order="order"
          :accounts="created?.bankAccounts ?? []"
          :instructions="created?.transferInstructions"
          @uploaded="checkout.setOrder($event)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.checkout {
  @include container;
  padding-block: $space-lg $space-section;

  &__head {
    @include flex(column, flex-start, flex-start, 0.6rem);
    margin-bottom: $space-md;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
  }

  &__lead {
    color: $ink-soft;
  }

  // Móvil: resumen arriba. Escritorio: el mismo resumen pasa a columna lateral
  // fija a la derecha (row-reverse, porque en el DOM va primero).
  &__layout {
    @include flex(column, stretch, flex-start, 1.5rem);

    @include from('lg') {
      flex-direction: row-reverse;
      align-items: flex-start;
      gap: 3rem;
    }
  }

  &__main {
    flex: 1 1 60%;
    min-width: 0;
  }

  &__form {
    @include flex(column, stretch, flex-start, 1.25rem);
  }

  &__aside {
    flex: 1 1 36%;
    min-width: 0;

    @include from('lg') {
      position: sticky;
      top: 5.5rem;
      max-width: 26rem;
    }
  }

  &__back {
    @include flex(row, center, flex-start, 0.5rem);
    @include focus-ring;
    align-self: flex-start;
    min-height: 2.75rem;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;

    &:hover {
      color: $accent;
    }
  }
}
</style>
