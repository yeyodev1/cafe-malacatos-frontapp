<script setup lang="ts">
import { checkoutCopy } from '@/config/copy.checkout'
import { PROVINCES } from '@/utils/ecuador'
import { fieldId, useCheckoutForm } from '@/composables/checkout/useCheckoutForm'
import CheckoutStep from './CheckoutStep.vue'
import CheckoutField from './CheckoutField.vue'
import DeliveryPin from './DeliveryPin.vue'

const { form, errors, touch } = useCheckoutForm()
const labels = checkoutCopy.fields
const step = checkoutCopy.steps.shipping
const provinces = PROVINCES.map((province) => ({ value: province, label: province }))
</script>

<template>
  <CheckoutStep :step="2" :title="step.title" :lead="step.lead">
    <div class="shipping__row">
      <CheckoutField
        :id="fieldId('province')"
        v-model="form.shipping.province"
        :label="labels.province"
        :error="errors.province"
        :options="provinces"
        :placeholder="labels.provincePlaceholder"
        autocomplete="address-level1"
        @blur="touch('province')"
      />
      <CheckoutField
        :id="fieldId('city')"
        v-model="form.shipping.city"
        :label="labels.city"
        :error="errors.city"
        autocomplete="address-level2"
        :maxlength="80"
        @blur="touch('city')"
      />
    </div>
    <CheckoutField
      :id="fieldId('address')"
      v-model="form.shipping.address"
      :label="labels.address"
      :hint="labels.addressHint"
      :error="errors.address"
      autocomplete="street-address"
      :maxlength="300"
      @blur="touch('address')"
    />
    <CheckoutField
      id="checkout-reference"
      v-model="form.shipping.reference"
      :label="labels.reference"
      :hint="labels.referenceHint"
      :optional-label="labels.optional"
      :maxlength="300"
      multiline
    />
    <DeliveryPin />
  </CheckoutStep>
</template>

<style scoped lang="scss">
.shipping__row {
  @include flex-cards(220px, 1rem);
}
</style>
