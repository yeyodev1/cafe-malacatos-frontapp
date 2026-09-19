<script setup lang="ts">
import { copy } from '@/config/copy'
import { checkoutCopy } from '@/config/copy.checkout'
import { useSeo } from '@/composables/useSeo'
import { useWhatsappOrder } from '@/composables/useWhatsappOrder'
import { usePaymentConfirm } from '@/composables/checkout/usePaymentConfirm'
import { formatCents } from '@/utils/money'
import BaseCta from '@/components/ui/BaseCta.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const text = checkoutCopy.response
const { state, order, message, busy, trackingLink, confirm } = usePaymentConfirm()
const { askLink } = useWhatsappOrder()

// Se confirma en el setup, sin esperar al montaje ni a ningún clic: si nadie
// confirma en 5 minutos, Payphone reversa el cobro.
confirm()

useSeo(() => ({ title: text.title, path: '/pago/respuesta', noindex: true }))
</script>

<template>
  <section class="response">
    <div v-if="state === 'confirming'" class="response__card" role="status" aria-live="polite">
      <span class="response__icon response__icon--soft">
        <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
      </span>
      <h1 class="response__title">{{ text.confirmingTitle }}</h1>
      <p class="response__text">{{ text.confirmingText }}</p>
    </div>

    <div v-else-if="state === 'approved' && order" class="response__card" role="status">
      <span class="response__icon response__icon--success">
        <i class="fa-solid fa-check" aria-hidden="true"></i>
      </span>
      <p class="response__eyebrow">{{ text.approvedEyebrow }}</p>
      <h1 class="response__title">{{ text.approvedTitle }}</h1>
      <p class="response__text">
        {{ text.approvedText }} <strong>{{ order.customer.email }}</strong>
      </p>
      <dl class="response__order">
        <div>
          <dt>{{ text.orderNumber }}</dt>
          <dd>{{ order.number }}</dd>
        </div>
        <div>
          <dt>{{ text.totalPaid }}</dt>
          <dd>{{ formatCents(order.totalCents) }}</dd>
        </div>
      </dl>
      <div class="response__actions">
        <RouterLink v-if="trackingLink" :to="trackingLink" class="btn btn--dark">
          {{ text.track }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
        <BaseCta to="/tienda" variant="outline">{{ copy.common.backToShop }}</BaseCta>
      </div>
    </div>

    <StateBlock
      v-else-if="state === 'rejected'"
      heading-level="h1"
      icon="fa-solid fa-credit-card"
      :title="text.rejectedTitle"
      :text="text.rejectedText"
    >
      <BaseCta to="/checkout" variant="dark">{{ text.tryAgain }}</BaseCta>
      <BaseCta :href="askLink(text.helpMessage)" variant="outline" icon="fa-brands fa-whatsapp">
        {{ text.help }}
      </BaseCta>
    </StateBlock>

    <StateBlock
      v-else-if="state === 'pending' || state === 'error'"
      heading-level="h1"
      tone="error"
      icon="fa-solid fa-triangle-exclamation"
      :title="state === 'pending' ? text.pendingTitle : text.errorTitle"
      :text="message || text.errorText"
    >
      <button class="btn btn--dark" type="button" :disabled="busy" @click="confirm">
        <i v-if="busy" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
        {{ busy ? text.retrying : text.retry }}
      </button>
      <BaseCta :href="askLink(text.helpMessage)" variant="outline" icon="fa-brands fa-whatsapp">
        {{ text.help }}
      </BaseCta>
    </StateBlock>

    <StateBlock
      v-else
      heading-level="h1"
      icon="fa-solid fa-receipt"
      :title="text.missingTitle"
      :text="message || text.missingText"
    >
      <BaseCta to="/tienda" variant="dark">{{ copy.common.goToShop }}</BaseCta>
      <BaseCta :href="askLink(text.helpMessage)" variant="outline" icon="fa-brands fa-whatsapp">
        {{ text.help }}
      </BaseCta>
    </StateBlock>
  </section>
</template>

<style scoped lang="scss">
.response {
  @include container(720px);
  @include flex(column, stretch, center, 0);
  flex: 1;
  padding-block: $space-lg $space-section;

  &__card {
    @include card;
    @include flex(column, center, center, 0.9rem);
    padding: 2.5rem 1.25rem;
    border-radius: $radius-md;
    border-top: 3px solid $gold-deep;
    text-align: center;

    @include from('md') {
      padding: 3.5rem 2.5rem;
    }
  }

  &__icon {
    @include flex(row, center, center);
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    font-size: 1.5rem;

    &--soft {
      background: $gold-soft;
      color: $accent-deep;
    }

    &--success {
      background: $success-text;
      color: $surface;
    }
  }

  &__eyebrow {
    @include eyebrow;
    color: $success-text;
  }

  &__title {
    @include display($display-sm);
  }

  &__text {
    max-width: 46ch;
    color: $ink-soft;
    overflow-wrap: anywhere;

    strong {
      color: $ink;
    }
  }

  &__order {
    @include flex-cards(160px, 1rem);
    width: 100%;
    margin-block: 0.5rem;
    padding: 1.1rem;
    border-radius: $radius-sm;
    background: $sand;

    dt {
      font-size: $text-xs;
      color: $ink-soft;
    }

    dd {
      font-size: $text-lg;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
  }

  &__actions {
    @include flex(row, center, center, 0.75rem);
    flex-wrap: wrap;
  }
}
</style>
