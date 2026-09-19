<script setup lang="ts">
import { useRouter } from 'vue-router'
import { copy } from '@/config/copy'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { useSeo } from '@/composables/useSeo'
import BaseCta from '@/components/ui/BaseCta.vue'
import MyOrdersList from '@/components/checkout/MyOrdersList.vue'

const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()
const text = copy.account

function logout() {
  userStore.clear()
  toast.info(text.loggedOut)
  router.replace('/')
}

useSeo(() => ({ title: text.eyebrow, path: '/cuenta', noindex: true }))
</script>

<template>
  <section class="account">
    <p class="account__eyebrow">{{ text.eyebrow }}</p>
    <h1 class="account__title">{{ userStore.user?.name || userStore.user?.email }}</h1>

    <dl class="account__data">
      <div>
        <dt>{{ text.email }}</dt>
        <dd>{{ userStore.user?.email }}</dd>
      </div>
      <div>
        <dt>{{ text.phone }}</dt>
        <dd>{{ userStore.user?.phone || text.noPhone }}</dd>
      </div>
    </dl>

    <div class="account__actions">
      <BaseCta v-if="userStore.isAdmin" to="/admin" variant="dark">{{ text.adminCta }}</BaseCta>
      <BaseCta to="/tienda" :variant="userStore.isAdmin ? 'outline' : 'dark'">
        {{ text.shopCta }}
      </BaseCta>
      <button class="btn btn--ghost" type="button" @click="logout">
        <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i> {{ text.logout }}
      </button>
    </div>

    <MyOrdersList class="account__orders" />
  </section>
</template>

<style scoped lang="scss">
.account {
  @include container(720px);
  @include flex(column, flex-start, flex-start, 1rem);
  padding-block: $space-lg $space-section;

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
    overflow-wrap: anywhere;
  }

  &__data {
    @include card;
    @include flex-cards(200px, 1.25rem);
    width: 100%;
    padding: 1.5rem 1.25rem;
    margin-block: 0.6rem 1rem;
    border-radius: $radius-md;
    border-top: 3px solid $gold-deep;

    @include from('md') {
      padding: 1.75rem 2rem;
    }

    dt {
      @include eyebrow;
      font-size: 0.65rem;
      color: $ink-soft;
    }

    dd {
      margin-top: 0.25rem;
      overflow-wrap: anywhere;
    }
  }

  &__actions {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
  }

  &__orders {
    margin-top: $space-md;
  }
}
</style>
