<script setup lang="ts">
// Etiqueta real + control + ayuda + error. El control llega por slot y recibe
// los ids para enlazar `for`, `aria-describedby` y `aria-invalid`.
import { computed } from 'vue'

const props = defineProps<{
  id: string
  label: string
  hint?: string
  error?: string
  optional?: string
}>()

const describedBy = computed(() => {
  const ids = []
  if (props.hint) ids.push(`${props.id}-hint`)
  if (props.error) ids.push(`${props.id}-error`)
  return ids.join(' ') || undefined
})
const invalid = computed<'true' | undefined>(() => (props.error ? 'true' : undefined))
</script>

<template>
  <div class="field" :class="{ 'field--error': error }">
    <label :for="id" class="field__label">
      {{ label }}<span v-if="optional" class="field__optional">{{ optional }}</span>
    </label>
    <slot :id="id" :described-by="describedBy" :invalid="invalid" />
    <p v-if="hint" :id="`${id}-hint`" class="field__hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="field__error" role="alert">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>{{ error }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.field {
  @include flex(column, stretch, flex-start, 0.3rem);
  min-width: 0;

  &__label {
    margin: 0;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
  }

  &__optional {
    margin-left: 0.4rem;
    font-weight: 400;
    color: $ink-muted;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-soft;
    line-height: 1.5;
  }

  &__error {
    @include flex(row, flex-start, flex-start, 0.4rem);
    font-size: $text-xs;
    font-weight: 600;
    color: $danger-text;

    i {
      margin-top: 0.15rem;
    }
  }

  :deep(input),
  :deep(select),
  :deep(textarea) {
    min-height: 2.9rem;
    // 16 px: por debajo, Safari en iPhone hace zoom al enfocar.
    font-size: 1rem;
  }

  :deep(textarea) {
    resize: vertical;
    line-height: 1.55;
  }

  &--error :deep(input),
  &--error :deep(select),
  &--error :deep(textarea) {
    border-color: $danger;
  }
}
</style>
