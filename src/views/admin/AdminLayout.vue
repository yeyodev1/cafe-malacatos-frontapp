<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { adminCopy } from '@/config/copy.admin'
import { useSeo } from '@/composables/useSeo'
import { useAdminStats } from '@/composables/admin/useAdminStats'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTabBar from '@/components/admin/AdminTabBar.vue'

const route = useRoute()
const { refresh } = useAdminStats()

// Nada del panel debe aparecer en buscadores.
useSeo(() => ({ title: String(route.meta.title || adminCopy.nav.dashboard), noindex: true }))

// El globo de pendientes se refresca al cambiar de sección: es barato y evita
// que el número se quede viejo con el panel abierto todo el día.
watch(
  () => route.name,
  () => refresh(),
  { immediate: true },
)

// Mientras el panel está montado los avisos salen arriba (ver el bloque de
// estilos global de abajo): abajo taparían la barra de guardar.
onMounted(() => document.body.classList.add('is-admin'))
onBeforeUnmount(() => document.body.classList.remove('is-admin'))
</script>

<template>
  <div class="admin">
    <AdminSidebar />

    <div class="admin__body">
      <header class="admin__topbar">
        <RouterLink to="/admin" class="admin__brand">{{ site.name }}</RouterLink>
        <span class="admin__sub">{{ adminCopy.nav.brandSub }}</span>
      </header>

      <div class="admin__content">
        <RouterView />
      </div>
    </div>

    <AdminTabBar />
  </div>
</template>

<style scoped lang="scss">
.admin {
  @include flex(row, stretch, flex-start);
  flex: 1;
  min-height: 100vh;
  background: $paper;
  // Alto de la barra inferior del móvil: lo usan las barras pegajosas de guardar.
  --admin-bottom: 4.4rem;

  @include from('md') {
    --admin-bottom: 0rem;
  }

  &__body {
    @include flex(column, stretch, flex-start);
    flex: 1;
    min-width: 0;
  }

  &__topbar {
    @include flex(row, baseline, space-between, 0.75rem);
    padding: 0.85rem 1rem;
    background: $roast;
    color: $paper;

    @include from('md') {
      display: none;
    }
  }

  &__brand {
    @include focus-ring($gold);
    font-family: $font-display;
    font-size: $text-lg;
  }

  &__sub {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: $gold;
  }

  &__content {
    @include flex(column, stretch, flex-start);
    flex: 1;
    width: 100%;
    max-width: 72rem;
    margin-inline: auto;
    padding: 1.5rem 1rem calc(var(--admin-bottom) + 2.5rem);

    @include from('md') {
      padding: 2.5rem 2rem 4rem;
    }

    @include from('lg') {
      padding-inline: 3rem;
    }
  }
}
</style>

<!-- Global a propósito: ToastList es compartido y se teletransporta a <body>. -->
<style lang="scss">
// Abajo viven la barra del móvil y la barra de guardar: en el panel los avisos
// salen arriba para no tapar justo el botón que se acaba de tocar.
body.is-admin .toasts {
  top: 4rem;
  right: 1rem;
  bottom: auto;

  @include from('md') {
    top: 1.25rem;
    right: 1.5rem;
  }
}
</style>
