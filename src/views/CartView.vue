<script setup lang="ts">
import { site } from '@/config/site'
import { copy } from '@/config/copy'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { useSeo } from '@/composables/useSeo'
import { useWhatsappOrder } from '@/composables/useWhatsappOrder'
import { formatCents, formatWeight } from '@/utils/money'
import BaseCta from '@/components/ui/BaseCta.vue'
import StateBlock from '@/components/ui/StateBlock.vue'
import CartLineItem from '@/components/shop/CartLineItem.vue'
import { lineKey } from '@/stores/cart'
import type { CartLine } from '@/types'

const cart = useCartStore()
const toast = useToastStore()
const { orderLink } = useWhatsappOrder()
const text = copy.cart

function remove(line: CartLine) {
  cart.remove(line.productId, line.variantId)
  toast.info(text.removed)
}

useSeo(() => ({ title: text.title, path: '/carrito', noindex: true }))
</script>

<template>
  <section class="cart">
    <header class="cart__head">
      <p class="cart__eyebrow">{{ text.eyebrow }}</p>
      <h1 class="cart__title">{{ text.title }}</h1>
    </header>

    <StateBlock
      v-if="cart.isEmpty"
      icon="fa-solid fa-bag-shopping"
      :title="text.emptyTitle"
      :text="text.emptyText"
    >
      <BaseCta to="/tienda" variant="dark" icon-right="fa-solid fa-arrow-right">
        {{ copy.common.goToShop }}
      </BaseCta>
    </StateBlock>

    <div v-else class="cart__layout">
      <div class="cart__lines">
        <ul class="cart__list">
          <CartLineItem
            v-for="line in cart.lines"
            :key="lineKey(line)"
            :line="line"
            @update:qty="cart.setQty(line.productId, line.variantId, $event)"
            @remove="remove(line)"
          />
        </ul>
        <div class="cart__below">
          <RouterLink to="/tienda" class="cart__text-link">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ text.keepShopping }}
          </RouterLink>
          <button class="cart__text-link" type="button" @click="cart.clear()">
            {{ text.clear }}
          </button>
        </div>
      </div>

      <aside class="cart__summary" :aria-label="text.summaryTitle">
        <h2 class="cart__summary-title">{{ text.summaryTitle }}</h2>
        <dl class="cart__totals">
          <div class="cart__row">
            <dt>{{ text.weight }}</dt>
            <dd>{{ formatWeight(cart.totalWeightGrams) }}</dd>
          </div>
          <div class="cart__row">
            <dt>{{ text.shipping }}</dt>
            <dd>{{ text.shippingPending }}</dd>
          </div>
          <div class="cart__row cart__row--total">
            <dt>{{ text.subtotal }}</dt>
            <dd aria-live="polite">{{ formatCents(cart.subtotalCents) }}</dd>
          </div>
        </dl>
        <p class="cart__note">{{ site.checkout.shippingNote }}</p>

        <BaseCta to="/checkout" variant="dark" icon-right="fa-solid fa-arrow-right" block>
          {{ text.checkout }}
        </BaseCta>
        <p class="cart__or">{{ text.or }}</p>
        <BaseCta :href="orderLink" variant="outline" icon="fa-brands fa-whatsapp" block>
          {{ site.checkout.whatsappCta }}
        </BaseCta>
      </aside>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cart {
  @include container;
  padding-block: $space-lg $space-section;

  &__head {
    @include flex(column, flex-start, flex-start, 0.6rem);
    margin-bottom: $space-md;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-lg);
  }

  &__layout {
    @include flex(column, stretch, flex-start, 2rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 3.5rem;
    }
  }

  &__lines {
    flex: 1 1 60%;
    min-width: 0;
  }

  &__list {
    list-style: none;
    border-top: 1px solid $line;
  }

  &__below {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }

  &__text-link {
    @include flex(row, center, center, 0.5rem);
    @include transition(color);
    @include focus-ring;
    min-height: 2.75rem;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;

    &:hover {
      color: $accent;
    }
  }

  &__summary {
    @include card;
    @include flex(column, stretch, flex-start, 1rem);
    flex: 1 1 34%;
    padding: 1.5rem 1.25rem;
    border-radius: $radius-md;
    background: $sand;

    @include from('md') {
      padding: 2rem;
    }

    @include from('lg') {
      position: sticky;
      top: 5.5rem;
    }
  }

  &__summary-title {
    @include display($text-xl, 500);
  }

  &__totals {
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__row {
    @include flex(row, baseline, space-between, 1rem);
    font-size: $text-sm;
    color: $ink-soft;

    dd {
      text-align: right;
    }

    &--total {
      margin-top: 0.4rem;
      padding-top: 0.9rem;
      border-top: 1px solid $line;
      font-size: $text-lg;
      font-weight: 600;
      color: $ink;
    }
  }

  &__note {
    font-size: $text-xs;
    color: $ink-soft;
  }

  &__or {
    @include eyebrow;
    text-align: center;
    color: $ink-soft;
  }
}
</style>
