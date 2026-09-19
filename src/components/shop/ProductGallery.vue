<script setup lang="ts">
import { computed, ref } from 'vue'
import { site } from '@/config/site'
import { copy } from '@/config/copy'
import ProductImage from './ProductImage.vue'
import type { ProductImage as Image } from '@/types'

const props = defineProps<{ images: Image[]; name: string }>()

const index = ref(0)
const current = computed(() => props.images[index.value]?.url ?? '')
</script>

<template>
  <div class="gallery">
    <div class="gallery__main">
      <ProductImage
        :src="current"
        :alt="`${name}, ${site.name}`"
        :width="960"
        sizes="(min-width: 1024px) 520px, 92vw"
        eager
      />
    </div>

    <ul v-if="images.length > 1" class="gallery__thumbs" :aria-label="copy.product.galleryLabel">
      <li v-for="(image, i) in images" :key="image.publicId || image.url">
        <button
          class="gallery__thumb"
          :class="{ 'gallery__thumb--active': i === index }"
          type="button"
          :aria-label="`${copy.product.galleryLabel}: ${i + 1}`"
          :aria-pressed="i === index"
          @click="index = i"
        >
          <ProductImage :src="image.url" alt="" :width="160" sizes="72px" ratio="1 / 1" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.gallery {
  @include flex(column, stretch, flex-start, 0.75rem);

  &__main {
    overflow: hidden;
    border-radius: $radius-md;
    border: 1px solid $line;
  }

  &__thumbs {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    list-style: none;
  }

  &__thumb {
    @include focus-ring;
    @include transition(border-color);
    display: block;
    width: 4.25rem;
    overflow: hidden;
    border: 2px solid transparent;
    border-radius: $radius-sm;

    &:hover {
      border-color: $line;
    }

    &--active,
    &--active:hover {
      border-color: $accent;
    }
  }
}
</style>
