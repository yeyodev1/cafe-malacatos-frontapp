<script setup lang="ts">
import { computed } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { zoneErrors, type ZoneDraft } from '@/composables/admin/useShippingZones'
import AdminField from './AdminField.vue'
import AdminMoneyInput from './AdminMoneyInput.vue'
import AdminSwitch from './AdminSwitch.vue'

// `zone` es el borrador reactivo de la provincia: los campos escriben directo en él.
const text = adminCopy.shipping
const props = defineProps<{ zone: ZoneDraft; dirty: boolean; failed: boolean }>()

const errors = computed(() => zoneErrors(props.zone))
const noRate = computed(() => !props.zone.base.trim())
</script>

<template>
  <li
    class="zone"
    :class="{ 'zone--dirty': dirty, 'zone--failed': failed, 'zone--off': !zone.isActive }"
  >
    <div class="zone__head">
      <h3 class="zone__name">{{ zone.province }}</h3>
      <span v-if="!zone.isActive" class="zone__chip zone__chip--off">
        <i class="fa-solid fa-ban" aria-hidden="true"></i>{{ text.inactiveNote }}
      </span>
      <span v-else-if="noRate" class="zone__chip zone__chip--wa">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>{{ text.whatsappOnly }}
      </span>
      <span v-if="dirty" class="zone__chip zone__chip--dirty">
        <i class="fa-solid fa-pen" aria-hidden="true"></i>{{ text.unsaved }}
      </span>
    </div>

    <div class="zone__fields">
      <AdminField
        :id="`zone-${zone.id}-base`"
        v-slot="f"
        :label="text.base"
        :hint="text.baseHint"
        :error="errors.base"
      >
        <AdminMoneyInput
          :id="f.id"
          v-model="zone.base"
          :placeholder="text.basePlaceholder"
          :described-by="f.describedBy"
          :invalid="f.invalid"
        />
      </AdminField>
      <AdminField
        :id="`zone-${zone.id}-kg`"
        v-slot="f"
        :label="text.includedKg"
        :error="errors.includedKg"
      >
        <input
          :id="f.id"
          v-model="zone.includedKg"
          type="text"
          inputmode="decimal"
          :aria-describedby="f.describedBy"
          :aria-invalid="f.invalid"
        />
      </AdminField>
      <AdminField
        :id="`zone-${zone.id}-extra`"
        v-slot="f"
        :label="text.extraPerKg"
        :error="errors.extra"
      >
        <AdminMoneyInput
          :id="f.id"
          v-model="zone.extra"
          :described-by="f.describedBy"
          :invalid="f.invalid"
        />
      </AdminField>
    </div>

    <AdminSwitch
      v-model="zone.isActive"
      class="zone__switch"
      :label="text.activeLabel(zone.province)"
      :on-text="adminCopy.common.active"
      :off-text="adminCopy.common.inactive"
      hide-label
    />
  </li>
</template>

<style scoped lang="scss">
.zone {
  @include card;
  @include flex(column, stretch, flex-start, 0.75rem);
  padding: 1rem;
  border-left: 4px solid $line;
  list-style: none;

  @include from('lg') {
    flex-direction: row;
    align-items: flex-start;
    gap: 1.25rem;
    padding: 0.9rem 1.25rem;
  }

  &--dirty {
    border-left-color: $gold-deep;
    background: rgba($gold-soft, 0.25);
  }

  &--failed {
    border-left-color: $danger;
  }

  &--off .zone__fields {
    opacity: 0.55;
  }

  &__head {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;

    @include from('lg') {
      flex: 0 0 13rem;
      flex-direction: column;
      align-items: flex-start;
      padding-top: 1.7rem;
    }
  }

  &__name {
    font-family: $font-principal;
    font-size: $text-base;
    font-weight: 700;
  }

  &__chip {
    @include flex(row, center, center, 0.35rem);
    padding: 0.15rem 0.6rem;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 700;

    &--wa {
      background: $sand;
      color: $ink-soft;
    }

    &--off {
      background: $danger-bg;
      color: $danger-text;
    }

    &--dirty {
      background: $gold-soft;
      color: darken($gold-deep, 24%);
    }
  }

  &__fields {
    @include flex-cards(7rem, 0.75rem);
    flex: 1;
  }

  &__switch {
    @include from('lg') {
      flex: 0 0 auto;
      margin-top: 1.55rem;
    }
  }
}
</style>
