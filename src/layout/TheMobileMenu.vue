<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { site } from '@/config/site'
import { copy } from '@/config/copy'
import { useUserStore } from '@/stores/user'
import { useSiteNav } from '@/composables/useSiteNav'
import { useWhatsappOrder } from '@/composables/useWhatsappOrder'
import BaseCta from '@/components/ui/BaseCta.vue'

const props = defineProps<{ open: boolean; accountTo: string }>()
const emit = defineEmits<{ close: [] }>()

const userStore = useUserStore()
const { isActive, onNavigate } = useSiteNav()
const { smartLink } = useWhatsappOrder()

const panel = ref<HTMLElement | null>(null)

// El panel vive al final del <body>: al abrir, el foco salta a su primer enlace
// para que el teclado no tenga que recorrer la página que queda detrás.
watch(
  () => props.open,
  async (open) => {
    if (!open) return
    await nextTick()
    panel.value?.querySelector<HTMLElement>('a')?.focus()
  },
)

function go(to: string) {
  emit('close')
  onNavigate(to)
}
</script>

<template>
  <!-- Fuera del header: su backdrop-filter y su transform atraparían a un hijo fixed. -->
  <Teleport to="body">
    <Transition name="menu">
      <div v-if="open" id="mobile-menu" ref="panel" class="menu" data-lenis-prevent>
        <nav class="menu__nav" :aria-label="copy.header.menuLabel">
          <RouterLink
            v-for="(link, index) in site.nav"
            :key="link.to"
            :to="link.to"
            class="menu__link"
            :class="{ 'menu__link--active': isActive(link.to) }"
            :style="{ '--i': index }"
            :aria-current="isActive(link.to) ? 'page' : undefined"
            @click="go(link.to)"
          >
            <span class="menu__index">0{{ index + 1 }}</span>
            {{ link.label }}
          </RouterLink>
        </nav>

        <div class="menu__foot" :style="{ '--i': site.nav.length }">
          <RouterLink :to="accountTo" class="menu__account" @click="emit('close')">
            <i class="fa-regular fa-user" aria-hidden="true"></i>
            {{ userStore.isAuthenticated ? copy.header.account : copy.header.login }}
          </RouterLink>
          <BaseCta :href="smartLink" variant="gold" icon="fa-brands fa-whatsapp" block>
            {{ copy.common.whatsappAsk }}
          </BaseCta>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.menu {
  position: fixed;
  inset: 0;
  z-index: 99;
  @include flex(column, stretch, space-between, 2rem);
  height: 100vh;
  height: 100dvh;
  padding: 6rem 1.25rem 2rem;
  overflow-y: auto;
  background: radial-gradient(70% 45% at 100% 0%, rgba($gold, 0.18), transparent 70%), $roast;
  color: $paper;

  @include from('lg') {
    display: none;
  }

  &__nav {
    @include flex(column, stretch, flex-start);
  }

  &__link {
    @include flex(row, baseline, flex-start, 1rem);
    @include display($display-sm, 500);
    @include focus-ring($gold);
    padding-block: 1rem;
    border-bottom: 1px solid rgba($paper, 0.12);

    &--active {
      color: $gold;
    }
  }

  &__index {
    font-family: $font-principal;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.16em;
    color: $gold;
  }

  &__foot {
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__account {
    @include flex(row, center, flex-start, 0.75rem);
    @include focus-ring($gold);
    min-height: 2.75rem;
    font-size: $text-sm;
    font-weight: 500;
    color: rgba($paper, 0.85);
  }
}

// Apertura: el panel aparece y los enlaces suben escalonados (solo opacity y transform).
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.35s ease;

  .menu__link,
  .menu__foot {
    transition:
      opacity 0.5s ease,
      transform 0.6s $ease;
    transition-delay: calc(0.08s + var(--i) * 0.06s);
  }
}

.menu-leave-active {
  .menu__link,
  .menu__foot {
    transition-delay: 0s;
  }
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;

  .menu__link,
  .menu__foot {
    opacity: 0;
    transform: translateY(18px);
  }
}
</style>
