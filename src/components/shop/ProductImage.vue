<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { copy } from '@/config/copy'
import { cldSrcset, cldUrl } from '@/utils/image'
import { refreshScroll } from '@/composables/useMotion'
import CoffeeBean from '@/components/ui/CoffeeBean.vue'

/**
 * Foto de producto con proporción fija (sin saltos de layout) y un placeholder
 * de marca cuando el producto no tiene imagen o la imagen falla.
 */
const props = withDefaults(
  defineProps<{
    src?: string
    alt: string
    width?: number
    sizes?: string
    eager?: boolean
    ratio?: string
  }>(),
  {
    src: '',
    width: 640,
    sizes: '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 90vw',
    ratio: '4 / 5',
  },
)

const failed = ref(false)
watch(
  () => props.src,
  () => (failed.value = false),
)

const showImage = computed(() => Boolean(props.src) && !failed.value)
const height = computed(() => {
  const [w, h] = props.ratio.split('/').map((part) => Number(part.trim()))
  return Math.round((props.width * (h || 1)) / (w || 1))
})
</script>

<template>
  <div class="product-image" :style="{ aspectRatio: ratio }">
    <img
      v-if="showImage"
      class="product-image__img"
      :src="cldUrl(src, width)"
      :srcset="cldSrcset(src, [320, 480, 640, 960, 1280])"
      :sizes="sizes"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      @load="refreshScroll"
      @error="failed = true"
    />
    <div
      v-else
      class="product-image__empty"
      role="img"
      :aria-label="`${alt}. ${copy.product.noImage}`"
    >
      <span class="product-image__bean"><CoffeeBean tone="gold" /></span>
      <span class="product-image__note">{{ copy.product.noImage }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-image {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: $sand;

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__empty {
    @include flex(column, center, center, 0.9rem);
    width: 100%;
    height: 100%;
    background:
      radial-gradient(70% 60% at 50% 35%, rgba($gold, 0.28), transparent 70%),
      linear-gradient(160deg, $accent 0%, $roast-soft 90%);
    color: rgba($paper, 0.85);
  }

  &__bean {
    width: 22%;
    max-width: 4.5rem;
    rotate: 24deg;
  }

  &__note {
    @include eyebrow;
    color: rgba($paper, 0.85);
  }
}
</style>
