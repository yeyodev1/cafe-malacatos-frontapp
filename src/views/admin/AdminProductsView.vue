<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminCopy } from '@/config/copy.admin'
import { site } from '@/config/site'
import { cldUrl } from '@/utils/image'
import { isSellable, priceRange, useProductsList } from '@/composables/admin/useProductsList'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminLoading from '@/components/admin/AdminLoading.vue'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'
import StateBlock from '@/components/ui/StateBlock.vue'
import type { Product } from '@/types'

const text = adminCopy.products
const common = adminCopy.common
const router = useRouter()
const { list, togglingId, setPublished } = useProductsList()
const { data, loading, error, load } = list

const editPath = (product: Product) => `/admin/productos/${product.id}`
const sellable = (product: Product) => product.variants.some(isSellable)

onMounted(() => load())
</script>

<template>
  <div class="products">
    <AdminPageHeader :title="text.title" :lead="text.lead">
      <RouterLink to="/admin/productos/nuevo" class="btn btn--primary">
        <i class="fa-solid fa-plus" aria-hidden="true"></i>{{ text.add }}
      </RouterLink>
    </AdminPageHeader>

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
      v-else-if="!data?.length"
      icon="fa-solid fa-bag-shopping"
      :title="text.emptyTitle"
      :text="text.emptyText"
    >
      <RouterLink to="/admin/productos/nuevo" class="btn btn--dark">{{ text.add }}</RouterLink>
    </StateBlock>

    <table v-else class="products__table">
      <caption class="visually-hidden">
        {{
          text.title
        }}
      </caption>
      <thead>
        <tr>
          <th scope="col">{{ text.columns.product }}</th>
          <th scope="col">{{ text.columns.category }}</th>
          <th scope="col">{{ text.columns.prices }}</th>
          <th scope="col">{{ text.columns.state }}</th>
          <th scope="col">
            <span class="visually-hidden">{{ text.edit }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in data" :key="product.id" class="products__row">
          <td class="products__cell" @click="router.push(editPath(product))">
            <div class="products__main">
              <img
                v-if="product.images[0]"
                :src="cldUrl(product.images[0].url, 160)"
                alt=""
                class="products__cover"
                width="64"
                height="64"
                loading="lazy"
              />
              <span v-else class="products__cover products__cover--empty">
                <i class="fa-solid fa-image" aria-hidden="true"></i>
                <span>{{ text.noPhoto }}</span>
              </span>
              <RouterLink :to="editPath(product)" class="products__name" @click.stop>
                {{ product.name }}
              </RouterLink>
            </div>
          </td>
          <td class="products__category">
            {{ site.categories[product.category] || product.category }}
          </td>
          <td class="products__prices">
            <span v-if="priceRange(product)">{{ priceRange(product) }}</span>
            <span v-else class="products__muted">{{ text.noVariants }}</span>
            <span v-if="!sellable(product)" class="products__warn">
              <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i
              >{{ text.notSellable }}
            </span>
          </td>
          <td class="products__state">
            <AdminSwitch
              :model-value="product.isPublished"
              :label="text.toggleLabel(product.name)"
              :on-text="text.published"
              :off-text="text.draft"
              :busy="togglingId === product.id"
              hide-label
              @update:model-value="setPublished(product, $event)"
            />
          </td>
          <td class="products__edit">
            <RouterLink :to="editPath(product)" class="products__edit-link">
              <i class="fa-solid fa-pen" aria-hidden="true"></i>{{ text.edit }}
              <span class="visually-hidden">{{ product.name }}</span>
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.products {
  @include flex(column, stretch, flex-start);

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
      @include from('lg') {
        padding: 0.8rem 0.9rem;
        border-bottom: 1px solid $line;
        vertical-align: middle;
      }
    }
  }

  // Móvil: cada producto es una tarjeta; portada y nombre arriba, interruptor abajo.
  &__row {
    @include until('lg') {
      @include card;
      @include flex(row, center, space-between, 0.5rem 0.75rem);
      flex-wrap: wrap;
      padding: 0.9rem 1rem;
    }
  }

  &__cell {
    cursor: pointer;

    @include until('lg') {
      flex: 1 1 100%;
    }
  }

  // El flex va en un div interior: un <td> con display flex deja de alinear su borde con la fila.
  &__main {
    @include flex(row, center, flex-start, 0.85rem);
  }

  &__cover {
    flex: 0 0 4rem;
    width: 4rem;
    height: 4rem;
    border-radius: $radius-sm;
    background: $sand;
    object-fit: cover;

    &--empty {
      @include flex(column, center, center, 0.15rem);
      color: $ink-muted;
      font-size: 0.6rem;
      font-weight: 600;

      i {
        font-size: 1rem;
      }
    }
  }

  &__name {
    @include focus-ring;
    font-size: $text-base;
    font-weight: 700;

    &:hover {
      color: $accent;
    }
  }

  &__category,
  &__muted {
    color: $ink-soft;
  }

  &__category {
    @include until('lg') {
      flex: 1 1 40%;
    }
  }

  &__prices {
    font-weight: 600;
    font-variant-numeric: tabular-nums;

    @include until('lg') {
      margin-left: auto;
      text-align: right;
    }
  }

  &__warn {
    @include flex(row, center, flex-start, 0.35rem);
    color: $danger-text;
    font-size: $text-xs;
    font-weight: 600;
  }

  &__edit-link {
    @include flex(row, center, center, 0.45rem);
    @include focus-ring;
    display: inline-flex;
    min-height: 2.75rem;
    padding: 0.4rem 1rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    font-weight: 600;

    &:hover {
      background: $sand;
    }
  }
}
</style>
