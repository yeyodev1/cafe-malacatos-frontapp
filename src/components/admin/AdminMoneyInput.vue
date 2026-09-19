<script setup lang="ts">
// Monto en dólares: teclado numérico en el celular y el signo $ siempre visible.
defineProps<{
  modelValue: string
  id: string
  placeholder?: string
  describedBy?: string
  invalid?: 'true'
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="money">
    <span class="money__sign" aria-hidden="true">$</span>
    <input
      :id="id"
      class="money__input"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      :value="modelValue"
      :placeholder="placeholder ?? '0.00'"
      :aria-describedby="describedBy"
      :aria-invalid="invalid"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped lang="scss">
.money {
  position: relative;

  &__sign {
    position: absolute;
    left: 0.9rem;
    top: 50%;
    transform: translateY(-50%);
    color: $ink-muted;
    font-weight: 600;
    pointer-events: none;
  }

  &__input {
    padding-left: 1.9rem;
    font-variant-numeric: tabular-nums;
  }
}
</style>
