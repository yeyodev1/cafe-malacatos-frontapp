<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

/**
 * Llamado a la acción en forma de píldora. Con `to` navega por el router; con
 * `href` es un enlace externo (WhatsApp) y abre en otra pestaña.
 * `gold` y `light` son para fondos oscuros; `dark` y `outline`, para claros.
 */
const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    variant?: 'gold' | 'light' | 'dark' | 'outline'
    icon?: string
    iconRight?: string
    block?: boolean
  }>(),
  { variant: 'dark' },
)

const tag = computed(() => (props.to ? RouterLink : 'a'))
const attrs = computed(() =>
  props.to ? { to: props.to } : { href: props.href, target: '_blank', rel: 'noopener' },
)
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="cta"
    :class="[`cta--${variant}`, { 'cta--block': block }]"
  >
    <i v-if="icon" :class="icon" aria-hidden="true"></i>
    <span><slot /></span>
    <i v-if="iconRight" :class="iconRight" aria-hidden="true"></i>
  </component>
</template>

<style scoped lang="scss">
.cta {
  @include flex(row, center, center, 0.6rem);
  @include transition;
  display: inline-flex;
  min-height: 3rem;
  padding: 0.8rem 1.7rem;
  border: 1px solid transparent;
  border-radius: $radius-pill;
  font-size: $text-sm;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.2;
  text-align: center;

  &--block {
    display: flex;
    width: 100%;
  }

  &--gold {
    @include focus-ring($gold);
    background: $gold;
    color: $roast;

    &:hover {
      background: $gold-soft;
      transform: translateY(-2px);
    }
  }

  &--light {
    @include focus-ring($gold);
    border-color: rgba($paper, 0.4);
    color: $paper;

    &:hover {
      border-color: $gold;
      color: $gold;
    }
  }

  &--dark {
    @include focus-ring;
    background: $ink;
    color: $paper;

    &:hover {
      background: $accent-deep;
      transform: translateY(-2px);
    }
  }

  &--outline {
    @include focus-ring;
    border-color: $ink;
    color: $ink;

    &:hover {
      background: $ink;
      color: $paper;
    }
  }
}
</style>
