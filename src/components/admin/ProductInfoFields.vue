<script setup lang="ts">
import { adminCopy } from '@/config/copy.admin'
import { site } from '@/config/site'
import AdminField from './AdminField.vue'
import AdminSection from './AdminSection.vue'
import AdminSwitch from './AdminSwitch.vue'
import type { ProductForm } from '@/composables/admin/useProductEditor'

// `form` es el objeto reactivo del editor: los campos escriben directo en él.
const text = adminCopy.product
defineProps<{ form: ProductForm; errors: Record<string, string> }>()
const emit = defineEmits<{ slugInput: [value: string]; slugRegenerate: [] }>()
</script>

<template>
  <AdminSection :title="text.sectionInfo" icon="fa-solid fa-circle-info">
    <div class="info">
      <AdminField id="product-name" v-slot="f" :label="text.name" :error="errors.name">
        <input
          :id="f.id"
          v-model="form.name"
          type="text"
          autocomplete="off"
          :placeholder="text.namePlaceholder"
          :aria-describedby="f.describedBy"
          :aria-invalid="f.invalid"
        />
      </AdminField>

      <AdminField
        id="product-slug"
        v-slot="f"
        :label="text.slug"
        :hint="text.slugHint"
        :error="errors.slug"
      >
        <div class="info__slug">
          <span class="info__prefix">{{ text.slugPrefix }}</span>
          <input
            :id="f.id"
            :value="form.slug"
            type="text"
            autocomplete="off"
            autocapitalize="none"
            spellcheck="false"
            :aria-describedby="f.describedBy"
            :aria-invalid="f.invalid"
            @input="emit('slugInput', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <button type="button" class="info__regen" @click="emit('slugRegenerate')">
          <i class="fa-solid fa-rotate" aria-hidden="true"></i>{{ text.slugRegenerate }}
        </button>
      </AdminField>

      <div class="info__pair">
        <AdminField id="product-category" v-slot="f" :label="text.category">
          <select :id="f.id" v-model="form.category">
            <option v-for="(label, key) in site.categories" :key="key" :value="key">
              {{ label }}
            </option>
          </select>
        </AdminField>
        <AdminField
          id="product-sort"
          v-slot="f"
          :label="text.sortOrder"
          :hint="text.sortOrderHint"
          :error="errors.sortOrder"
        >
          <input
            :id="f.id"
            v-model="form.sortOrder"
            type="text"
            inputmode="numeric"
            :aria-describedby="f.describedBy"
            :aria-invalid="f.invalid"
          />
        </AdminField>
      </div>

      <AdminField
        id="product-short"
        v-slot="f"
        :label="text.shortDescription"
        :hint="text.shortDescriptionHint"
      >
        <input
          :id="f.id"
          v-model="form.shortDescription"
          type="text"
          :aria-describedby="f.describedBy"
        />
      </AdminField>
      <AdminField
        id="product-description"
        v-slot="f"
        :label="text.description"
        :hint="text.descriptionHint"
      >
        <textarea
          :id="f.id"
          v-model="form.description"
          rows="5"
          :aria-describedby="f.describedBy"
        ></textarea>
      </AdminField>
      <AdminField id="product-usage" v-slot="f" :label="text.usage" :hint="text.usageHint">
        <textarea
          :id="f.id"
          v-model="form.usage"
          rows="2"
          :aria-describedby="f.describedBy"
        ></textarea>
      </AdminField>

      <div class="info__visibility" :class="{ 'info__visibility--on': form.isPublished }">
        <AdminSwitch
          v-model="form.isPublished"
          :label="text.visibility"
          :on-text="adminCopy.products.published"
          :off-text="adminCopy.products.draft"
        />
        <p>{{ form.isPublished ? text.visibilityOn : text.visibilityOff }}</p>
      </div>
    </div>
  </AdminSection>
</template>

<style scoped lang="scss">
.info {
  @include flex(column, stretch, flex-start, 1.1rem);

  &__pair {
    @include flex-cards(12rem, 1.1rem);
  }

  &__slug {
    @include flex(column, stretch, flex-start, 0.3rem);

    @include from('sm') {
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
    }
  }

  &__prefix {
    flex: 0 0 auto;
    color: $ink-muted;
    font-size: $text-sm;
  }

  &__regen {
    @include flex(row, center, flex-start, 0.45rem);
    @include focus-ring;
    align-self: flex-start;
    min-height: 2.75rem;
    color: $accent;
    font-size: $text-sm;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  &__visibility {
    @include flex(column, flex-start, flex-start, 0.2rem);
    padding: 0.8rem 1rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $paper;

    &--on {
      border-color: $success-text;
      background: $success-bg;
    }

    p {
      color: $ink-soft;
      font-size: $text-sm;
    }
  }
}
</style>
