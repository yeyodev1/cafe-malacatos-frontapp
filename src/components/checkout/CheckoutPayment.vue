<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { site } from '@/config/site'
import { checkoutCopy } from '@/config/copy.checkout'
import { useSettingsStore } from '@/stores/settings'
import { useCheckoutForm } from '@/composables/checkout/useCheckoutForm'
import { useCheckoutWhatsapp } from '@/composables/checkout/useCheckoutWhatsapp'
import { formatCents } from '@/utils/money'
import CheckoutStep from './CheckoutStep.vue'
import type { QuoteStatus } from '@/composables/checkout/useShippingQuote'
import type { PaymentMethod } from '@/types'

/**
 * Paso de pago. El botón es el submit del formulario de la vista. Si la
 * provincia no tiene tarifa en línea no hay botón de pago: el cierre es por WhatsApp.
 */
const props = defineProps<{
  quoteStatus: QuoteStatus
  totalCents: number | null
  submitting: boolean
  submitError: string
  hasFieldErrors: boolean
}>()

const settings = useSettingsStore()
const { form } = useCheckoutForm()
const { link: whatsappLink } = useCheckoutWhatsapp()
const text = checkoutCopy.payment
const step = checkoutCopy.steps.payment

const transferAvailable = computed(
  () => settings.transferEnabled && settings.bankAccounts.length > 0,
)
const methods = computed(() => {
  const list: { value: PaymentMethod; label: string; hint: string; icon: string }[] = [
    { value: 'card', label: text.card, hint: text.cardHint, icon: 'fa-solid fa-credit-card' },
  ]
  if (transferAvailable.value) {
    list.push({
      value: 'transfer',
      label: text.transfer,
      hint: text.transferHint,
      icon: 'fa-solid fa-building-columns',
    })
  }
  return list
})

// Si el admin quita las cuentas mientras alguien compra, no queda elegida una opción que ya no existe.
watchEffect(() => {
  if (form.paymentMethod === 'transfer' && !transferAvailable.value) form.paymentMethod = 'card'
})

const noRate = computed(() => props.quoteStatus === 'unavailable')
const blocked = computed(
  () => props.submitting || props.quoteStatus === 'loading' || props.quoteStatus === 'error',
)
const payLabel = computed(() => {
  if (props.submitting) return text.sending
  const base = form.paymentMethod === 'card' ? text.payCard : text.payTransfer
  return props.totalCents === null ? base : `${base} · ${formatCents(props.totalCents)}`
})
</script>

<template>
  <CheckoutStep :step="4" :title="step.title" :lead="noRate ? '' : step.lead">
    <div v-if="noRate" class="payment__no-rate" role="status">
      <p class="payment__no-rate-title">
        <i class="fa-solid fa-truck" aria-hidden="true"></i> {{ text.noRateTitle }}
      </p>
      <p>{{ site.checkout.noRateNote }}</p>
      <a class="payment__whatsapp" :href="whatsappLink" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ site.checkout.whatsappCta }}
      </a>
    </div>

    <template v-else>
      <div class="payment__methods" role="radiogroup" :aria-label="text.methodLabel">
        <label
          v-for="method in methods"
          :key="method.value"
          class="payment__method"
          :class="{ 'payment__method--active': form.paymentMethod === method.value }"
          :for="`checkout-pay-${method.value}`"
        >
          <input
            :id="`checkout-pay-${method.value}`"
            v-model="form.paymentMethod"
            class="payment__radio"
            type="radio"
            name="paymentMethod"
            :value="method.value"
          />
          <i :class="method.icon" aria-hidden="true"></i>
          <span>
            <strong>{{ method.label }}</strong>
            <span class="payment__hint">{{ method.hint }}</span>
          </span>
        </label>
      </div>

      <p class="payment__note">{{ site.checkout.shippingNote }}</p>

      <p v-if="submitError || hasFieldErrors" class="payment__error" role="alert">
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
        {{ submitError || checkoutCopy.errors.summary }}
      </p>
      <p v-else-if="quoteStatus === 'idle'" class="payment__hint">{{ text.waitQuote }}</p>

      <button class="payment__submit" type="submit" :disabled="blocked" :aria-busy="submitting">
        <i
          :class="submitting ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-lock'"
          aria-hidden="true"
        ></i>
        {{ payLabel }}
      </button>

      <p class="payment__or">{{ text.or }}</p>
      <a
        class="payment__whatsapp payment__whatsapp--quiet"
        :href="whatsappLink"
        target="_blank"
        rel="noopener"
      >
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ site.checkout.whatsappCta }}
      </a>
    </template>
  </CheckoutStep>
</template>

<style scoped lang="scss">
@mixin pill {
  @include flex(row, center, center, 0.6rem);
  @include transition;
  width: 100%;
  min-height: 3.25rem;
  padding: 0.85rem 1.4rem;
  border: 1px solid transparent;
  border-radius: $radius-pill;
  font-size: $text-sm;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-align: center;
}

.payment {
  &__methods {
    @include flex(column, stretch, flex-start, 0.75rem);
  }

  &__method {
    @include flex(row, flex-start, flex-start, 0.8rem);
    @include transition(border-color);
    margin: 0;
    padding: 1rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    font-size: $text-sm;
    color: $ink;
    cursor: pointer;

    > i {
      margin-top: 0.15rem;
      color: $accent;
    }

    strong {
      display: block;
      font-weight: 600;
    }

    &--active {
      border-color: $accent;
      background: $paper;
      box-shadow: 0 0 0 1px $accent;
    }

    &:focus-within {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }
  }

  &__radio {
    flex: 0 0 auto;
    width: 1.2rem;
    height: 1.2rem;
    margin-top: 0.1rem;
    padding: 0;
    accent-color: $accent;
  }

  &__hint,
  &__note {
    display: block;
    font-size: $text-xs;
    line-height: 1.5;
    color: $ink-soft;
  }

  &__error {
    @include flex(row, flex-start, flex-start, 0.5rem);
    padding: 0.75rem 0.9rem;
    border-radius: $radius-sm;
    background: $danger-bg;
    color: $danger-text;
    font-size: $text-sm;

    i {
      margin-top: 0.2rem;
    }
  }

  &__submit {
    @include pill;
    @include focus-ring;
    background: $ink;
    color: $paper;

    &:hover {
      background: $accent-deep;
    }

    &:disabled {
      opacity: 0.55;
      pointer-events: none;
    }
  }

  &__or {
    @include eyebrow;
    text-align: center;
    color: $ink-soft;
  }

  &__whatsapp {
    @include pill;
    @include focus-ring($whatsapp-deep);
    background: $whatsapp;
    color: $surface;

    &:hover {
      background: $whatsapp-deep;
    }

    &--quiet {
      border-color: $whatsapp-deep;
      background: transparent;
      color: $whatsapp-deep;

      &:hover {
        background: $whatsapp-deep;
        color: $surface;
      }
    }
  }

  &__no-rate {
    @include flex(column, stretch, flex-start, 0.9rem);
    padding: 1.1rem;
    border-radius: $radius-sm;
    background: $sand;
    font-size: $text-sm;
    line-height: 1.55;
  }

  &__no-rate-title {
    @include flex(row, center, flex-start, 0.6rem);
    font-weight: 600;

    i {
      color: $accent;
    }
  }
}
</style>
