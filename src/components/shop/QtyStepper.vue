<script setup lang="ts">
import { copy } from '@/config/copy'

const props = withDefaults(
  defineProps<{ modelValue: number; min?: number; max?: number; label?: string }>(),
  { min: 1, max: 99, label: '' },
)
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

function set(value: number) {
  const next = Math.min(props.max, Math.max(props.min, Math.round(value) || props.min))
  emit('update:modelValue', next)
}

function onInput(event: Event) {
  const input = event.target as HTMLInputElement
  set(Number(input.value))
  // Si el valor quedó recortado, el campo debe mostrar el número real.
  input.value = String(
    Math.min(props.max, Math.max(props.min, Math.round(Number(input.value)) || props.min)),
  )
}
</script>

<template>
  <div class="qty" role="group" :aria-label="label || copy.product.qtyLabel">
    <button
      class="qty__btn"
      type="button"
      :aria-label="copy.product.decrease"
      :disabled="modelValue <= min"
      @click="set(modelValue - 1)"
    >
      <i class="fa-solid fa-minus" aria-hidden="true"></i>
    </button>
    <input
      class="qty__input"
      type="number"
      inputmode="numeric"
      :min="min"
      :max="max"
      :value="modelValue"
      :aria-label="label || copy.product.qtyLabel"
      @change="onInput"
    />
    <button
      class="qty__btn"
      type="button"
      :aria-label="copy.product.increase"
      :disabled="modelValue >= max"
      @click="set(modelValue + 1)"
    >
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.qty {
  display: inline-flex;
  align-items: center;
  border: 1px solid $line;
  border-radius: $radius-pill;
  background: $surface;

  &__btn {
    @include flex(row, center, center);
    @include transition(color);
    @include focus-ring;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    font-size: 0.8rem;
    color: $ink;

    &:hover {
      color: $accent;
    }

    &:disabled {
      color: $ink-muted;
      cursor: not-allowed;
    }
  }

  &__input {
    width: 2.6rem;
    padding: 0;
    border: none;
    border-radius: 0;
    background: transparent;
    text-align: center;
    font-weight: 600;
    appearance: textfield;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      appearance: none;
      margin: 0;
    }

    &:focus {
      box-shadow: none;
    }

    &:focus-visible {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }
  }
}
</style>
