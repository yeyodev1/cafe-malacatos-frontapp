<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { copy } from '@/config/copy'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useHeaderScroll } from '@/composables/useHeaderScroll'
import { useSiteNav } from '@/composables/useSiteNav'
import TheMobileMenu from './TheMobileMenu.vue'

const route = useRoute()
const userStore = useUserStore()
const cart = useCartStore()
const { scrolled, hidden } = useHeaderScroll()
const { isActive, onNavigate } = useSiteNav()

const menuOpen = ref(false)
const burger = ref<HTMLButtonElement | null>(null)
useBodyScroll(menuOpen)

// Solo la home tiene un hero oscuro debajo: ahí el header arranca transparente.
const overHero = computed(() => route.name === 'Home' && !scrolled.value)
const accountTo = computed(() => (userStore.isAuthenticated ? '/cuenta' : '/login'))
const cartLabel = computed(() => `${copy.header.cart}: ${cart.count}`)

function closeMenu(returnFocus = false) {
  if (!menuOpen.value) return
  menuOpen.value = false
  if (returnFocus) nextTick(() => burger.value?.focus())
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu(true)
}

watch(
  () => route.fullPath,
  () => closeMenu(),
)

// Con el menú abierto, el contenido de atrás queda fuera del teclado y del lector de pantalla.
watch(menuOpen, (open) => {
  document.querySelectorAll('[data-page-region]').forEach((el) => el.toggleAttribute('inert', open))
})
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header
    class="header"
    :class="{
      'header--over-hero': overHero && !menuOpen,
      'header--solid': !overHero && !menuOpen,
      'header--menu': menuOpen,
      'header--hidden': hidden && !menuOpen,
    }"
  >
    <div class="header__inner">
      <RouterLink to="/" class="header__logo" @click="onNavigate('/')">{{ site.name }}</RouterLink>

      <nav class="header__nav" :aria-label="copy.header.menuLabel">
        <RouterLink
          v-for="link in site.nav"
          :key="link.to"
          :to="link.to"
          class="header__link"
          :class="{ 'header__link--active': isActive(link.to) }"
          :aria-current="isActive(link.to) ? 'page' : undefined"
          @click="onNavigate(link.to)"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <RouterLink
          :to="accountTo"
          class="header__icon header__icon--account"
          :aria-label="userStore.isAuthenticated ? copy.header.account : copy.header.login"
        >
          <i class="fa-regular fa-user" aria-hidden="true"></i>
        </RouterLink>

        <RouterLink to="/carrito" class="header__icon" :aria-label="cartLabel">
          <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
          <Transition name="fade">
            <span v-if="cart.count" :key="cart.count" class="header__count" aria-hidden="true">
              {{ cart.count > 99 ? '99+' : cart.count }}
            </span>
          </Transition>
        </RouterLink>

        <button
          ref="burger"
          class="header__icon header__icon--burger"
          type="button"
          :aria-label="menuOpen ? copy.header.closeMenu : copy.header.openMenu"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          @click="menuOpen = !menuOpen"
        >
          <i :class="menuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <TheMobileMenu :open="menuOpen" :account-to="accountTo" @close="closeMenu()" />
  </header>
</template>

<style scoped lang="scss">
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  color: $ink;
  // Solo se anima transform (ocultar) y colores; nada que cambie el layout.
  transition:
    transform 0.45s $ease,
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;
  border-bottom: 1px solid transparent;

  &--solid {
    background: rgba($paper, 0.94);
    backdrop-filter: blur(12px);
    border-color: $line;
  }

  &--over-hero,
  &--menu {
    color: $paper;
  }

  &--hidden {
    transform: translateY(-100%);
  }

  &__inner {
    @include container;
    @include flex(row, center, space-between, 1rem);
    position: relative;
    z-index: 2;
    min-height: 4rem;

    @include from('md') {
      min-height: 4.5rem;
    }
  }

  &__logo {
    @include display($text-xl, 600);
    @include focus-ring($gold-deep);
    letter-spacing: -0.01em;
    white-space: nowrap;
  }

  &__nav {
    display: none;

    @include from('lg') {
      @include flex(row, center, center, 2rem);
    }
  }

  &__link {
    @include focus-ring($gold-deep);
    position: relative;
    padding-block: 0.6rem;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;

    // Subrayado que crece desde la izquierda: scaleX, no width.
    &::after {
      content: '';
      position: absolute;
      inset: auto 0 0.3rem;
      height: 1px;
      background: currentColor;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s $ease;
    }

    &:hover::after,
    &--active::after {
      transform: scaleX(1);
    }
  }

  &__actions {
    @include flex(row, center, flex-end, 0.15rem);
  }

  &__icon {
    @include flex(row, center, center);
    @include focus-ring($gold-deep);
    position: relative;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    font-size: 1.1rem;

    &--account {
      display: none;

      @include from('sm') {
        display: flex;
      }
    }

    &--burger {
      font-size: 1.25rem;

      @include from('lg') {
        display: none;
      }
    }
  }

  &__count {
    position: absolute;
    top: 0.2rem;
    right: 0.05rem;
    @include flex(row, center, center);
    min-width: 1.15rem;
    height: 1.15rem;
    padding-inline: 0.25rem;
    border-radius: $radius-pill;
    background: $gold;
    color: $roast;
    font-size: 0.65rem;
    font-weight: 700;
    line-height: 1;
  }
}
</style>
