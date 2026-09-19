<script setup lang="ts">
import { adminCopy, orderStatus, orderStatusOrder } from '@/config/copy.admin'
import { useOrdersList } from '@/composables/admin/useOrdersList'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminOrdersTable from '@/components/admin/AdminOrdersTable.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminLoading from '@/components/admin/AdminLoading.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const text = adminCopy.orders
const common = adminCopy.common
const { status, list, setStatus, setPage } = useOrdersList()
const { data, loading, error, load } = list
</script>

<template>
  <div class="orders-view">
    <AdminPageHeader :title="text.title" :lead="text.lead" />

    <div class="orders-view__filters" role="group" :aria-label="text.filterLabel">
      <button
        type="button"
        class="orders-view__chip"
        :class="{ 'orders-view__chip--on': status === '' }"
        :aria-pressed="status === ''"
        @click="setStatus('')"
      >
        {{ text.filterAll }}
      </button>
      <button
        v-for="key in orderStatusOrder"
        :key="key"
        type="button"
        class="orders-view__chip"
        :class="{ 'orders-view__chip--on': status === key }"
        :aria-pressed="status === key"
        @click="setStatus(key)"
      >
        <i :class="orderStatus[key].icon" aria-hidden="true"></i>{{ orderStatus[key].label }}
      </button>
    </div>

    <p v-if="status" class="orders-view__hint">{{ orderStatus[status].hint }}</p>

    <AdminLoading v-if="loading" />
    <StateBlock
      v-else-if="error"
      tone="error"
      icon="fa-solid fa-triangle-exclamation"
      :title="common.errorTitle"
      :text="error"
    >
      <button type="button" class="btn btn--dark" @click="load()">{{ common.retry }}</button>
    </StateBlock>
    <StateBlock
      v-else-if="!data?.items.length"
      icon="fa-solid fa-receipt"
      :title="status ? text.emptyFilteredTitle : text.emptyTitle"
      :text="status ? text.emptyFilteredText : text.emptyText"
    >
      <button v-if="status" type="button" class="btn btn--dark" @click="setStatus('')">
        {{ text.clearFilter }}
      </button>
    </StateBlock>
    <template v-else>
      <p class="orders-view__count" aria-live="polite">{{ text.count(data.total) }}</p>
      <AdminOrdersTable :orders="data.items" :caption="text.title" />
      <AdminPagination :page="data.page" :pages="data.pages" @change="setPage" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.orders-view {
  @include flex(column, stretch, flex-start, 1rem);

  // En el celular los filtros se deslizan de lado en vez de apilarse en cuatro filas.
  &__filters {
    @include flex(row, center, flex-start, 0.5rem);
    margin-inline: -1rem;
    padding: 0.25rem 1rem;
    overflow-x: auto;
    scrollbar-width: none;

    @include from('md') {
      flex-wrap: wrap;
      margin-inline: 0;
      padding-inline: 0;
      overflow: visible;
    }
  }

  &__chip {
    @include flex(row, center, center, 0.45rem);
    @include transition(background-color);
    flex: 0 0 auto;
    min-height: 2.75rem;
    padding: 0.5rem 1rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    background: $surface;
    color: $ink-soft;
    font-size: $text-sm;
    font-weight: 600;
    white-space: nowrap;

    &:hover {
      background: $sand;
    }

    &--on,
    &--on:hover {
      border-color: $ink;
      background: $ink;
      color: $paper;
    }
  }

  &__hint,
  &__count {
    color: $ink-soft;
    font-size: $text-sm;
  }
}
</style>
