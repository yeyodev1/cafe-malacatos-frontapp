<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { useShippingZones } from '@/composables/admin/useShippingZones'
import { useUnsavedGuard } from '@/composables/admin/useUnsavedGuard'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminLoading from '@/components/admin/AdminLoading.vue'
import AdminSaveBar from '@/components/admin/AdminSaveBar.vue'
import AdminLeaveModal from '@/components/admin/AdminLeaveModal.vue'
import ShippingTools from '@/components/admin/ShippingTools.vue'
import ShippingZoneRow from '@/components/admin/ShippingZoneRow.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const text = adminCopy.shipping
const common = adminCopy.common
const zones = useShippingZones()
const { drafts, loading, loadError, saving, dirty, dirtyDrafts, failedIds, withoutRate } = zones
const guard = useUnsavedGuard(dirty)

const provinces = computed(() => drafts.value.map((draft) => draft.province))

onMounted(zones.load)
</script>

<template>
  <div class="shipping">
    <AdminPageHeader :title="text.title" :lead="text.lead" />

    <AdminLoading v-if="loading" :rows="6" />
    <StateBlock
      v-else-if="loadError"
      tone="error"
      icon="fa-solid fa-triangle-exclamation"
      :title="common.errorTitle"
      :text="loadError"
    >
      <button type="button" class="btn btn--dark" @click="zones.load()">{{ common.retry }}</button>
    </StateBlock>

    <template v-else>
      <div class="shipping__notice" role="note">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
        <div>
          <strong>{{ text.noRateTitle }}</strong>
          <p>{{ text.noRate }}</p>
          <p class="shipping__count">
            {{ withoutRate.length ? text.noRateCount(withoutRate.length) : text.allRated }}
          </p>
        </div>
      </div>

      <ShippingTools
        :bulk="zones.bulk"
        :bulk-errors="zones.bulkErrors.value"
        :without-rate-count="withoutRate.length"
        :example="zones.example"
        :provinces="provinces"
        :result="zones.exampleResult.value"
        @apply-bulk="zones.applyBulk"
      />

      <ul class="shipping__list">
        <ShippingZoneRow
          v-for="draft in drafts"
          :key="draft.id"
          :zone="draft"
          :dirty="zones.isDirty(draft)"
          :failed="failedIds.includes(draft.id)"
        />
      </ul>

      <AdminSaveBar
        :dirty="dirty"
        :saving="saving"
        :message="text.pending(dirtyDrafts.length)"
        @save="zones.saveAll"
        @discard="zones.discard"
      />
    </template>

    <AdminLeaveModal :open="guard.asking.value" @stay="guard.stay" @leave="guard.leave" />
  </div>
</template>

<style scoped lang="scss">
.shipping {
  @include flex(column, stretch, flex-start);

  &__notice {
    @include flex(row, flex-start, flex-start, 0.85rem);
    margin-bottom: 1.25rem;
    padding: 1rem;
    border: 1px solid $gold-deep;
    border-radius: $radius-md;
    background: $gold-soft;
    font-size: $text-sm;

    i {
      margin-top: 0.1rem;
      color: $whatsapp-deep;
      font-size: 1.4rem;
    }

    p {
      margin-top: 0.2rem;
      color: $ink-soft;
    }
  }

  &__count {
    font-weight: 700;
    color: $ink !important;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.6rem);
    margin-top: 1.5rem;
  }
}
</style>
