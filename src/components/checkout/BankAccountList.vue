<script setup lang="ts">
import { ref } from 'vue'
import { checkoutCopy } from '@/config/copy.checkout'
import { useToastStore } from '@/stores/toast'
import type { BankAccount } from '@/types'

// Cuentas para transferir. El número se copia con un toque: escribirlo a mano en
// la app del banco es donde más se equivoca la gente.
defineProps<{ accounts: BankAccount[] }>()

const toast = useToastStore()
const text = checkoutCopy.transfer
const copiedId = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

async function copyNumber(account: BankAccount) {
  try {
    await navigator.clipboard.writeText(account.number)
    copiedId.value = account.id
    clearTimeout(timer)
    timer = setTimeout(() => (copiedId.value = ''), 2200)
  } catch {
    // Sin permiso de portapapeles o en http: el número sigue visible para copiarlo a mano.
    toast.error(text.copyFailed)
  }
}
</script>

<template>
  <ul class="accounts">
    <li v-for="account in accounts" :key="account.id" class="accounts__item">
      <p class="accounts__bank">
        <i class="fa-solid fa-building-columns" aria-hidden="true"></i> {{ account.bank }}
      </p>
      <dl class="accounts__data">
        <div>
          <dt>{{ text.accountType }}</dt>
          <dd>{{ account.accountType }}</dd>
        </div>
        <div>
          <dt>{{ text.holder }}</dt>
          <dd>{{ account.holder }}</dd>
        </div>
        <div>
          <dt>{{ text.idNumber }}</dt>
          <dd>{{ account.idNumber }}</dd>
        </div>
      </dl>
      <div class="accounts__number">
        <span>
          <span class="accounts__label">{{ text.number }}</span>
          <strong>{{ account.number }}</strong>
        </span>
        <button
          class="accounts__copy"
          type="button"
          :aria-label="`${text.copyNumber} ${account.bank}`"
          @click="copyNumber(account)"
        >
          <i
            :class="copiedId === account.id ? 'fa-solid fa-check' : 'fa-regular fa-copy'"
            aria-hidden="true"
          ></i>
          <span aria-live="polite">{{ copiedId === account.id ? text.copied : text.copy }}</span>
        </button>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.accounts {
  @include flex(column, stretch, flex-start, 0.9rem);
  list-style: none;

  &__item {
    @include flex(column, stretch, flex-start, 0.8rem);
    padding: 1rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $paper;
  }

  &__bank {
    @include flex(row, center, flex-start, 0.55rem);
    font-weight: 600;

    i {
      color: $accent;
    }
  }

  &__data {
    @include flex-cards(130px, 0.75rem);
    font-size: $text-sm;

    dt {
      font-size: $text-xs;
      color: $ink-soft;
    }

    dd {
      overflow-wrap: anywhere;
    }
  }

  &__number {
    @include flex(row, center, space-between, 0.75rem);
    flex-wrap: wrap;
    padding-top: 0.8rem;
    border-top: 1px solid $line;

    strong {
      display: block;
      font-size: $text-lg;
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.04em;
      overflow-wrap: anywhere;
    }
  }

  &__label {
    font-size: $text-xs;
    color: $ink-soft;
  }

  &__copy {
    @include flex(row, center, center, 0.45rem);
    @include transition;
    @include focus-ring;
    min-height: 2.75rem;
    padding: 0.5rem 1.1rem;
    border: 1px solid $ink;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;

    &:hover {
      background: $ink;
      color: $paper;
    }
  }
}
</style>
