<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { copy } from '@/config/copy'
import { checkoutCopy } from '@/config/copy.checkout'
import { useSettingsStore } from '@/stores/settings'
import { useSeo } from '@/composables/useSeo'
import { useWhatsappOrder } from '@/composables/useWhatsappOrder'
import { useOrderTracking } from '@/composables/checkout/useOrderTracking'
import { formatDate } from '@/utils/format'
import BaseCta from '@/components/ui/BaseCta.vue'
import StateBlock from '@/components/ui/StateBlock.vue'
import CheckoutSummary, { type SummaryItem } from '@/components/checkout/CheckoutSummary.vue'
import OrderStatusBadge from '@/components/checkout/OrderStatusBadge.vue'
import OrderTimeline from '@/components/checkout/OrderTimeline.vue'
import OrderDetails from '@/components/checkout/OrderDetails.vue'
import TransferPanel from '@/components/checkout/TransferPanel.vue'
import TrackingEmailForm from '@/components/checkout/TrackingEmailForm.vue'

const settings = useSettingsStore()
const text = checkoutCopy.tracking
const { askLink } = useWhatsappOrder()
const { number, state, order, message, emailInput, emailError, load, submitEmail, setOrder } =
  useOrderTracking()

const items = computed<SummaryItem[]>(() =>
  (order.value?.items ?? []).map((item) => ({
    key: `${item.product}:${item.variantId}`,
    name: item.name,
    variantLabel: item.variantLabel,
    qty: item.qty,
    lineTotalCents: item.lineTotalCents,
    image: item.image,
  })),
)

// El comprobante se puede subir (o reemplazar) mientras la transferencia no esté aprobada.
const canUploadProof = computed(
  () =>
    order.value?.paymentMethod === 'transfer' &&
    (order.value.status === 'pending' || order.value.status === 'awaiting_verification'),
)
const unpaidCard = computed(
  () => order.value?.paymentMethod === 'card' && order.value.status === 'pending',
)
const helpLink = computed(() => askLink(`${text.helpMessage} ${number.value}`))

// Las cuentas bancarias vienen de los ajustes públicos.
onMounted(() => settings.load())

useSeo(() => ({
  title: `${text.title} ${number.value}`,
  path: `/pedido/${number.value}`,
  noindex: true,
}))
</script>

<template>
  <section class="tracking">
    <header class="tracking__head">
      <p class="tracking__eyebrow">{{ text.eyebrow }}</p>
      <h1 class="tracking__title">{{ text.title }} {{ number }}</h1>
      <p v-if="order" class="tracking__meta">
        <OrderStatusBadge :status="order.status" />
        <span>{{ text.placedOn }} {{ formatDate(order.createdAt) }}</span>
      </p>
    </header>

    <p v-if="state === 'loading'" class="tracking__loading" role="status">
      <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> {{ text.loading }}
    </p>

    <StateBlock
      v-else-if="state === 'error'"
      tone="error"
      icon="fa-solid fa-triangle-exclamation"
      :title="text.errorTitle"
      :text="message"
    >
      <button class="btn btn--dark" type="button" @click="load">{{ copy.common.retry }}</button>
    </StateBlock>

    <TrackingEmailForm
      v-else-if="state === 'ask' || state === 'notFound'"
      v-model="emailInput"
      :number="number"
      :not-found="state === 'notFound'"
      :invalid="emailError"
      :help-link="helpLink"
      @submit="submitEmail"
    />

    <div v-else-if="order" class="tracking__layout">
      <div class="tracking__main">
        <section class="tracking__card" aria-labelledby="tracking-status">
          <h2 id="tracking-status" class="tracking__card-title">{{ text.statusTitle }}</h2>
          <OrderTimeline :order="order" />
          <p v-if="unpaidCard" class="tracking__hint">{{ text.payPendingCard }}</p>
          <div v-if="order.trackingNote" class="tracking__note">
            <strong>
              <i class="fa-solid fa-truck-fast" aria-hidden="true"></i> {{ text.trackingNoteTitle }}
            </strong>
            <p>{{ order.trackingNote }}</p>
          </div>
        </section>

        <TransferPanel
          v-if="canUploadProof"
          compact
          :order="order"
          :accounts="settings.bankAccounts"
          :instructions="settings.transferInstructions"
          @uploaded="setOrder"
        />

        <section class="tracking__card"><OrderDetails :order="order" /></section>

        <BaseCta :href="helpLink" variant="outline" icon="fa-brands fa-whatsapp">
          {{ text.help }}
        </BaseCta>
      </div>

      <div class="tracking__aside">
        <CheckoutSummary
          :items="items"
          :subtotal-cents="order.subtotalCents"
          :shipping-cents="order.shippingCents"
          quote-status="available"
          :province="order.shipping.province"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.tracking {
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
    overflow-wrap: anywhere;
  }

  &__meta {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__loading {
    @include flex(row, center, flex-start, 0.6rem);
    padding-block: 3rem;
    color: $ink-soft;
  }

  &__card {
    @include card;
    @include flex(column, stretch, flex-start, 1rem);
    padding: 1.5rem 1.1rem;
    border-radius: $radius-md;

    @include from('md') {
      padding: 2rem;
    }
  }

  &__card-title {
    @include display($text-xl, 500);
  }

  &__hint {
    font-size: $text-sm;
    line-height: 1.55;
    color: $ink-soft;
  }

  &__layout {
    @include flex(column, stretch, flex-start, 1.5rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 3rem;
    }
  }

  &__main {
    @include flex(column, stretch, flex-start, 1.25rem);
    flex: 1 1 60%;
    min-width: 0;
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

  &__note {
    @include flex(column, stretch, flex-start, 0.3rem);
    padding: 1rem;
    border-radius: $radius-sm;
    background: $sand;
    font-size: $text-sm;
    line-height: 1.55;
    white-space: pre-line;

    i {
      color: $accent;
    }
  }
}
</style>
