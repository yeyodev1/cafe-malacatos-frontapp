<script setup lang="ts">
import { adminCopy } from '@/config/copy.admin'

const text = adminCopy.pagination
defineProps<{ page: number; pages: number; disabled?: boolean }>()
const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <nav v-if="pages > 1" class="pager" :aria-label="text.label">
    <button
      type="button"
      class="pager__btn"
      :disabled="disabled || page <= 1"
      @click="emit('change', page - 1)"
    >
      <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>{{ text.previous }}
    </button>
    <span class="pager__status" aria-live="polite">
      {{ text.page }} {{ page }} {{ text.of }} {{ pages }}
    </span>
    <button
      type="button"
      class="pager__btn"
      :disabled="disabled || page >= pages"
      @click="emit('change', page + 1)"
    >
      {{ text.next }}<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  @include flex(row, center, space-between, 0.75rem);
  margin-top: 1.25rem;

  &__btn {
    @include flex(row, center, center, 0.5rem);
    @include transition(background-color);
    min-height: 2.75rem;
    padding: 0.5rem 1rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    background: $surface;
    font-size: $text-sm;
    font-weight: 600;

    &:hover:not(:disabled) {
      background: $sand;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__status {
    font-size: $text-sm;
    color: $ink-soft;
    text-align: center;
  }
}
</style>
