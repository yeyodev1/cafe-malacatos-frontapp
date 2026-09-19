<script setup lang="ts">
import { adminCopy } from '@/config/copy.admin'
import type { ZoneErrors } from '@/composables/admin/useShippingZones'
import AdminField from './AdminField.vue'
import AdminMoneyInput from './AdminMoneyInput.vue'
import AdminSection from './AdminSection.vue'

// Dos ayudas sobre la lista: la tarifa en bloque y el ejemplo en vivo de la fórmula.
const text = adminCopy.shipping
defineProps<{
  bulk: { base: string; includedKg: string; extra: string }
  bulkErrors: ZoneErrors
  withoutRateCount: number
  example: { province: string; kg: string }
  provinces: string[]
  result: { ok: boolean; main: string; detail: string } | null
}>()
const emit = defineEmits<{ applyBulk: [] }>()
</script>

<template>
  <div class="tools">
    <AdminSection :title="text.exampleTitle" :lead="text.how" icon="fa-solid fa-calculator">
      <div class="tools__fields">
        <AdminField id="example-province" v-slot="f" :label="text.exampleProvince">
          <select :id="f.id" v-model="example.province">
            <option v-for="province in provinces" :key="province" :value="province">
              {{ province }}
            </option>
          </select>
        </AdminField>
        <AdminField id="example-kg" v-slot="f" :label="text.exampleWeight">
          <input :id="f.id" v-model="example.kg" type="text" inputmode="decimal" />
        </AdminField>
      </div>
      <p
        v-if="result"
        class="tools__result"
        :class="{ 'tools__result--no': !result.ok }"
        aria-live="polite"
      >
        <strong>{{ result.main }}</strong>
        <span v-if="result.detail">{{ result.detail }}</span>
      </p>
    </AdminSection>

    <AdminSection :title="text.bulkTitle" :lead="text.bulkLead" icon="fa-solid fa-layer-group">
      <div class="tools__fields">
        <AdminField id="bulk-base" v-slot="f" :label="text.base" :error="bulkErrors.base">
          <AdminMoneyInput
            :id="f.id"
            v-model="bulk.base"
            :described-by="f.describedBy"
            :invalid="f.invalid"
          />
        </AdminField>
        <AdminField id="bulk-kg" v-slot="f" :label="text.includedKg" :error="bulkErrors.includedKg">
          <input
            :id="f.id"
            v-model="bulk.includedKg"
            type="text"
            inputmode="decimal"
            :aria-describedby="f.describedBy"
            :aria-invalid="f.invalid"
          />
        </AdminField>
        <AdminField id="bulk-extra" v-slot="f" :label="text.extraPerKg" :error="bulkErrors.extra">
          <AdminMoneyInput
            :id="f.id"
            v-model="bulk.extra"
            :described-by="f.describedBy"
            :invalid="f.invalid"
          />
        </AdminField>
      </div>
      <button
        type="button"
        class="btn btn--dark tools__apply"
        :disabled="withoutRateCount === 0"
        @click="emit('applyBulk')"
      >
        <i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>
        {{ withoutRateCount ? text.bulkApply(withoutRateCount) : text.allRated }}
      </button>
    </AdminSection>
  </div>
</template>

<style scoped lang="scss">
.tools {
  @include flex(column, stretch, flex-start, 1.25rem);

  @include from('lg') {
    flex-direction: row;
    align-items: stretch;

    > * {
      flex: 1 1 0;
      min-width: 0;
    }
  }

  &__fields {
    @include flex-cards(7.5rem, 0.75rem);
  }

  &__result {
    @include flex(column, flex-start, flex-start, 0.2rem);
    padding: 0.85rem 1rem;
    border-left: 4px solid $success-text;
    border-radius: $radius-sm;
    background: $success-bg;
    font-size: $text-sm;

    span {
      color: $ink-soft;
    }

    &--no {
      border-left-color: $gold-deep;
      background: $gold-soft;
    }
  }

  &__apply {
    min-height: 3rem;
    margin-top: auto;
    text-align: center;
  }
}
</style>
