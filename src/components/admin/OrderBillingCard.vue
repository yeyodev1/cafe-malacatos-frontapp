<script setup lang="ts">
import { computed } from 'vue'
import { adminCopy, billingIdType } from '@/config/copy.admin'
import { centsToDecimal } from '@/utils/money'
import { useCopyText } from '@/composables/admin/useCopyText'
import AdminSection from './AdminSection.vue'
import type { Order } from '@/types'

// La factura se emite a mano en otro sistema: cada dato se copia con un toque.
const text = adminCopy.order
const common = adminCopy.common
const props = defineProps<{ order: Order; busy: boolean }>()
const emit = defineEmits<{ invoice: [issued: boolean] }>()

const { copiedKey, copyText } = useCopyText()

const rows = computed(() => {
  const b = props.order.billing
  return [
    { key: 'idType', label: text.billing.idType, value: billingIdType[b.idType] || b.idType },
    { key: 'idNumber', label: text.billing.idNumber, value: b.idNumber },
    { key: 'name', label: text.billing.name, value: b.name },
    { key: 'address', label: text.billing.address, value: b.address },
    { key: 'email', label: text.billing.email, value: b.email },
    { key: 'phone', label: text.billing.phone, value: b.phone },
    // Sin el signo $: así se pega directo en la casilla de valor del facturador.
    { key: 'total', label: text.billing.total, value: centsToDecimal(props.order.totalCents) },
  ]
})
</script>

<template>
  <AdminSection
    tone="highlight"
    :title="text.billingTitle"
    :lead="text.billingLead"
    icon="fa-solid fa-file-invoice-dollar"
  >
    <dl class="billing">
      <div v-for="row in rows" :key="row.key" class="billing__row">
        <div class="billing__data">
          <dt>{{ row.label }}</dt>
          <dd :class="{ billing__empty: !row.value }">{{ row.value || common.empty }}</dd>
        </div>
        <button
          v-if="row.value"
          type="button"
          class="billing__copy"
          :class="{ 'billing__copy--done': copiedKey === row.key }"
          :aria-label="`${common.copy}: ${row.label}`"
          @click="copyText(row.key, row.value)"
        >
          <i
            :class="copiedKey === row.key ? 'fa-solid fa-check' : 'fa-regular fa-copy'"
            aria-hidden="true"
          ></i>
          <span aria-live="polite">{{ copiedKey === row.key ? common.copied : common.copy }}</span>
        </button>
      </div>
    </dl>

    <label class="billing__invoice" :class="{ 'billing__invoice--on': order.invoiceIssued }">
      <input
        type="checkbox"
        :checked="order.invoiceIssued"
        :disabled="busy"
        @change="emit('invoice', ($event.target as HTMLInputElement).checked)"
      />
      <span>
        <strong>{{ text.invoiceLabel }}</strong>
        <small>{{ text.invoiceHint }}</small>
      </span>
    </label>
  </AdminSection>
</template>

<style scoped lang="scss">
.billing {
  @include flex(column, stretch, flex-start);

  &__row {
    @include flex(row, center, space-between, 0.75rem);
    padding: 0.55rem 0;
    border-bottom: 1px solid $line;
  }

  &__data {
    min-width: 0;

    dt {
      color: $ink-muted;
      font-size: $text-xs;
      font-weight: 600;
    }

    dd {
      font-weight: 600;
      overflow-wrap: anywhere;
      user-select: all;
    }
  }

  &__empty {
    color: $ink-muted;
    font-weight: 400 !important;
  }

  &__copy {
    @include flex(row, center, center, 0.45rem);
    @include transition(background-color);
    flex: 0 0 auto;
    min-width: 6.4rem;
    min-height: 2.75rem;
    padding: 0.4rem 0.9rem;
    border: 1px solid $accent;
    border-radius: $radius-pill;
    background: $surface;
    color: $accent-deep;
    font-size: $text-sm;
    font-weight: 600;

    &:hover {
      background: $accent-soft;
    }

    &--done {
      border-color: $success-text;
      background: $success-bg;
      color: $success-text;
    }
  }

  &__invoice {
    @include flex(row, flex-start, flex-start, 0.85rem);
    margin: 0;
    padding: 0.9rem 1rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $paper;
    color: $ink;
    cursor: pointer;

    &--on {
      border-color: $success-text;
      background: $success-bg;
    }

    input {
      flex: 0 0 auto;
      width: 1.5rem;
      height: 1.5rem;
      margin-top: 0.1rem;
      padding: 0;
      accent-color: $success-text;
    }

    strong,
    small {
      display: block;
    }

    strong {
      font-size: $text-base;
    }

    small {
      color: $ink-soft;
      font-size: $text-xs;
      font-weight: 400;
    }
  }
}
</style>
