<script setup lang="ts">
import { adminCopy } from '@/config/copy.admin'
import { site } from '@/config/site'
import { useAdminNav } from '@/composables/admin/useAdminNav'

const text = adminCopy.nav
const { items, userName, isActive, badgeFor, logout } = useAdminNav()
</script>

<template>
  <aside class="sidebar">
    <RouterLink to="/admin" class="sidebar__brand">
      <span class="sidebar__name">{{ site.name }}</span>
      <span class="sidebar__sub">{{ text.brandSub }}</span>
    </RouterLink>

    <nav class="sidebar__nav" :aria-label="text.label">
      <RouterLink
        v-for="item in items"
        :key="item.key"
        :to="item.to"
        class="sidebar__link"
        :class="{ 'sidebar__link--active': isActive(item) }"
        :aria-current="isActive(item) ? 'page' : undefined"
      >
        <i :class="item.icon" aria-hidden="true"></i>
        <span>{{ item.label }}</span>
        <span v-if="badgeFor(item)" class="sidebar__badge">
          {{ badgeFor(item) }}
          <span class="visually-hidden">{{ text.pendingBadge }}</span>
        </span>
      </RouterLink>
    </nav>

    <div class="sidebar__foot">
      <a href="/" target="_blank" rel="noopener" class="sidebar__link">
        <i class="fa-solid fa-store" aria-hidden="true"></i>
        <span>{{ text.viewStore }}</span>
        <i class="fa-solid fa-arrow-up-right-from-square sidebar__ext" aria-hidden="true"></i>
      </a>
      <button type="button" class="sidebar__link" @click="logout">
        <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
        <span>{{ text.logout }}</span>
      </button>
      <p v-if="userName" class="sidebar__user">{{ userName }}</p>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  display: none;

  @include from('md') {
    @include flex(column, stretch, flex-start, 1.5rem);
    position: sticky;
    top: 0;
    flex: 0 0 15rem;
    height: 100vh;
    padding: 1.75rem 1rem 1.25rem;
    background: $roast;
    color: $paper;
    overflow-y: auto;
  }

  &__brand {
    @include flex(column, flex-start, flex-start, 0.2rem);
    @include focus-ring($gold);
    padding: 0 0.75rem 1.25rem;
    border-bottom: 1px solid rgba($paper, 0.12);
  }

  &__name {
    font-family: $font-display;
    font-size: $text-xl;
    line-height: 1.1;
  }

  &__sub {
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: $gold;
  }

  &__nav {
    @include flex(column, stretch, flex-start, 0.25rem);
    flex: 1;
  }

  &__link {
    @include flex(row, center, flex-start, 0.8rem);
    @include transition(background-color);
    @include focus-ring($gold);
    position: relative;
    width: 100%;
    min-height: 2.9rem;
    padding: 0.55rem 0.75rem;
    border-radius: $radius-sm;
    color: rgba($paper, 0.78);
    font-size: $text-sm;
    font-weight: 500;
    text-align: left;

    i:first-child {
      width: 1.2rem;
      text-align: center;
      color: rgba($paper, 0.55);
    }

    &:hover {
      background: $roast-soft;
      color: $paper;
    }

    &--active {
      background: $roast-soft;
      color: $paper;
      font-weight: 600;

      i:first-child {
        color: $gold;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0.6rem;
        bottom: 0.6rem;
        width: 3px;
        border-radius: 3px;
        background: $gold;
      }
    }
  }

  &__ext {
    margin-left: auto;
    font-size: 0.7rem;
    opacity: 0.6;
  }

  &__badge {
    margin-left: auto;
    min-width: 1.5rem;
    padding: 0.1rem 0.45rem;
    border-radius: $radius-pill;
    background: $gold;
    color: $roast;
    font-size: $text-xs;
    font-weight: 700;
    text-align: center;
  }

  &__foot {
    @include flex(column, stretch, flex-start, 0.25rem);
    padding-top: 1rem;
    border-top: 1px solid rgba($paper, 0.12);
  }

  &__user {
    padding: 0.6rem 0.75rem 0;
    font-size: $text-xs;
    color: rgba($paper, 0.5);
    overflow-wrap: anywhere;
  }
}
</style>
