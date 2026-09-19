<script setup lang="ts">
import { adminCopy } from '@/config/copy.admin'
import BaseModal from '@/components/ui/BaseModal.vue'

const text = adminCopy.leave
defineProps<{ open: boolean }>()
const emit = defineEmits<{ stay: []; leave: [] }>()
</script>

<template>
  <BaseModal
    :open="open"
    :title="text.title"
    :message="text.message"
    :confirm-label="text.confirm"
    :cancel-label="text.cancel"
    danger
    @confirm="emit('leave')"
    @cancel="emit('stay')"
  />
</template>
