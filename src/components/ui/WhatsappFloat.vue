<script setup lang="ts">
import { computed } from 'vue'
import { copy } from '@/config/copy'
import { useWhatsappOrder } from '@/composables/useWhatsappOrder'

// Con productos en el carrito abre el pedido ya armado; sin carrito, un saludo.
const { smartLink, hasOrder } = useWhatsappOrder()
const label = computed(() =>
  hasOrder.value ? copy.whatsappOrder.floatOrderLabel : copy.whatsappOrder.floatLabel,
)
</script>

<template>
  <a class="wa-float" :href="smartLink" target="_blank" rel="noopener" :aria-label="label">
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
    <span class="wa-float__label">{{ label }}</span>
  </a>
</template>

<style scoped lang="scss">
.wa-float {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 80;
  @include flex(row, center, center);
  @include transition(transform);
  @include focus-ring($ink);
  width: 3.5rem;
  height: 3.5rem;
  border-radius: $radius-pill;
  // Verde oscurecido: el icono blanco necesita contraste 3:1 sobre el fondo.
  background: darken($success, 14%);
  color: $surface;
  font-size: 1.75rem;
  box-shadow: $shadow-md;

  @include from('md') {
    right: 1.75rem;
    bottom: 1.75rem;
  }

  &:hover {
    transform: translateY(-3px) scale(1.04);
  }

  // La etiqueta aparece al pasar el mouse en escritorio; en móvil basta el icono.
  &__label {
    position: absolute;
    right: calc(100% + 0.6rem);
    padding: 0.5rem 0.9rem;
    border-radius: $radius-pill;
    background: $ink;
    color: $paper;
    font-size: $text-xs;
    font-weight: 600;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(6px);
    pointer-events: none;
    @include transition;
  }

  @media (hover: hover) {
    &:hover &__label,
    &:focus-visible &__label {
      opacity: 1;
      transform: translateX(0);
    }
  }
}
</style>
