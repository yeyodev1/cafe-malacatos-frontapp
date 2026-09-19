<script setup lang="ts">
// Interruptor de un toque. El estado también va escrito: no se lee solo por el color.
const props = defineProps<{
  modelValue: boolean
  label: string
  onText?: string
  offText?: string
  busy?: boolean
  hideLabel?: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

function toggle() {
  if (!props.busy) emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button
    type="button"
    role="switch"
    class="switch"
    :class="{ 'switch--on': modelValue, 'switch--busy': busy }"
    :aria-checked="modelValue"
    :aria-label="hideLabel ? label : undefined"
    :aria-busy="busy"
    @click="toggle"
  >
    <span class="switch__track" aria-hidden="true"><span class="switch__thumb"></span></span>
    <span v-if="!hideLabel" class="switch__label">{{ label }}</span>
    <span v-if="onText || offText" class="switch__state">{{ modelValue ? onText : offText }}</span>
  </button>
</template>

<style scoped lang="scss">
.switch {
  @include flex(row, center, flex-start, 0.65rem);
  @include focus-ring;
  display: inline-flex;
  min-height: 2.75rem;
  border-radius: $radius-sm;
  text-align: left;

  &--busy {
    opacity: 0.6;
    cursor: progress;
  }

  &__track {
    @include transition(background-color);
    flex: 0 0 auto;
    width: 2.9rem;
    height: 1.65rem;
    padding: 0.2rem;
    border-radius: $radius-pill;
    background: $ink-muted;
  }

  &__thumb {
    @include transition(transform);
    display: block;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: $surface;
    box-shadow: $shadow-sm;
  }

  &--on &__track {
    background: $success-text;
  }

  &--on &__thumb {
    transform: translateX(1.25rem);
  }

  &__label {
    font-size: $text-sm;
    font-weight: 500;
  }

  &__state {
    min-width: 5.2rem;
    font-size: $text-sm;
    font-weight: 700;
    color: $ink-soft;
  }

  &--on &__state {
    color: $success-text;
  }
}
</style>
