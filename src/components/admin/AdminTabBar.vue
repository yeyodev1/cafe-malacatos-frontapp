<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { adminCopy } from '@/config/copy.admin'
import { useAdminNav } from '@/composables/admin/useAdminNav'
import { useBodyScroll } from '@/composables/useBodyScroll'

const text = adminCopy.nav
const route = useRoute()
const { primaryItems, secondaryItems, userName, isActive, badgeFor, logout } = useAdminNav()

const moreOpen = ref(false)
const moreActive = computed(() => secondaryItems.some(isActive))

useBodyScroll(moreOpen)
watch(
  () => route.fullPath,
  () => (moreOpen.value = false),
)

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') moreOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="tabbar">
    <Transition name="fade">
      <div v-if="moreOpen" class="tabbar__veil" @click="moreOpen = false"></div>
    </Transition>

    <Transition name="rise">
      <div
        v-if="moreOpen"
        id="admin-more"
        class="tabbar__sheet"
        role="dialog"
        :aria-label="text.moreTitle"
        data-lenis-prevent
      >
        <p class="tabbar__sheet-title">{{ text.moreTitle }}</p>
        <RouterLink
          v-for="item in secondaryItems"
          :key="item.key"
          :to="item.to"
          class="tabbar__row"
          :class="{ 'tabbar__row--active': isActive(item) }"
        >
          <i :class="item.icon" aria-hidden="true"></i>{{ item.label }}
        </RouterLink>
        <a href="/" target="_blank" rel="noopener" class="tabbar__row">
          <i class="fa-solid fa-store" aria-hidden="true"></i>{{ text.viewStore }}
        </a>
        <button type="button" class="tabbar__row" @click="logout">
          <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>{{ text.logout }}
        </button>
        <p v-if="userName" class="tabbar__user">{{ userName }}</p>
      </div>
    </Transition>

    <nav class="tabbar__bar" :aria-label="text.label">
      <RouterLink
        v-for="item in primaryItems"
        :key="item.key"
        :to="item.to"
        class="tabbar__tab"
        :class="{ 'tabbar__tab--active': isActive(item) && !moreOpen }"
        :aria-current="isActive(item) ? 'page' : undefined"
      >
        <span class="tabbar__icon">
          <i :class="item.icon" aria-hidden="true"></i>
          <span v-if="badgeFor(item)" class="tabbar__badge">
            {{ badgeFor(item) }}<span class="visually-hidden">{{ text.pendingBadge }}</span>
          </span>
        </span>
        {{ item.label }}
      </RouterLink>
      <button
        type="button"
        class="tabbar__tab"
        :class="{ 'tabbar__tab--active': moreOpen || moreActive }"
        :aria-expanded="moreOpen"
        aria-controls="admin-more"
        @click="moreOpen = !moreOpen"
      >
        <span class="tabbar__icon">
          <i :class="moreOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" aria-hidden="true"></i>
        </span>
        {{ moreOpen ? text.closeMore : text.more }}
      </button>
    </nav>
  </div>
</template>

<style scoped lang="scss">
.tabbar {
  @include from('md') {
    display: none;
  }

  &__bar {
    @include flex(row, stretch, space-around);
    position: fixed;
    inset: auto 0 0;
    z-index: 120;
    padding: 0.3rem 0.25rem calc(0.3rem + env(safe-area-inset-bottom));
    background: $roast;
    border-top: 2px solid $gold-deep;
  }

  &__tab {
    @include flex(column, center, center, 0.2rem);
    @include focus-ring($gold);
    flex: 1 1 0;
    min-height: 3.4rem;
    border-radius: $radius-sm;
    color: rgba($paper, 0.65);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.02em;

    &--active {
      color: $gold;
    }
  }

  &__icon {
    position: relative;
    font-size: 1.15rem;
    line-height: 1;
  }

  &__badge {
    position: absolute;
    top: -0.5rem;
    left: 0.85rem;
    min-width: 1.15rem;
    padding: 0.1rem 0.3rem;
    border-radius: $radius-pill;
    background: $gold;
    color: $roast;
    font-size: 0.65rem;
    font-weight: 700;
    line-height: 1.2;
  }

  &__veil {
    position: fixed;
    inset: 0;
    z-index: 110;
    background: $overlay;
  }

  &__sheet {
    @include flex(column, stretch, flex-start, 0.15rem);
    position: fixed;
    inset: auto 0 0;
    z-index: 115;
    max-height: 80vh;
    padding: 1.25rem 1rem calc(5rem + env(safe-area-inset-bottom));
    border-radius: $radius-md $radius-md 0 0;
    background: $paper;
    overflow-y: auto;
  }

  &__sheet-title {
    @include eyebrow;
    padding: 0 0.5rem 0.5rem;
  }

  &__row {
    @include flex(row, center, flex-start, 0.9rem);
    @include focus-ring;
    width: 100%;
    min-height: 3.2rem;
    padding: 0.5rem;
    border-bottom: 1px solid $line;
    font-size: $text-base;
    font-weight: 500;
    text-align: left;

    i {
      width: 1.4rem;
      text-align: center;
      color: $accent;
    }

    &--active {
      color: $accent;
      font-weight: 700;
    }
  }

  &__user {
    padding: 0.8rem 0.5rem 0;
    font-size: $text-xs;
    color: $ink-muted;
    overflow-wrap: anywhere;
  }
}
</style>
