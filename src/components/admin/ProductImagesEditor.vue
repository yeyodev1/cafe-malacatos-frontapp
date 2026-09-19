<script setup lang="ts">
import { ref, toRef } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { cldUrl } from '@/utils/image'
import { useProductImages } from '@/composables/admin/useProductImages'
import AdminSection from './AdminSection.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import type { ProductImage } from '@/types'

const text = adminCopy.images
const props = defineProps<{ productId: string; productName: string; isNew: boolean }>()
const images = defineModel<ProductImage[]>('images', { required: true })

const { uploading, removingId, error, upload, remove } = useProductImages(
  toRef(props, 'productId'),
  images,
)

const picker = ref<HTMLInputElement | null>(null)
const toRemove = ref('')

function onPick(event: Event) {
  const input = event.target as HTMLInputElement
  upload(input.files?.[0])
  // Se limpia para que elegir la misma foto otra vez vuelva a disparar el cambio.
  input.value = ''
}

function confirmRemove() {
  const publicId = toRemove.value
  toRemove.value = ''
  remove(publicId)
}
</script>

<template>
  <AdminSection :title="text.title" :lead="text.lead" icon="fa-solid fa-camera">
    <p v-if="isNew" class="images__note">
      <i class="fa-solid fa-circle-info" aria-hidden="true"></i>{{ text.saveFirst }}
    </p>

    <template v-else>
      <p v-if="!images.length" class="images__note">
        <i class="fa-solid fa-image" aria-hidden="true"></i>{{ text.empty }}
      </p>
      <ul v-else class="images__list">
        <li v-for="(image, index) in images" :key="image.publicId" class="images__item">
          <img
            :src="cldUrl(image.url, 400)"
            :alt="text.alt(productName, index + 1)"
            class="images__img"
            loading="lazy"
          />
          <span v-if="index === 0" class="images__cover">
            <i class="fa-solid fa-star" aria-hidden="true"></i>{{ text.cover }}
          </span>
          <button
            type="button"
            class="images__remove"
            :disabled="!!removingId"
            @click="toRemove = image.publicId"
          >
            <i
              :class="
                removingId === image.publicId
                  ? 'fa-solid fa-spinner fa-spin'
                  : 'fa-solid fa-trash-can'
              "
              aria-hidden="true"
            ></i>
            {{ text.remove }}<span class="visually-hidden"> {{ index + 1 }}</span>
          </button>
        </li>
      </ul>
      <p v-if="images.length > 1" class="images__hint">{{ text.coverHint }}</p>

      <div v-if="error" class="images__error" role="alert">
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
        <div>
          <strong>{{ text.errorTitle }}</strong>
          <p>{{ error }}</p>
        </div>
      </div>

      <input
        ref="picker"
        type="file"
        accept="image/*"
        class="visually-hidden"
        tabindex="-1"
        aria-hidden="true"
        @change="onPick"
      />
      <button
        type="button"
        class="btn btn--dark images__add"
        :disabled="uploading"
        @click="picker?.click()"
      >
        <i
          :class="uploading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-upload'"
          aria-hidden="true"
        ></i>
        {{ uploading ? text.uploading : text.add }}
      </button>
    </template>

    <BaseModal
      :open="!!toRemove"
      :title="text.removeTitle"
      :message="text.removeMessage"
      :confirm-label="text.removeConfirm"
      danger
      @confirm="confirmRemove"
      @cancel="toRemove = ''"
    />
  </AdminSection>
</template>

<style scoped lang="scss">
.images {
  &__note,
  &__hint {
    @include flex(row, flex-start, flex-start, 0.6rem);
    color: $ink-soft;
    font-size: $text-sm;

    i {
      margin-top: 0.25rem;
      color: $accent;
    }
  }

  &__list {
    @include flex-cards(8.5rem, 0.75rem);
    list-style: none;

    > * {
      flex-grow: 0;
    }
  }

  &__item {
    @include flex(column, stretch, flex-start, 0.4rem);
    position: relative;
    max-width: 12rem;
  }

  &__img {
    width: 100%;
    aspect-ratio: 1;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $sand;
    object-fit: cover;
  }

  &__cover {
    @include flex(row, center, center, 0.35rem);
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    padding: 0.2rem 0.6rem;
    border-radius: $radius-pill;
    background: $gold;
    color: $roast;
    font-size: $text-xs;
    font-weight: 700;
  }

  &__remove {
    @include flex(row, center, center, 0.45rem);
    @include focus-ring($danger);
    min-height: 2.75rem;
    border: 1px solid rgba($danger, 0.4);
    border-radius: $radius-pill;
    color: $danger-text;
    font-size: $text-sm;
    font-weight: 600;

    &:hover {
      background: $danger-bg;
    }

    &:disabled {
      opacity: 0.5;
    }
  }

  &__error {
    @include flex(row, flex-start, flex-start, 0.7rem);
    padding: 0.9rem 1rem;
    border: 1px solid rgba($danger, 0.45);
    border-radius: $radius-sm;
    background: $danger-bg;
    color: $danger-text;
    font-size: $text-sm;

    i {
      margin-top: 0.2rem;
    }

    p {
      margin-top: 0.2rem;
      color: $ink;
    }
  }

  &__add {
    min-height: 3rem;

    @include from('sm') {
      align-self: flex-start;
    }
  }
}
</style>
