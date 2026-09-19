<script setup lang="ts">
import { adminCopy } from '@/config/copy.admin'
import {
  blankVariant,
  variantSellable,
  type VariantDraft,
} from '@/composables/admin/useProductEditor'
import AdminField from './AdminField.vue'
import AdminMoneyInput from './AdminMoneyInput.vue'
import AdminSection from './AdminSection.vue'
import AdminSwitch from './AdminSwitch.vue'

// `variants` es la lista reactiva del editor: agregar, quitar y escribir la cambian directo.
const text = adminCopy.variants
const props = defineProps<{ variants: VariantDraft[]; errors: Record<string, string> }>()

function add() {
  props.variants.push(blankVariant())
}

function remove(index: number) {
  props.variants.splice(index, 1)
}
</script>

<template>
  <AdminSection :title="text.title" :lead="text.lead" icon="fa-solid fa-tags">
    <p v-if="!variants.length" class="variants__empty">{{ text.empty }}</p>

    <fieldset v-for="(variant, index) in variants" :key="variant.key" class="variants__item">
      <legend class="variants__legend">{{ text.item }} {{ index + 1 }}</legend>

      <div class="variants__fields">
        <AdminField
          :id="`${variant.key}-label`"
          v-slot="f"
          class="variants__wide"
          :label="text.label"
          :error="errors[`${variant.key}-label`]"
        >
          <input
            :id="f.id"
            v-model="variant.label"
            type="text"
            autocomplete="off"
            :placeholder="text.labelPlaceholder"
            :aria-describedby="f.describedBy"
            :aria-invalid="f.invalid"
          />
        </AdminField>
        <AdminField
          :id="`${variant.key}-weight`"
          v-slot="f"
          :label="text.weight"
          :hint="text.weightHint"
          :error="errors[`${variant.key}-weight`]"
        >
          <input
            :id="f.id"
            v-model="variant.weightGrams"
            type="text"
            inputmode="numeric"
            placeholder="454"
            :aria-describedby="f.describedBy"
            :aria-invalid="f.invalid"
          />
        </AdminField>
        <AdminField
          :id="`${variant.key}-price`"
          v-slot="f"
          :label="text.price"
          :error="errors[`${variant.key}-price`]"
        >
          <AdminMoneyInput
            :id="f.id"
            v-model="variant.price"
            :described-by="f.describedBy"
            :invalid="f.invalid"
          />
        </AdminField>
        <AdminField
          :id="`${variant.key}-wholesale`"
          v-slot="f"
          :label="text.wholesalePrice"
          :optional="text.optional"
          :hint="text.wholesaleHint"
          :error="errors[`${variant.key}-wholesale`]"
        >
          <AdminMoneyInput
            :id="f.id"
            v-model="variant.wholesalePrice"
            :described-by="f.describedBy"
            :invalid="f.invalid"
          />
        </AdminField>
        <AdminField
          :id="`${variant.key}-minqty`"
          v-slot="f"
          :label="text.wholesaleMinQty"
          :optional="text.optional"
          :error="errors[`${variant.key}-minqty`]"
        >
          <input
            :id="f.id"
            v-model="variant.wholesaleMinQty"
            type="text"
            inputmode="numeric"
            placeholder="12"
            :aria-describedby="f.describedBy"
            :aria-invalid="f.invalid"
          />
        </AdminField>
      </div>

      <p v-if="!variantSellable(variant)" class="variants__warn" role="status">
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>{{ text.notSellable }}
      </p>

      <div class="variants__foot">
        <AdminSwitch
          v-model="variant.isActive"
          :label="text.activeLabel"
          :on-text="adminCopy.common.yes"
          :off-text="adminCopy.common.no"
        />
        <button
          type="button"
          class="variants__remove"
          :aria-label="text.removeLabel(variant.label)"
          @click="remove(index)"
        >
          <i class="fa-solid fa-trash-can" aria-hidden="true"></i>{{ text.remove }}
        </button>
      </div>
    </fieldset>

    <button type="button" class="variants__add" @click="add">
      <i class="fa-solid fa-plus" aria-hidden="true"></i>{{ text.add }}
    </button>
  </AdminSection>
</template>

<style scoped lang="scss">
.variants {
  &__empty {
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__item {
    @include flex(column, stretch, flex-start, 0.9rem);
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
    @include flex-cards(10.5rem, 0.9rem);
  }

  &__wide {
    flex-basis: 100% !important;
  }

  &__warn {
    @include flex(row, flex-start, flex-start, 0.55rem);
    padding: 0.7rem 0.85rem;
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

  &__foot {
    @include flex(row, center, space-between, 0.5rem);
    flex-wrap: wrap;
  }

  &__remove {
    @include flex(row, center, center, 0.45rem);
    @include focus-ring($danger);
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
