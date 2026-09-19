<script setup lang="ts">
import { adminCopy } from '@/config/copy.admin'

// Barra pegajosa de guardar: siempre a mano, también con el teclado del celular abierto.
const text = adminCopy.common
defineProps<{
  dirty: boolean
  saving: boolean
  message?: string
  saveLabel?: string
  /** En un alta la barra se queda aunque no haya cambios. */
  always?: boolean
}>()
const emit = defineEmits<{ save: []; discard: [] }>()
</script>

<template>
  <Transition name="rise">
    <div v-if="dirty || always" class="savebar" role="region" :aria-label="text.unsavedBar">
      <p v-if="dirty" class="savebar__text">
        <i class="fa-solid fa-pen" aria-hidden="true"></i>{{ message || text.unsavedBar }}
      </p>
      <div class="savebar__actions">
        <button
          v-if="dirty"
          type="button"
          class="savebar__discard"
          :disabled="saving"
          @click="emit('discard')"
        >
          {{ text.discard }}
        </button>
        <button type="button" class="btn btn--primary" :disabled="saving" @click="emit('save')">
          <i
            :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check'"
            aria-hidden="true"
          ></i>
          {{ saving ? text.saving : saveLabel || text.save }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.savebar {
  @include flex(row, center, space-between, 0.75rem);
  flex-wrap: wrap;
  position: sticky;
  bottom: calc(var(--admin-bottom, 0rem) + 0.75rem);
  z-index: 50;
  margin-top: 1.5rem;
  padding: 0.75rem 0.9rem;
  border-radius: $radius-md;
  background: $roast;
  color: $paper;
  box-shadow: $shadow-lg;

  @include from('md') {
    bottom: 1.25rem;
    padding: 0.85rem 1.25rem;
  }

  &__text {
    @include flex(row, center, flex-start, 0.6rem);
    flex: 1 1 12rem;
    font-size: $text-sm;
    font-weight: 500;

    i {
      color: $gold;
    }
  }

  &__actions {
    @include flex(row, center, flex-end, 0.5rem);
    flex: 1 1 auto;
  }

  &__discard {
    @include focus-ring($gold);
    min-height: 2.75rem;
    padding: 0.5rem 0.9rem;
    border-radius: $radius-pill;
    color: rgba($paper, 0.8);
    font-size: $text-sm;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover {
      color: $paper;
    }
  }

  .btn--primary {
    padding-inline: 1.3rem;
    white-space: nowrap;
    background: $gold;
    color: $roast;

    &:hover {
      background: $gold-soft;
    }
  }
}
</style>
