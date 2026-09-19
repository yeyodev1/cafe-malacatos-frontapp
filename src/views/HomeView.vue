<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useSettingsStore } from '@/stores/settings'
import { useSeo } from '@/composables/useSeo'
import { refreshScroll } from '@/composables/useMotion'
import { scrollToElement } from '@/composables/useSmoothScroll'
import { homeSchema } from '@/utils/schema'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeMarquee from '@/components/home/HomeMarquee.vue'
import HomeStory from '@/components/home/HomeStory.vue'
import HomeFeatured from '@/components/home/HomeFeatured.vue'
import HomePurpose from '@/components/home/HomePurpose.vue'
import HomeContact from '@/components/home/HomeContact.vue'

const route = useRoute()
const products = useProductsStore()
const settings = useSettingsStore()

// La portada del primer producto publicado ilustra el hero; sin catálogo, el
// hero se queda con su composición tipográfica.
const heroImage = computed(
  () => products.sorted.find((p) => p.images.length)?.images[0]?.url ?? null,
)

useSeo(() => ({
  path: '/',
  jsonLd: homeSchema({
    phone: settings.contactPhone,
    email: settings.contactEmail,
    sameAs: settings.socialLinks.map((item) => item.url),
  }),
}))

let hashTimer: number | undefined

onMounted(() => {
  products.load().then(refreshScroll)

  // Llegando desde otra página con /#historia, el router busca el ancla antes de
  // que termine la transición y no la encuentra: se baja acá, ya con el layout listo.
  if (route.hash) {
    hashTimer = window.setTimeout(() => {
      const target = document.getElementById(route.hash.slice(1))
      if (target) scrollToElement(target, 0)
    }, 450)
  }
})

onBeforeUnmount(() => window.clearTimeout(hashTimer))
</script>

<template>
  <div class="home">
    <HomeHero :image="heroImage" />
    <HomeMarquee />
    <HomeStory />
    <HomeFeatured />
    <HomePurpose />
    <HomeContact />
  </div>
</template>

<style scoped lang="scss">
.home {
  @include flex(column, stretch, flex-start);
}
</style>
