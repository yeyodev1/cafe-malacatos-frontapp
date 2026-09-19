<script setup lang="ts">
import { adminCopy } from '@/config/copy.admin'
import AdminSection from './AdminSection.vue'

const text = adminCopy.order
defineProps<{ modelValue: string; dirty: boolean; saving: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string]; save: [] }>()
</script>

<template>
  <AdminSection :title="text.noteTitle" :lead="text.noteHint" icon="fa-solid fa-note-sticky">
    <form class="note" @submit.prevent="emit('save')">
      <label for="order-note" class="visually-hidden">{{ text.noteLabel }}</label>
      <textarea
        id="order-note"
        class="note__input"
        rows="4"
        maxlength="2000"
        :value="modelValue"
        :placeholder="text.notePlaceholder"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      ></textarea>
      <button type="submit" class="btn btn--dark note__save" :disabled="!dirty || saving">
        <i
          :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-floppy-disk'"
          aria-hidden="true"
        ></i>
        {{ saving ? adminCopy.common.saving : text.noteSave }}
      </button>
    </form>
  </AdminSection>
</template>

<style scoped lang="scss">
.note {
  @include flex(column, stretch, flex-start, 0.75rem);

  &__input {
    min-height: 6rem;
    font-size: 1rem;
    line-height: 1.55;
    resize: vertical;
  }

  &__save {
    min-height: 2.9rem;

    @include from('sm') {
      align-self: flex-start;
    }
  }
}
</style>
