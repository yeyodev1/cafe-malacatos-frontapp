<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
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

const form = reactive({ name: '', email: '', phone: '', password: '' })
const loading = ref(false)
const error = ref('')

const next = computed(() => (typeof route.query.next === 'string' ? route.query.next : ''))

async function submit() {
  if (loading.value) return
  error.value = ''
  loading.value = true
  try {
    const user = await userStore.register({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
    })
    toast.success(`${text.welcome} ${user.name || user.email}`)
    router.replace(next.value || '/cuenta')
  } catch (e) {
    // El backend valida y responde en español: su mensaje se muestra tal cual.
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}

useSeo(() => ({ title: text.registerTitle, path: '/registro', noindex: true }))
</script>

<template>
  <AuthCard
    :eyebrow="text.registerEyebrow"
    :title="text.registerTitle"
    :lead="text.registerLead"
    :error="error"
    @submit="submit"
  >
    <div>
      <label for="register-name">{{ text.name }}</label>
      <input id="register-name" v-model="form.name" type="text" autocomplete="name" required />
    </div>
    <div>
      <label for="register-email">{{ text.email }}</label>
      <input id="register-email" v-model="form.email" type="email" autocomplete="email" required />
    </div>
    <div>
      <label for="register-phone">{{ text.phone }}</label>
      <input
        id="register-phone"
        v-model="form.phone"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        required
      />
    </div>
    <div>
      <label for="register-password">{{ text.password }}</label>
      <input
        id="register-password"
        v-model="form.password"
        type="password"
        autocomplete="new-password"
        minlength="8"
        aria-describedby="register-password-hint"
        required
      />
      <p id="register-password-hint" class="register__hint">{{ text.passwordHint }}</p>
    </div>

    <template #actions>
      <button class="btn btn--primary" type="submit" :disabled="loading">
        <i v-if="loading" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
        {{ loading ? text.registerLoading : text.registerSubmit }}
      </button>
    </template>

    <template #foot>
      {{ text.hasAccount }}
      <RouterLink :to="{ path: '/login', query: next ? { next } : {} }">{{
        text.goLogin
      }}</RouterLink>
    </template>
  </AuthCard>
</template>

<style scoped lang="scss">
.register__hint {
  margin-top: 0.35rem;
  font-size: $text-xs;
  color: $ink-soft;
}
</style>
