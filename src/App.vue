<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { copy } from '@/config/copy'
import { useSettingsStore } from '@/stores/settings'
import { useSmoothScroll } from '@/composables/useSmoothScroll'
import TheHeader from '@/layout/TheHeader.vue'
import TheFooter from '@/layout/TheFooter.vue'
import ToastList from '@/components/ui/ToastList.vue'
import WhatsappFloat from '@/components/ui/WhatsappFloat.vue'

const route = useRoute()
const settings = useSettingsStore()

// El panel de administración trae su propio layout: sin header, footer ni WhatsApp públicos.
const isAdmin = computed(() => route.path.startsWith('/admin'))
// En la home el hero pasa por debajo del header fijo; el resto de vistas deja su espacio.
const flush = computed(() => route.name === 'Home' || isAdmin.value)

useSmoothScroll()

onMounted(() => settings.load())
</script>

<template>
  <div class="app">
    <a href="#contenido" class="app__skip">{{ copy.common.skipToContent }}</a>
    <TheHeader v-if="!isAdmin" />
    <main
      id="contenido"
      class="app__main"
      :class="{ 'app__main--flush': flush }"
      tabindex="-1"
      data-page-region
    >
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <TheFooter v-if="!isAdmin" data-page-region />
    <WhatsappFloat v-if="!isAdmin" />
    <ToastList />
  </div>
</template>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__skip {
    position: fixed;
    top: 0.5rem;
    left: 0.5rem;
    z-index: 200;
    padding: 0.7rem 1.1rem;
    border-radius: $radius-pill;
    background: $ink;
    color: $paper;
    font-size: $text-sm;
    font-weight: 600;
    transform: translateY(-200%);

    &:focus-visible {
      transform: translateY(0);
    }
  }

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    // Alto del header fijo.
    padding-top: 4rem;
    outline: none;

    @include from('md') {
      padding-top: 4.5rem;
    }

    &--flush {
      padding-top: 0;
    }
  }
}
</style>

<!-- Global a propósito (sin scoped): Lenis pone estas clases en <html>. -->
<style lang="scss">
html.lenis,
html.lenis body {
  height: auto;
}

// global.scss declara scroll-behavior: smooth; con Lenis activo los dos suavizados
// se pelean, así que mientras Lenis corre el nativo se apaga.
html.lenis {
  scroll-behavior: auto;
}

.lenis.lenis-stopped {
  overflow: clip;
}

.lenis [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-smooth iframe {
  pointer-events: none;
}
</style>
