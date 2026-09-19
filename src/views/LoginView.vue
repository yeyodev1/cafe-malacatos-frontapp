<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { copy } from '@/config/copy'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { useSeo } from '@/composables/useSeo'
import AuthCard from '@/components/ui/AuthCard.vue'
import type { ApiError } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()
const text = copy.auth

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const next = computed(() => (typeof route.query.next === 'string' ? route.query.next : ''))

async function submit() {
  if (loading.value) return
  error.value = ''
  loading.value = true
  try {
    const user = await userStore.login(email.value.trim(), password.value)
    toast.success(`${text.welcome} ${user.name || user.email}`)
    router.replace(next.value || (userStore.isAdmin ? '/admin' : '/cuenta'))
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}

useSeo(() => ({ title: text.loginTitle, path: '/login', noindex: true }))
</script>

<template>
  <AuthCard
    :eyebrow="text.loginEyebrow"
    :title="text.loginTitle"
    :lead="text.loginLead"
    :error="error"
    @submit="submit"
  >
    <div>
      <label for="login-email">{{ text.email }}</label>
      <input id="login-email" v-model="email" type="email" autocomplete="email" required />
    </div>
    <div>
      <label for="login-password">{{ text.password }}</label>
      <input
        id="login-password"
        v-model="password"
        type="password"
        autocomplete="current-password"
        required
      />
    </div>

    <template #actions>
      <button class="btn btn--primary" type="submit" :disabled="loading">
        <i v-if="loading" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
        {{ loading ? text.loginLoading : text.loginSubmit }}
      </button>
    </template>

    <template #foot>
      {{ text.noAccount }}
      <RouterLink :to="{ path: '/registro', query: next ? { next } : {} }">
        {{ text.goRegister }}
      </RouterLink>
    </template>
  </AuthCard>
</template>
