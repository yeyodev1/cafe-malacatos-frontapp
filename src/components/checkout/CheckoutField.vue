<script setup lang="ts">
import { computed } from 'vue'

/**
 * Campo del checkout: label real, ayuda y error enlazados con aria-describedby.
 * Con `options` pinta un select; con `multiline`, un textarea.
 */
const props = withDefaults(
  defineProps<{
    id: string
    label: string
    error?: string
    hint?: string
    /** Texto junto al label para los campos que no son obligatorios. */
    optionalLabel?: string
    type?: string
    autocomplete?: string
    inputmode?: 'text' | 'numeric' | 'tel' | 'email'
    maxlength?: number
    placeholder?: string
    options?: readonly { value: string; label: string }[]
    multiline?: boolean
  }>(),
  { type: 'text', error: '', hint: '', optionalLabel: '', autocomplete: 'off' },
)

defineEmits<{ blur: [] }>()
const model = defineModel<string>({ required: true })

// Con error, la ayuda se oculta: solo se enlaza el párrafo que está en pantalla.
const describedBy = computed(() => {
  if (props.error) return `${props.id}-error`
  return props.hint ? `${props.id}-hint` : undefined
})

const shared = computed(() => ({
  id: props.id,
  name: props.id,
  autocomplete: props.autocomplete,
  required: !props.optionalLabel,
  'aria-invalid': props.error ? ('true' as const) : undefined,
  'aria-describedby': describedBy.value,
}))
</script>

<template>
  <div class="field" :class="{ 'field--invalid': error }">
    <label class="field__label" :for="id">
      {{ label }}
      <span v-if="optionalLabel" class="field__optional">({{ optionalLabel }})</span>
    </label>

    <select
      v-if="options"
      v-model="model"
      v-bind="shared"
      class="field__control"
      @blur="$emit('blur')"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <textarea
      v-else-if="multiline"
      v-model="model"
      v-bind="shared"
      class="field__control"
      rows="2"
      :maxlength="maxlength"
      @blur="$emit('blur')"
    ></textarea>
    <input
      v-else
      v-model="model"
      v-bind="shared"
      class="field__control"
      :type="type"
      :inputmode="inputmode"
      :maxlength="maxlength"
      :placeholder="placeholder"
      @blur="$emit('blur')"
    />

    <p v-if="hint && !error" :id="`${id}-hint`" class="field__hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="field__error" role="alert">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.field {
  @include flex(column, stretch, flex-start, 0);
  min-width: 0;

  &__optional {
    font-weight: 400;
    color: $ink-soft;
  }

  &__control {
    // 16px evita el zoom automático de iOS al enfocar.
    font-size: 1rem;
    min-height: 3rem;
    resize: vertical;
  }

  &--invalid &__control {
    border-color: $danger-text;
    box-shadow: 0 0 0 3px rgba($danger, 0.14);
  }

  &__hint,
  &__error {
    margin-top: 0.35rem;
    font-size: $text-xs;
    line-height: 1.45;
  }

  &__hint {
    color: $ink-soft;
  }

  &__error {
    color: $danger-text;
    font-weight: 500;
  }
}
</style>
