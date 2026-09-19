<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { adminCopy, paymentMethod } from '@/config/copy.admin'
import { formatDateTime } from '@/composables/admin/adminFormat'
import { useOrderDetail } from '@/composables/admin/useOrderDetail'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminStatusBadge from '@/components/admin/AdminStatusBadge.vue'
import AdminLoading from '@/components/admin/AdminLoading.vue'
import OrderSummaryCard from '@/components/admin/OrderSummaryCard.vue'
import OrderContactCard from '@/components/admin/OrderContactCard.vue'
import OrderBillingCard from '@/components/admin/OrderBillingCard.vue'
import OrderActionsCard from '@/components/admin/OrderActionsCard.vue'
import OrderNoteCard from '@/components/admin/OrderNoteCard.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const text = adminCopy.order
const common = adminCopy.common
const route = useRoute()
const id = computed(() => String(route.params.id))

const detail = useOrderDetail(id)
const { order, loading, error, load, busy, noteDraft, noteDirty } = detail

const dates = computed(() => {
  const o = order.value
  if (!o) return []
  return [
    { label: text.placedOn, value: formatDateTime(o.createdAt) },
    { label: text.paidOn, value: formatDateTime(o.paidAt) },
    { label: text.shippedOn, value: formatDateTime(o.shippedAt) },
  ].filter((entry) => entry.value)
})
</script>

<template>
  <div class="order-view">
    <AdminPageHeader
      :title="order ? `${text.titlePrefix} ${order.number}` : text.titlePrefix"
      back-to="/admin/ordenes"
      :back-label="text.back"
    />

    <AdminLoading v-if="loading" />
    <StateBlock
      v-else-if="error || !order"
      tone="error"
      icon="fa-solid fa-triangle-exclamation"
      :title="text.notFoundTitle"
      :text="error"
    >
      <button type="button" class="btn btn--dark" @click="load()">{{ common.retry }}</button>
    </StateBlock>

    <template v-else>
      <div class="order-view__meta">
        <AdminStatusBadge :status="order.status" large />
        <span class="order-view__pay">
          <i :class="paymentMethod[order.paymentMethod]?.icon" aria-hidden="true"></i>
          {{ paymentMethod[order.paymentMethod]?.label }}
        </span>
        <span v-for="entry in dates" :key="entry.label" class="order-view__date">
          {{ entry.label }} {{ entry.value }}
        </span>
      </div>

      <div class="order-view__columns">
        <div class="order-view__col order-view__col--main">
          <OrderActionsCard
            :order="order"
            :busy="busy"
            @approve="detail.approve"
            @ship="detail.ship"
            @deliver="detail.deliver"
            @cancel="detail.cancel"
          />
          <OrderSummaryCard :order="order" />
        </div>
        <div class="order-view__col">
          <OrderBillingCard
            :order="order"
            :busy="busy === 'invoice'"
            @invoice="detail.setInvoice"
          />
          <OrderContactCard :order="order" />
          <OrderNoteCard
            v-model="noteDraft"
            :dirty="noteDirty"
            :saving="busy === 'note'"
            @save="detail.saveNote"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.order-view {
  @include flex(column, stretch, flex-start);

  &__meta {
    @include flex(row, center, flex-start, 0.5rem 1rem);
    flex-wrap: wrap;
    margin: -0.5rem 0 1.5rem;
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__pay {
    font-weight: 600;

    i {
      margin-right: 0.3rem;
      color: $ink-muted;
    }
  }

  &__columns {
    @include flex(column, stretch, flex-start, 1.25rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__col {
    @include flex(column, stretch, flex-start, 1.25rem);
    flex: 1 1 0;
    min-width: 0;

    &--main {
      @include from('lg') {
        flex-grow: 1.25;
      }
    }
  }
}
</style>
