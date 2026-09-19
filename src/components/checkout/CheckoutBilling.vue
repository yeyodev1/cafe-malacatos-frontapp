<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import { checkoutCopy } from '@/config/copy.checkout'
import { fieldId, useCheckoutForm } from '@/composables/checkout/useCheckoutForm'
import CheckoutStep from './CheckoutStep.vue'
import CheckoutField from './CheckoutField.vue'
import type { BillingIdType } from '@/types'

const { form, errors, touch } = useCheckoutForm()
const labels = checkoutCopy.fields
const text = checkoutCopy.billing
const step = checkoutCopy.steps.billing

const ID_TYPES: BillingIdType[] = ['cedula', 'ruc', 'pasaporte', 'consumidor_final']
const idTypes = ID_TYPES.map((value) => ({ value, label: checkoutCopy.idTypes[value] }))

// El campo genérico habla en string; acá se devuelve al tipo del contrato.
const idType = computed<string>({
  get: () => form.billing.idType,
  set: (value) => (form.billing.idType = value as BillingIdType),
})
const isConsumer = computed(() => form.billing.idType === 'consumidor_final')
const showOwnData = computed(() => !isConsumer.value && !form.billingSameAsContact)
// Cédula y RUC son solo números: teclado numérico y tope de dígitos.
const isNumericId = computed(() => form.billing.idType !== 'pasaporte')
const idMaxLength = computed(() =>
  form.billing.idType === 'cedula' ? 10 : form.billing.idType === 'ruc' ? 13 : 20,
)
</script>

<template>
  <CheckoutStep :step="3" :title="step.title" :lead="step.lead">
    <p class="billing__note">
      <i class="fa-solid fa-file-invoice" aria-hidden="true"></i> {{ site.checkout.invoiceNote }}
    </p>

    <div class="billing__row">
      <CheckoutField
        id="checkout-idType"
        v-model="idType"
        :label="labels.idType"
        :options="idTypes"
      />
      <CheckoutField
        v-if="!isConsumer"
        :id="fieldId('idNumber')"
        v-model="form.billing.idNumber"
        :label="labels.idNumber"
        :error="errors.idNumber"
        :inputmode="isNumericId ? 'numeric' : 'text'"
        :maxlength="idMaxLength"
        @blur="touch('idNumber')"
      />
    </div>

    <p v-if="isConsumer" class="billing__hint">{{ text.consumerNote }}</p>

    <template v-else>
      <label class="billing__check" for="checkout-sameAsContact">
        <input id="checkout-sameAsContact" v-model="form.billingSameAsContact" type="checkbox" />
        <span>
          <strong>{{ text.sameAsContact }}</strong>
          <span class="billing__hint">{{ text.sameAsContactHint }}</span>
        </span>
      </label>

      <template v-if="showOwnData">
        <CheckoutField
          :id="fieldId('billingName')"
          v-model="form.billing.name"
          :label="labels.billingName"
          :error="errors.billingName"
          autocomplete="billing name"
          :maxlength="160"
          @blur="touch('billingName')"
        />
        <CheckoutField
          :id="fieldId('billingAddress')"
          v-model="form.billing.address"
          :label="labels.billingAddress"
          :error="errors.billingAddress"
          autocomplete="billing street-address"
          :maxlength="300"
          @blur="touch('billingAddress')"
        />
        <div class="billing__row">
          <CheckoutField
            :id="fieldId('billingEmail')"
            v-model="form.billing.email"
            :label="labels.billingEmail"
            :error="errors.billingEmail"
            type="email"
            inputmode="email"
            autocomplete="billing email"
            :maxlength="200"
            @blur="touch('billingEmail')"
          />
          <CheckoutField
            :id="fieldId('billingPhone')"
            v-model="form.billing.phone"
            :label="labels.billingPhone"
            :error="errors.billingPhone"
            type="tel"
            inputmode="tel"
            autocomplete="billing tel"
            :maxlength="30"
            @blur="touch('billingPhone')"
          />
        </div>
      </template>
    </template>
  </CheckoutStep>
</template>

<style scoped lang="scss">
.billing {
  &__note {
    @include flex(row, flex-start, flex-start, 0.6rem);
    padding: 0.8rem 0.9rem;
    border-radius: $radius-sm;
    background: $sand;
    font-size: $text-sm;
    line-height: 1.5;
    color: $ink;

    i {
      margin-top: 0.2rem;
      color: $accent;
    }
  }

  &__row {
    @include flex-cards(220px, 1rem);
  }

  &__check {
    @include flex(row, flex-start, flex-start, 0.75rem);
    margin: 0;
    padding: 0.4rem 0;
    font-size: $text-sm;
    color: $ink;
    cursor: pointer;

    input {
      flex: 0 0 auto;
      width: 1.35rem;
      height: 1.35rem;
      margin-top: 0.1rem;
      padding: 0;
      accent-color: $accent;
    }

    strong {
      display: block;
      font-weight: 600;
    }
  }

  &__hint {
    display: block;
    font-size: $text-xs;
    line-height: 1.5;
    color: $ink-soft;
  }
}
</style>
