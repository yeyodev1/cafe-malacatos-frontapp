<script setup lang="ts">
import { checkoutCopy } from '@/config/copy.checkout'
import { fieldId, useCheckoutForm } from '@/composables/checkout/useCheckoutForm'
import CheckoutStep from './CheckoutStep.vue'
import CheckoutField from './CheckoutField.vue'

const { form, errors, touch } = useCheckoutForm()
const labels = checkoutCopy.fields
const step = checkoutCopy.steps.contact
</script>

<template>
  <CheckoutStep :step="1" :title="step.title" :lead="step.lead">
    <CheckoutField
      :id="fieldId('name')"
      v-model="form.customer.name"
      :label="labels.name"
      :error="errors.name"
      autocomplete="name"
      :maxlength="120"
      @blur="touch('name')"
    />
    <div class="contact__row">
      <CheckoutField
        :id="fieldId('email')"
        v-model="form.customer.email"
        :label="labels.email"
        :error="errors.email"
        type="email"
        inputmode="email"
        autocomplete="email"
        :maxlength="200"
        @blur="touch('email')"
      />
      <CheckoutField
        :id="fieldId('phone')"
        v-model="form.customer.phone"
        :label="labels.phone"
        :error="errors.phone"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        :maxlength="30"
        @blur="touch('phone')"
      />
    </div>
  </CheckoutStep>
</template>

<style scoped lang="scss">
.contact__row {
  @include flex-cards(220px, 1rem);
}
</style>
