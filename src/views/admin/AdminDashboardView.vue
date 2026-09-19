<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { useUserStore } from '@/stores/user'
import { useDashboard } from '@/composables/admin/useDashboard'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminSection from '@/components/admin/AdminSection.vue'
import AdminStatCard from '@/components/admin/AdminStatCard.vue'
import AdminOrdersTable from '@/components/admin/AdminOrdersTable.vue'
import AdminLoading from '@/components/admin/AdminLoading.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const text = adminCopy.dashboard
const common = adminCopy.common
const userStore = useUserStore()
const { cards, stats, statsLoading, statsError, action, load, retry } = useDashboard()

const firstName = computed(() => (userStore.user?.name || '').split(' ')[0])
const title = computed(() =>
  firstName.value ? `${text.greeting}, ${firstName.value}` : text.greeting,
)

const shortcuts = [
  { to: '/admin/productos/nuevo', label: text.shortcuts.newProduct, icon: 'fa-solid fa-plus' },
  { to: '/admin/envios', label: text.shortcuts.shipping, icon: 'fa-solid fa-truck' },
  { to: '/admin/ajustes', label: text.shortcuts.settings, icon: 'fa-solid fa-building-columns' },
]

onMounted(load)
</script>

<template>
  <div class="dash">
    <AdminPageHeader :eyebrow="text.eyebrow" :title="title" :lead="text.lead" />

    <AdminLoading v-if="!stats && statsLoading" :rows="2" />
    <StateBlock
      v-else-if="!stats && statsError"
      tone="error"
      icon="fa-solid fa-triangle-exclamation"
      :title="common.errorTitle"
      :text="statsError"
    >
      <button type="button" class="btn btn--dark" @click="retry">{{ common.retry }}</button>
    </StateBlock>
    <div v-else class="dash__stats">
      <AdminStatCard v-for="card in cards" :key="card.label" v-bind="card" />
    </div>

    <AdminSection :title="text.actionTitle" :lead="text.actionLead" icon="fa-solid fa-bell">
      <AdminLoading v-if="action.loading.value" :rows="2" />
      <StateBlock
        v-else-if="action.error.value"
        tone="error"
        icon="fa-solid fa-triangle-exclamation"
        :title="common.errorTitle"
        :text="action.error.value"
      >
        <button type="button" class="btn btn--dark" @click="retry">{{ common.retry }}</button>
      </StateBlock>
      <StateBlock
        v-else-if="!action.data.value?.length"
        icon="fa-solid fa-mug-hot"
        :title="text.allClearTitle"
        :text="text.allClearText"
      />
      <AdminOrdersTable v-else :orders="action.data.value" :caption="text.actionTitle" />

      <RouterLink to="/admin/ordenes" class="dash__all">
        {{ text.seeAll }}<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </AdminSection>

    <AdminSection :title="text.shortcutsTitle">
      <div class="dash__shortcuts">
        <RouterLink v-for="item in shortcuts" :key="item.to" :to="item.to" class="dash__shortcut">
          <i :class="item.icon" aria-hidden="true"></i>{{ item.label }}
        </RouterLink>
      </div>
    </AdminSection>
  </div>
</template>

<style scoped lang="scss">
.dash {
  @include flex(column, stretch, flex-start, 1.5rem);

  &__stats {
    @include flex-cards(9.5rem, 0.75rem);

    @include from('md') {
      @include flex-cards(13rem, 1.25rem);
    }
  }

  &__all {
    @include flex(row, center, flex-start, 0.5rem);
    @include focus-ring;
    align-self: flex-start;
    min-height: 2.75rem;
    color: $accent;
    font-size: $text-sm;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  &__shortcuts {
    @include flex-cards(14rem, 0.75rem);
  }

  &__shortcut {
    @include flex(row, center, flex-start, 0.75rem);
    @include transition(background-color);
    @include focus-ring;
    min-height: 3.25rem;
    padding: 0.75rem 1rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $paper;
    font-size: $text-sm;
    font-weight: 600;

    i {
      color: $accent;
    }

    &:hover {
      background: $sand;
    }
  }
}
</style>
