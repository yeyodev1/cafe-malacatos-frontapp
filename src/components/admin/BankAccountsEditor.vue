<script setup lang="ts">
import { ref } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { blankBank, type BankDraft } from '@/composables/admin/useSettingsForm'
import AdminField from './AdminField.vue'
import AdminSection from './AdminSection.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

// `accounts` es la lista reactiva del formulario: agregar, quitar y escribir la cambian directo.
const text = adminCopy.settings
const props = defineProps<{ accounts: BankDraft[]; errors: Record<string, string> }>()

const removing = ref(-1)

function add() {
  props.accounts.push(blankBank())
}

function confirmRemove() {
  if (removing.value >= 0) props.accounts.splice(removing.value, 1)
  removing.value = -1
}

const textFields = [
  { field: 'number', label: text.number, inputmode: 'numeric' },
  { field: 'holder', label: text.holder, inputmode: 'text' },
  { field: 'idNumber', label: text.idNumber, inputmode: 'numeric' },
] as const
</script>

<template>
  <AdminSection :title="text.bankTitle" :lead="text.bankLead" icon="fa-solid fa-building-columns">
    <p v-if="!accounts.length" class="banks__empty" role="note">
      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>{{ text.bankEmpty }}
    </p>

    <fieldset v-for="(account, index) in accounts" :key="account.key" class="banks__item">
      <legend class="banks__legend">{{ text.bankItem }} {{ index + 1 }}</legend>
      <div class="banks__fields">
        <AdminField
          :id="`${account.key}-bank`"
          v-slot="f"
          :label="text.bank"
          :error="errors[`${account.key}-bank`]"
        >
          <input
            :id="f.id"
            v-model="account.bank"
            type="text"
            :placeholder="text.bankPlaceholder"
            :aria-describedby="f.describedBy"
            :aria-invalid="f.invalid"
          />
        </AdminField>
        <AdminField :id="`${account.key}-type`" v-slot="f" :label="text.accountType">
          <select :id="f.id" v-model="account.accountType">
            <option v-for="option in text.accountTypes" :key="option" :value="option">
              {{ option }}
            </option>
            <option
              v-if="account.accountType && !text.accountTypes.includes(account.accountType)"
              :value="account.accountType"
            >
              {{ account.accountType }}
            </option>
          </select>
        </AdminField>
        <AdminField
          v-for="item in textFields"
          :id="`${account.key}-${item.field}`"
          :key="item.field"
          v-slot="f"
          :label="item.label"
          :error="errors[`${account.key}-${item.field}`]"
        >
          <input
            :id="f.id"
            v-model="account[item.field]"
            type="text"
            autocomplete="off"
            :inputmode="item.inputmode"
            :aria-describedby="f.describedBy"
            :aria-invalid="f.invalid"
          />
        </AdminField>
      </div>
      <button type="button" class="banks__remove" @click="removing = index">
        <i class="fa-solid fa-trash-can" aria-hidden="true"></i>{{ text.bankRemove }}
        <span class="visually-hidden">{{ index + 1 }}</span>
      </button>
    </fieldset>

    <button type="button" class="banks__add" @click="add">
      <i class="fa-solid fa-plus" aria-hidden="true"></i>{{ text.bankAdd }}
    </button>

    <BaseModal
      :open="removing >= 0"
      :title="text.bankRemoveTitle"
      :message="text.bankRemoveMessage"
      :confirm-label="text.bankRemoveConfirm"
      danger
      @confirm="confirmRemove"
      @cancel="removing = -1"
    />
  </AdminSection>
</template>

<style scoped lang="scss">
.banks {
  &__empty {
    @include flex(row, flex-start, flex-start, 0.6rem);
    padding: 0.85rem 1rem;
    border: 1px solid $gold-deep;
    border-radius: $radius-sm;
    background: $gold-soft;
    color: darken($gold-deep, 24%);
    font-size: $text-sm;
    font-weight: 500;

    i {
      margin-top: 0.2rem;
    }
  }

  &__item {
    @include flex(column, stretch, flex-start, 0.75rem);
    min-width: 0;
    padding: 1rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $paper;
  }

  &__legend {
    @include eyebrow;
    padding: 0 0.4rem;
  }

  &__fields {
    @include flex-cards(12rem, 0.9rem);
  }

  &__remove {
    @include flex(row, center, center, 0.45rem);
    @include focus-ring($danger);
    align-self: flex-end;
    min-height: 2.75rem;
    padding: 0.4rem 0.9rem;
    border-radius: $radius-pill;
    color: $danger-text;
    font-size: $text-sm;
    font-weight: 600;

    &:hover {
      background: $danger-bg;
    }
  }

  &__add {
    @include flex(row, center, center, 0.5rem);
    @include transition(background-color);
    min-height: 3rem;
    border: 1px dashed $accent;
    border-radius: $radius-sm;
    color: $accent-deep;
    font-size: $text-sm;
    font-weight: 700;

    &:hover {
      background: $accent-soft;
    }
  }
}
</style>
