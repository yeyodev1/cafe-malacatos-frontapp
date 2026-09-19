<script setup lang="ts">
import { ref, watch } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { sameText } from '@/composables/admin/adminFormat'
import AdminField from './AdminField.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

// Borrar es para siempre: escribir el nombre obliga a leer qué se está borrando.
const text = adminCopy.product
const props = defineProps<{ open: boolean; name: string }>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()

const typed = ref('')
const error = ref('')

watch(
  () => props.open,
  () => {
    typed.value = ''
    error.value = ''
  },
)

function confirm() {
  if (!sameText(typed.value, props.name)) {
    error.value = text.deleteMismatch
    return
  }
  emit('confirm')
}
</script>

<template>
  <BaseModal
    :open="open"
    :title="text.deleteTitle"
    :message="text.deleteMessage(name)"
    :confirm-label="text.deleteConfirm"
    danger
    @confirm="confirm"
    @cancel="emit('cancel')"
  >
    <AdminField
      id="product-delete-name"
      v-slot="f"
      class="delete-field"
      :label="text.deleteTypeLabel(name)"
      :error="error"
    >
      <input
        :id="f.id"
        v-model="typed"
        type="text"
        autocomplete="off"
        autocapitalize="none"
        :aria-describedby="f.describedBy"
        :aria-invalid="f.invalid"
        @keydown.enter.prevent="confirm"
      />
    </AdminField>
  </BaseModal>
</template>

<style scoped lang="scss">
.delete-field {
  width: 100%;
  margin-top: 0.5rem;
  text-align: left;
}
</style>
