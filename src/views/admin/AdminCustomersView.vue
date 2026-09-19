<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminCopy } from '@/config/copy.admin'
import { adminService, type AdminCustomerRow } from '@/services/admin.service'
import { formatDate } from '@/utils/format'
import { useAsyncData } from '@/composables/admin/useAsyncData'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminLoading from '@/components/admin/AdminLoading.vue'
import StateBlock from '@/components/ui/StateBlock.vue'
import type { Paginated } from '@/types'

const text = adminCopy.customers
const common = adminCopy.common
const route = useRoute()
const router = useRouter()

// La página vive en la URL para que "atrás" devuelva a donde se estaba.
const page = computed(() => Math.max(1, parseInt(String(route.query.page || '1'), 10) || 1))
const { data, loading, error, load } = useAsyncData<Paginated<AdminCustomerRow>>(() =>
  adminService.customers(page.value),
)

function setPage(value: number) {
  router.push({ query: value > 1 ? { page: String(value) } : {} })
}

watch(page, () => load(), { immediate: true })
</script>

<template>
  <div class="customers">
    <AdminPageHeader :title="text.title" :lead="text.lead" />

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
      icon="fa-solid fa-user-group"
      :title="text.emptyTitle"
      :text="text.emptyText"
    />

    <template v-else>
      <p class="customers__count" aria-live="polite">{{ text.count(data.total) }}</p>
      <table class="customers__table">
        <caption class="visually-hidden">
          {{
            text.title
          }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.columns.name }}</th>
            <th scope="col">{{ text.columns.email }}</th>
            <th scope="col">{{ text.columns.phone }}</th>
            <th scope="col" class="customers__num">{{ text.columns.orders }}</th>
            <th scope="col">{{ text.columns.since }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in data.items" :key="customer.id" class="customers__row">
            <td class="customers__name">
              {{ customer.name || common.empty }}
              <span v-if="customer.isActive === false" class="customers__off">{{
                text.inactive
              }}</span>
            </td>
            <td :data-label="text.columns.email">
              <a :href="`mailto:${customer.email}`" class="customers__link">{{ customer.email }}</a>
            </td>
            <td :data-label="text.columns.phone">
              <a v-if="customer.phone" :href="`tel:${customer.phone}`" class="customers__link">
                {{ customer.phone }}
              </a>
              <span v-else class="customers__muted">{{ common.empty }}</span>
            </td>
            <td :data-label="text.columns.orders" class="customers__num">
              {{ customer.ordersCount }}
            </td>
            <td :data-label="text.columns.since">{{ formatDate(customer.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
      <AdminPagination :page="data.page" :pages="data.pages" @change="setPage" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.customers {
  @include flex(column, stretch, flex-start);

  &__count {
    margin-bottom: 1rem;
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: $text-sm;

    thead {
      @include until('lg') {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
      }
    }

    tbody {
      @include until('lg') {
        @include flex(column, stretch, flex-start, 0.75rem);
      }
    }

    th {
      padding: 0.7rem 0.9rem;
      border-bottom: 1px solid $line;
      color: $ink-muted;
      font-size: $text-xs;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-align: left;
      text-transform: uppercase;
    }

    td {
      overflow-wrap: anywhere;

      @include from('lg') {
        padding: 0.9rem;
        border-bottom: 1px solid $line;
      }

      // Móvil: cada dato lleva su etiqueta delante, porque la cabecera no se ve.
      @include until('lg') {
        @include flex(row, baseline, space-between, 1rem);

        &[data-label]::before {
          content: attr(data-label);
          flex: 0 0 auto;
          color: $ink-muted;
          font-size: $text-xs;
          font-weight: 600;
        }
      }
    }
  }

  &__row {
    @include until('lg') {
      @include card;
      @include flex(column, stretch, flex-start, 0.4rem);
      padding: 0.95rem 1rem;
    }
  }

  &__name {
    font-size: $text-base;
    font-weight: 700;
  }

  &__num {
    font-variant-numeric: tabular-nums;

    @include from('lg') {
      text-align: right !important;
    }
  }

  &__link {
    @include focus-ring;
    color: $accent-deep;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &__muted {
    color: $ink-muted;
  }

  &__off {
    margin-left: 0.5rem;
    padding: 0.15rem 0.55rem;
    border-radius: $radius-pill;
    background: $danger-bg;
    color: $danger-text;
    font-size: $text-xs;
    font-weight: 600;
  }
}
</style>
