<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import { checkoutCopy } from '@/config/copy.checkout'
import { useProofUpload } from '@/composables/checkout/useProofUpload'
import { cldUrl } from '@/utils/image'
import type { Order } from '@/types'

/**
 * Subida del comprobante de transferencia. Se usa al terminar el checkout y en
 * el seguimiento. Mientras el pedido siga pendiente o por verificar se puede
 * reemplazar la foto (el backend borra la anterior).
 */
const props = defineProps<{ order: Order }>()
const emit = defineEmits<{ uploaded: [order: Order] }>()

const text = checkoutCopy.proof
const { file, previewUrl, error, uploading, pick, upload } = useProofUpload(
  () => ({ number: props.order.number, email: props.order.customer.email }),
  (order) => emit('uploaded', order),
)

const sent = computed(() => Boolean(props.order.transferProof?.url))
const inputId = computed(() => `proof-${props.order.number}`)
</script>

<template>
  <section class="proof" :aria-labelledby="`${inputId}-title`">
    <h3 :id="`${inputId}-title`" class="proof__title">{{ text.title }}</h3>

    <div v-if="sent" class="proof__sent" role="status">
      <img
        class="proof__thumb"
        :src="cldUrl(order.transferProof!.url, 240)"
        :alt="text.currentAlt"
        width="96"
        height="96"
      />
      <p>
        <strong>
          <i class="fa-solid fa-circle-check" aria-hidden="true"></i> {{ text.sentTitle }}
        </strong>
        {{ site.checkout.transferNote }}
      </p>
    </div>
    <p v-else class="proof__lead">{{ text.lead }}</p>

    <img v-if="previewUrl" class="proof__preview" :src="previewUrl" :alt="text.previewAlt" />

    <div class="proof__actions">
      <!-- El input real queda accesible por teclado; el label hace de botón visible. -->
      <input
        :id="inputId"
        class="proof__input visually-hidden"
        type="file"
        accept="image/*"
        :disabled="uploading"
        :aria-describedby="error ? `${inputId}-error` : undefined"
        @change="pick"
      />
      <label class="proof__pick" :for="inputId">
        <i class="fa-solid fa-image" aria-hidden="true"></i>
        {{ file ? text.change : sent ? text.replace : text.choose }}
      </label>

      <button v-if="file" class="btn btn--dark" type="button" :disabled="uploading" @click="upload">
        <i
          :class="uploading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-arrow-up-from-bracket'"
          aria-hidden="true"
        ></i>
        {{ uploading ? text.uploading : text.upload }}
      </button>
    </div>

    <p v-if="error" :id="`${inputId}-error`" class="proof__error" role="alert">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
    </p>
  </section>
</template>

<style scoped lang="scss">
.proof {
  @include flex(column, stretch, flex-start, 0.9rem);

  &__title {
    font-size: $text-base;
    font-weight: 600;
  }

  &__lead {
    font-size: $text-sm;
    line-height: 1.5;
    color: $ink-soft;
  }

  &__sent {
    @include flex(row, flex-start, flex-start, 0.9rem);
    padding: 0.9rem;
    border-radius: $radius-sm;
    background: $success-bg;
    font-size: $text-sm;
    line-height: 1.5;

    strong {
      display: block;
      color: $success-text;
    }
  }

  &__thumb {
    flex: 0 0 4rem;
    width: 4rem;
    height: 4rem;
    border-radius: $radius-sm;
    object-fit: cover;
  }

  &__preview {
    align-self: flex-start;
    max-width: 100%;
    max-height: 18rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    object-fit: contain;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
  }

  &__pick {
    @include flex(row, center, center, 0.5rem);
    @include transition;
    min-height: 3rem;
    margin: 0;
    padding: 0.7rem 1.4rem;
    border: 1px solid $ink;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
    cursor: pointer;

    &:hover {
      background: $ink;
      color: $paper;
    }
  }

  // El foco cae en el input oculto: el anillo se pinta sobre su label.
  &__input:focus-visible + &__pick {
    outline: 2px solid $accent;
    outline-offset: 3px;
  }

  &__error {
    @include flex(row, flex-start, flex-start, 0.5rem);
    font-size: $text-sm;
    color: $danger-text;

    i {
      margin-top: 0.2rem;
    }
  }
}
</style>
