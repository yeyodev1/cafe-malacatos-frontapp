<script setup lang="ts">
import { computed, ref } from 'vue'
import { adminCopy, orderStatus } from '@/config/copy.admin'
import AdminSection from './AdminSection.vue'
import AdminField from './AdminField.vue'
import OrderProof from './OrderProof.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import type { Order } from '@/types'
import type { OrderAction } from '@/composables/admin/useOrderDetail'

// Solo se ofrecen las acciones que el estado permite; cada una se confirma antes.
const text = adminCopy.order
const props = defineProps<{ order: Order; busy: OrderAction | '' }>()
const emit = defineEmits<{ approve: []; ship: [note: string]; deliver: []; cancel: [] }>()

type Confirm = 'approve' | 'ship' | 'deliver' | 'cancel'
const asking = ref<Confirm | ''>('')
const trackingNote = ref('')
const trackingError = ref('')

const status = computed(() => props.order.status)
const isTransfer = computed(() => props.order.paymentMethod === 'transfer')
const canApprove = computed(
  () => isTransfer.value && ['pending', 'awaiting_verification'].includes(status.value),
)
const canShip = computed(() => status.value === 'paid')
const canDeliver = computed(() => status.value === 'shipped')
const canCancel = computed(() => !['delivered', 'cancelled'].includes(status.value))
const closed = computed(() => !canCancel.value)

const modal = computed(() => {
  const map = {
    approve: {
      title: text.approveTitle,
      message: text.approveMessage,
      confirm: text.approveConfirm,
    },
    ship: { title: text.shipTitle, message: text.shipMessage, confirm: text.shipConfirm },
    deliver: {
      title: text.deliverTitle,
      message: text.deliverMessage,
      confirm: text.deliverConfirm,
    },
    cancel: { title: text.cancelTitle, message: text.cancelMessage, confirm: text.cancelConfirm },
  }
  return asking.value ? map[asking.value] : null
})

function ask(action: Confirm) {
  trackingError.value = ''
  asking.value = action
}

function confirm() {
  const action = asking.value
  if (action === 'ship') {
    const note = trackingNote.value.trim()
    if (!note) {
      trackingError.value = text.shipNoteRequired
      return
    }
    emit('ship', note)
  } else if (action === 'approve') emit('approve')
  else if (action === 'deliver') emit('deliver')
  else if (action === 'cancel') emit('cancel')
  asking.value = ''
}
</script>

<template>
  <AdminSection :title="text.actionsTitle" icon="fa-solid fa-list-check">
    <p class="actions__hint">{{ orderStatus[status]?.hint }}</p>

    <OrderProof v-if="order.transferProof?.url" :url="order.transferProof.url" />
    <p v-else-if="canApprove" class="actions__note">
      <i class="fa-solid fa-circle-info" aria-hidden="true"></i>{{ text.proofMissing }}
    </p>
    <p v-else-if="status === 'pending'" class="actions__note">
      <i class="fa-solid fa-circle-info" aria-hidden="true"></i>{{ text.cardPending }}
    </p>

    <p v-if="closed" class="actions__note">
      <i class="fa-solid fa-lock" aria-hidden="true"></i>{{ text.closedNote }}
    </p>

    <div v-else class="actions__buttons">
      <button
        v-if="canApprove"
        type="button"
        class="btn btn--primary"
        :disabled="!!busy"
        @click="ask('approve')"
      >
        <i class="fa-solid fa-circle-check" aria-hidden="true"></i>{{ text.approve }}
      </button>
      <button
        v-if="canShip"
        type="button"
        class="btn btn--primary"
        :disabled="!!busy"
        @click="ask('ship')"
      >
        <i class="fa-solid fa-truck-fast" aria-hidden="true"></i>{{ text.ship }}
      </button>
      <button
        v-if="canDeliver"
        type="button"
        class="btn btn--primary"
        :disabled="!!busy"
        @click="ask('deliver')"
      >
        <i class="fa-solid fa-house-circle-check" aria-hidden="true"></i>{{ text.deliver }}
      </button>
      <button
        v-if="canCancel"
        type="button"
        class="actions__cancel"
        :disabled="!!busy"
        @click="ask('cancel')"
      >
        <i class="fa-solid fa-ban" aria-hidden="true"></i>{{ text.cancel }}
      </button>
    </div>

    <BaseModal
      :open="!!modal"
      :title="modal?.title || ''"
      :message="modal?.message"
      :confirm-label="modal?.confirm"
      :cancel-label="asking === 'cancel' ? text.cancelKeep : undefined"
      :danger="asking === 'cancel'"
      @confirm="confirm"
      @cancel="asking = ''"
    >
      <AdminField
        v-if="asking === 'ship'"
        id="order-tracking"
        v-slot="field"
        class="actions__tracking"
        :label="text.shipNoteLabel"
        :error="trackingError"
      >
        <textarea
          :id="field.id"
          v-model="trackingNote"
          rows="3"
          maxlength="1000"
          :placeholder="text.shipNotePlaceholder"
          :aria-describedby="field.describedBy"
          :aria-invalid="field.invalid"
        ></textarea>
      </AdminField>
    </BaseModal>
  </AdminSection>
</template>

<style scoped lang="scss">
.actions {
  &__hint {
    font-weight: 500;
  }

  &__note {
    @include flex(row, flex-start, flex-start, 0.6rem);
    padding: 0.8rem 0.9rem;
    border-radius: $radius-sm;
    background: $sand;
    color: $ink-soft;
    font-size: $text-sm;

    i {
      margin-top: 0.2rem;
      color: $accent;
    }
  }

  &__buttons {
    @include flex(column, stretch, flex-start, 0.6rem);

    @include from('sm') {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
    }

    .btn {
      min-height: 3rem;
    }
  }

  &__cancel {
    @include flex(row, center, center, 0.5rem);
    @include transition(background-color);
    min-height: 3rem;
    padding: 0.6rem 1.3rem;
    border: 1px solid rgba($danger, 0.5);
    border-radius: $radius-pill;
    color: $danger-text;
    font-size: $text-sm;
    font-weight: 600;

    &:hover {
      background: $danger-bg;
    }

    &:disabled {
      opacity: 0.45;
      pointer-events: none;
    }

    @include from('sm') {
      margin-left: auto;
    }
  }

  &__tracking {
    width: 100%;
    margin-top: 0.5rem;
    text-align: left;
  }
}
</style>
