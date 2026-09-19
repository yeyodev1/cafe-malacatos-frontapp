<script setup lang="ts">
import { computed } from 'vue'
import { orderStatus } from '@/config/copy.admin'
import type { OrderStatus } from '@/types'

// El estado se lee por el texto y el icono; el color solo acompaña.
const props = defineProps<{ status: OrderStatus; large?: boolean }>()
const meta = computed(() => orderStatus[props.status] || orderStatus.pending)
</script>

<template>
  <span class="badge" :class="[`badge--${meta.tone}`, { 'badge--large': large }]">
    <i :class="meta.icon" aria-hidden="true"></i>{{ meta.label }}
  </span>
</template>

<style scoped lang="scss">
.badge {
  @include flex(row, center, flex-start, 0.45rem);
  display: inline-flex;
  padding: 0.3rem 0.7rem;
  border: 1px solid transparent;
  border-radius: $radius-pill;
  font-size: $text-xs;
  font-weight: 700;
  line-height: 1.3;
  white-space: nowrap;

  &--large {
    padding: 0.45rem 0.95rem;
    font-size: $text-sm;
  }

  &--neutral {
    background: $sand;
    border-color: $line;
    color: $ink-soft;
  }

  &--warning {
    background: $gold-soft;
    border-color: $gold-deep;
    color: darken($gold-deep, 22%);
  }

  &--info {
    background: $info-bg;
    border-color: rgba($info, 0.5);
    color: darken($info, 28%);
  }

  &--success {
    background: $success-bg;
    border-color: rgba($success, 0.5);
    color: $success-text;
  }

  &--done {
    background: $surface;
    border-color: $success-text;
    color: $success-text;
  }

  &--danger {
    background: $danger-bg;
    border-color: rgba($danger, 0.45);
    color: $danger-text;
  }
}
</style>
