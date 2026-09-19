<script setup lang="ts">
import { computed } from 'vue'
import { checkoutCopy } from '@/config/copy.checkout'
import type { OrderStatus } from '@/types'

/**
 * Estado de una orden como etiqueta. Reutilizable en el seguimiento, en "mis
 * pedidos" y en el panel: el color acompaña, pero el texto y el icono dicen lo mismo.
 */
const props = defineProps<{ status: OrderStatus }>()

const TONES: Record<OrderStatus, { tone: string; icon: string }> = {
  pending: { tone: 'warning', icon: 'fa-regular fa-clock' },
  awaiting_verification: { tone: 'info', icon: 'fa-solid fa-magnifying-glass' },
  paid: { tone: 'success', icon: 'fa-solid fa-circle-check' },
  shipped: { tone: 'info', icon: 'fa-solid fa-truck-fast' },
  delivered: { tone: 'success', icon: 'fa-solid fa-box-open' },
  cancelled: { tone: 'danger', icon: 'fa-solid fa-ban' },
}

const meta = computed(() => TONES[props.status] ?? TONES.pending)
const label = computed(() => checkoutCopy.status[props.status]?.label ?? props.status)
</script>

<template>
  <span class="status" :class="`status--${meta.tone}`">
    <i :class="meta.icon" aria-hidden="true"></i>
    <span class="visually-hidden">{{ checkoutCopy.status.label }}:</span>
    {{ label }}
  </span>
</template>

<style scoped lang="scss">
.status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.8rem;
  border-radius: $radius-pill;
  font-size: $text-xs;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.3;
  white-space: nowrap;

  // Texto oscurecido sobre cada fondo suave: los colores de estado puros no llegan a AA.
  &--warning {
    background: $warning-bg;
    color: darken($warning, 32%);
  }

  &--info {
    background: $info-bg;
    color: darken($info, 28%);
  }

  &--success {
    background: $success-bg;
    color: $success-text;
  }

  &--danger {
    background: $danger-bg;
    color: $danger-text;
  }
}
</style>
