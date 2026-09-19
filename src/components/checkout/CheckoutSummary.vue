<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import { checkoutCopy } from '@/config/copy.checkout'
import { formatCents } from '@/utils/money'
import { cldUrl } from '@/utils/image'
import type { QuoteStatus } from '@/composables/checkout/useShippingQuote'

export interface SummaryItem {
  key: string
  name: string
  variantLabel: string
  qty: number
  lineTotalCents: number
  image: string
}

/**
 * Resumen del pedido. El cliente pidió que quede claro que se paga producto MÁS
 * envío: subtotal, envío y total van siempre los tres, aunque el envío aún no
 * tenga valor. Sirve con el carrito (cotizando) y con una orden ya creada.
 */
const props = defineProps<{
  items: SummaryItem[]
  subtotalCents: number
  shippingCents: number | null
  quoteStatus: QuoteStatus
  province?: string
  /** En el formulario se puede volver al carrito; con la orden creada ya no. */
  editable?: boolean
}>()

defineEmits<{ retry: [] }>()
const text = checkoutCopy.summary

const hasShipping = computed(
  () => props.quoteStatus === 'available' && props.shippingCents !== null,
)
const totalCents = computed(
  () => props.subtotalCents + (hasShipping.value ? props.shippingCents! : 0),
)

const shippingLabel = computed(() => {
  if (hasShipping.value) return formatCents(props.shippingCents!)
  if (props.quoteStatus === 'loading') return text.calculating
  if (props.quoteStatus === 'unavailable') return text.byWhatsapp
  if (props.quoteStatus === 'error') return text.quoteError
  return text.chooseProvince
})
</script>

<template>
  <aside class="summary" :aria-label="text.title">
    <header class="summary__head">
      <h2 class="summary__title">{{ text.title }}</h2>
      <RouterLink v-if="editable" to="/carrito" class="summary__edit">{{ text.edit }}</RouterLink>
    </header>

    <ul class="summary__items">
      <li v-for="item in items" :key="item.key" class="summary__item">
        <span class="summary__thumb">
          <img
            v-if="item.image"
            :src="cldUrl(item.image, 128)"
            alt=""
            width="56"
            height="56"
            loading="lazy"
          />
          <i v-else class="fa-solid fa-mug-hot" aria-hidden="true"></i>
        </span>
        <span class="summary__item-info">
          <strong>{{ item.name }}</strong>
          <span>{{ item.variantLabel }} · {{ text.qty }}: {{ item.qty }}</span>
        </span>
        <span class="summary__item-price">{{ formatCents(item.lineTotalCents) }}</span>
      </li>
    </ul>

    <dl class="summary__totals" aria-live="polite">
      <div class="summary__row">
        <dt>{{ text.subtotal }}</dt>
        <dd>{{ formatCents(subtotalCents) }}</dd>
      </div>
      <div class="summary__row">
        <dt>{{ province ? `${text.shippingTo} ${province}` : text.shipping }}</dt>
        <dd :class="{ summary__pending: !hasShipping }">
          <i
            v-if="quoteStatus === 'loading'"
            class="fa-solid fa-spinner fa-spin"
            aria-hidden="true"
          ></i>
          {{ shippingLabel }}
        </dd>
      </div>
      <div class="summary__row summary__row--total">
        <dt>{{ hasShipping ? text.total : text.totalPartial }}</dt>
        <dd>{{ formatCents(totalCents) }}</dd>
      </div>
    </dl>

    <p v-if="quoteStatus === 'error'" class="summary__error" role="alert">
      {{ text.quoteErrorText }}
      <button type="button" class="summary__retry" @click="$emit('retry')">
        {{ text.retryQuote }}
      </button>
    </p>
    <p class="summary__note">
      {{ quoteStatus === 'unavailable' ? site.checkout.noRateNote : site.checkout.shippingNote }}
    </p>
  </aside>
</template>

<style scoped lang="scss">
.summary {
  @include card;
  @include flex(column, stretch, flex-start, 1.1rem);
  padding: 1.5rem 1.1rem;
  border-radius: $radius-md;
  background: $sand;

  @include from('md') {
    padding: 2rem;
  }

  &__head {
    @include flex(row, baseline, space-between, 1rem);
  }

  &__title {
    @include display($text-xl, 500);
  }

  &__edit {
    flex: 0 0 auto;
    white-space: nowrap;
  }

  &__edit,
  &__retry {
    @include focus-ring;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &__items {
    @include flex(column, stretch, flex-start, 0.9rem);
    list-style: none;
    padding-bottom: 1.1rem;
    border-bottom: 1px solid $line;
  }

  &__item {
    @include flex(row, center, flex-start, 0.8rem);
    font-size: $text-sm;
  }

  &__thumb {
    @include flex(row, center, center);
    flex: 0 0 3.5rem;
    height: 3.5rem;
    overflow: hidden;
    border-radius: $radius-sm;
    background: $surface;
    color: $accent;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__item-info {
    @include flex(column, flex-start, flex-start, 0.15rem);
    flex: 1 1 auto;
    min-width: 0;
    color: $ink-soft;
    font-size: $text-xs;

    strong {
      font-size: $text-sm;
      font-weight: 600;
      color: $ink;
    }
  }

  &__item-price {
    flex: 0 0 auto;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  &__totals {
    @include flex(column, stretch, flex-start, 0.65rem);
  }

  &__row {
    @include flex(row, baseline, space-between, 1rem);
    font-size: $text-sm;
    color: $ink-soft;

    dd {
      flex: 0 0 auto;
      max-width: 55%;
      text-align: right;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      color: $ink;

      // El envío sin valor todavía no es un monto: se pinta como texto, no como precio.
      &.summary__pending {
        font-weight: 500;
        color: $ink-soft;
      }
    }

    &--total {
      margin-top: 0.3rem;
      padding-top: 0.9rem;
      border-top: 1px solid $line;
      font-size: $text-lg;
      font-weight: 600;
      color: $ink;
    }
  }

  &__error {
    font-size: $text-sm;
    color: $danger-text;
  }

  &__note {
    font-size: $text-xs;
    line-height: 1.5;
    color: $ink-soft;
  }
}
</style>
