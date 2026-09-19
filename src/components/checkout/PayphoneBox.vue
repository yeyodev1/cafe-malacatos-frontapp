<script setup lang="ts">
import { onMounted } from 'vue'
import { checkoutCopy } from '@/config/copy.checkout'
import {
  BOX_CONTAINER_ID,
  usePayphoneBox,
  type PayphoneBuyer,
} from '@/composables/checkout/usePayphoneBox'
import { formatCents } from '@/utils/money'
import type { Order, PayphoneBoxConfig } from '@/types'

/**
 * Marco propio de la Cajita de Pagos: encabezado, total, cuenta regresiva y los
 * estados de carga, error y vencimiento. El interior de #pp-button es de Payphone.
 * La vista le pone `:key` con el clientTransactionId: cada intento monta uno nuevo.
 */
const props = defineProps<{
  config: PayphoneBoxConfig
  buyer: PayphoneBuyer
  order: Order
  /** Se está creando la orden del intento nuevo. */
  busy: boolean
}>()

defineEmits<{ 'new-attempt': []; back: [] }>()

const text = checkoutCopy.payphone
const { status, countdown, isEnding, mount } = usePayphoneBox()

function start() {
  mount(props.config, props.buyer)
}

// En onMounted el contenedor ya existe en el DOM, que es lo que exige `render`.
onMounted(start)
</script>

<template>
  <section class="paybox" aria-labelledby="paybox-title">
    <header class="paybox__head">
      <p class="paybox__eyebrow">{{ text.eyebrow }}</p>
      <h2 id="paybox-title" class="paybox__title">{{ text.title }}</h2>
      <p class="paybox__meta">
        {{ text.order }} <strong>{{ order.number }}</strong> ·
        <strong>{{ formatCents(order.totalCents) }}</strong>
      </p>
    </header>

    <p
      v-if="status === 'loading' || status === 'ready'"
      class="paybox__timer"
      :class="{ 'paybox__timer--ending': isEnding }"
      role="timer"
    >
      <i class="fa-regular fa-clock" aria-hidden="true"></i>
      {{ text.timeLeft }}: <strong>{{ countdown }}</strong>
    </p>

    <p v-if="status === 'loading'" class="paybox__state" role="status">
      <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> {{ text.loading }}
    </p>

    <div v-else-if="status === 'expired'" class="paybox__state paybox__state--block" role="alert">
      <strong>{{ text.expiredTitle }}</strong>
      <p>{{ text.expiredText }}</p>
      <button class="btn btn--dark" type="button" :disabled="busy" @click="$emit('new-attempt')">
        <i v-if="busy" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
        {{ busy ? text.generating : text.newAttempt }}
      </button>
    </div>

    <div v-else-if="status === 'error'" class="paybox__state paybox__state--block" role="alert">
      <strong>{{ text.errorTitle }}</strong>
      <p>{{ text.errorText }}</p>
      <button class="btn btn--dark" type="button" @click="start">{{ text.retry }}</button>
    </div>

    <!-- Siempre en el DOM: Payphone lo busca por id al hacer render. -->
    <div
      :id="BOX_CONTAINER_ID"
      class="paybox__box"
      :class="{ 'paybox__box--hidden': status !== 'ready' }"
    ></div>

    <p class="paybox__secure">
      <i class="fa-solid fa-shield-halved" aria-hidden="true"></i> {{ text.secure }}
    </p>
    <button class="paybox__back" type="button" @click="$emit('back')">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ text.back }}
    </button>
  </section>
</template>

<style scoped lang="scss">
.paybox {
  @include card;
  @include flex(column, stretch, flex-start, 1rem);
  min-width: 0;
  padding: 1.5rem 1.1rem;
  border-radius: $radius-md;
  border-top: 3px solid $gold-deep;

  @include from('md') {
    padding: 2rem;
  }

  &__head {
    @include flex(column, flex-start, flex-start, 0.4rem);
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 500);
  }

  &__meta {
    font-size: $text-sm;
    color: $ink-soft;

    strong {
      color: $ink;
    }
  }

  &__timer {
    @include flex(row, center, flex-start, 0.5rem);
    align-self: flex-start;
    padding: 0.5rem 0.9rem;
    border-radius: $radius-pill;
    background: $sand;
    font-size: $text-sm;
    font-variant-numeric: tabular-nums;

    &--ending {
      background: $danger-bg;
      color: $danger-text;
    }
  }

  &__state {
    @include flex(row, center, flex-start, 0.6rem);
    font-size: $text-sm;
    color: $ink-soft;

    &--block {
      flex-direction: column;
      align-items: flex-start;
      padding: 1.1rem;
      border-radius: $radius-sm;
      background: $sand;
      color: $ink;
      line-height: 1.55;
    }
  }

  &__box {
    width: 100%;
    min-width: 0;

    // Oculto pero presente: Payphone necesita el nodo antes de pintar.
    &--hidden {
      height: 0;
      overflow: hidden;
      visibility: hidden;
    }
  }

  &__secure {
    @include flex(row, flex-start, flex-start, 0.5rem);
    font-size: $text-xs;
    line-height: 1.5;
    color: $ink-soft;

    i {
      margin-top: 0.15rem;
      color: $success-text;
    }
  }

  &__back {
    @include flex(row, center, flex-start, 0.5rem);
    @include focus-ring;
    align-self: flex-start;
    min-height: 2.75rem;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
