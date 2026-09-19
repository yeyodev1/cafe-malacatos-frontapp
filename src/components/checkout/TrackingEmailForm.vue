<script setup lang="ts">
import { checkoutCopy } from '@/config/copy.checkout'
import BaseCta from '@/components/ui/BaseCta.vue'

/**
 * El seguimiento solo se muestra a quien conoce el correo de la compra. Este
 * formulario aparece cuando el enlace llega sin correo, o cuando el número y el
 * correo no coinciden (el backend responde lo mismo en ambos casos, a propósito).
 */
defineProps<{ number: string; notFound: boolean; invalid: boolean; helpLink: string }>()
defineEmits<{ submit: [] }>()

const email = defineModel<string>({ required: true })
const text = checkoutCopy.tracking
</script>

<template>
  <form class="ask" novalidate @submit.prevent="$emit('submit')">
    <p v-if="notFound" class="ask__alert" role="alert">
      <strong>{{ text.notFoundTitle }}</strong>
      {{ text.notFoundText }}
    </p>

    <h2 class="ask__title">{{ text.askTitle }}</h2>
    <p class="ask__text">{{ text.askText }} {{ number }}.</p>

    <div>
      <label for="tracking-email">{{ text.emailLabel }}</label>
      <input
        id="tracking-email"
        v-model="email"
        class="ask__input"
        type="email"
        inputmode="email"
        autocomplete="email"
        required
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="invalid ? 'tracking-email-error' : undefined"
      />
      <p v-if="invalid" id="tracking-email-error" class="ask__error" role="alert">
        {{ checkoutCopy.errors.email }}
      </p>
    </div>

    <div class="ask__actions">
      <button class="btn btn--dark" type="submit">{{ text.submit }}</button>
      <BaseCta :href="helpLink" variant="outline" icon="fa-brands fa-whatsapp">
        {{ text.help }}
      </BaseCta>
    </div>
  </form>
</template>

<style scoped lang="scss">
.ask {
  @include card;
  @include flex(column, stretch, flex-start, 1rem);
  max-width: 34rem;
  padding: 1.5rem 1.1rem;
  border-radius: $radius-md;
  border-top: 3px solid $gold-deep;

  @include from('md') {
    padding: 2rem;
  }

  &__title {
    @include display($text-xl, 500);
  }

  &__text {
    font-size: $text-sm;
    line-height: 1.55;
    color: $ink-soft;
  }

  &__input {
    min-height: 3rem;
    font-size: 1rem;

    &[aria-invalid='true'] {
      border-color: $danger-text;
    }
  }

  &__error {
    margin-top: 0.35rem;
    font-size: $text-xs;
    font-weight: 500;
    color: $danger-text;
  }

  &__alert {
    padding: 0.85rem 1rem;
    border-radius: $radius-sm;
    background: $danger-bg;
    color: $danger-text;
    font-size: $text-sm;
    line-height: 1.5;

    strong {
      display: block;
    }
  }

  &__actions {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
  }
}
</style>
