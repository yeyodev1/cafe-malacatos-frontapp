<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { adminCopy } from '@/config/copy.admin'
import { useProductEditor } from '@/composables/admin/useProductEditor'
import { useUnsavedGuard } from '@/composables/admin/useUnsavedGuard'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminSection from '@/components/admin/AdminSection.vue'
import AdminLoading from '@/components/admin/AdminLoading.vue'
import AdminSaveBar from '@/components/admin/AdminSaveBar.vue'
import AdminLeaveModal from '@/components/admin/AdminLeaveModal.vue'
import ProductInfoFields from '@/components/admin/ProductInfoFields.vue'
import ProductVariantsEditor from '@/components/admin/ProductVariantsEditor.vue'
import ProductImagesEditor from '@/components/admin/ProductImagesEditor.vue'
import ProductDeleteModal from '@/components/admin/ProductDeleteModal.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const text = adminCopy.product
const common = adminCopy.common
const route = useRoute()
const id = computed(() => String(route.params.id))

const editor = useProductEditor(id)
const { form, images, savedName, isNew, loading, loadError, saving, errors, dirty } = editor
const guard = useUnsavedGuard(dirty)
const deleting = ref(false)

const title = computed(() => (isNew.value ? text.newTitle : savedName.value || text.editTitle))

async function save() {
  const wasNew = isNew.value
  const product = await editor.save()
  // Tras crear, la misma pantalla pasa a ser la de edición: ya se pueden subir fotos.
  if (product && wasNew) await guard.bypass(`/admin/productos/${product.id}`, true)
}

async function remove() {
  deleting.value = false
  if (await editor.remove()) await guard.bypass('/admin/productos', true)
}
</script>

<template>
  <div class="product-edit">
    <AdminPageHeader
      :eyebrow="isNew ? undefined : text.editTitle"
      :title="title"
      back-to="/admin/productos"
      :back-label="text.back"
    />

    <AdminLoading v-if="loading" />
    <StateBlock
      v-else-if="loadError"
      tone="error"
      icon="fa-solid fa-triangle-exclamation"
      :title="text.notFoundTitle"
      :text="loadError"
    >
      <button type="button" class="btn btn--dark" @click="editor.load()">{{ common.retry }}</button>
    </StateBlock>

    <form v-else class="product-edit__form" novalidate @submit.prevent="save">
      <p v-if="editor.publishedUnsellable.value" class="product-edit__warn" role="status">
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>{{ text.publishWarning }}
      </p>

      <ProductInfoFields
        :form="form"
        :errors="errors"
        @slug-input="editor.onSlugInput"
        @slug-regenerate="editor.regenerateSlug"
      />
      <ProductVariantsEditor :variants="form.variants" :errors="errors" />
      <ProductImagesEditor
        v-model:images="images"
        :product-id="id"
        :product-name="savedName"
        :is-new="isNew"
      />

      <AdminSection v-if="!isNew" tone="danger" :title="text.dangerTitle" :lead="text.dangerText">
        <button type="button" class="btn btn--danger product-edit__delete" @click="deleting = true">
          <i class="fa-solid fa-trash-can" aria-hidden="true"></i>{{ text.delete }}
        </button>
      </AdminSection>

      <AdminSaveBar
        :dirty="dirty"
        :saving="saving"
        :always="isNew"
        :save-label="isNew ? text.create : undefined"
        @save="save"
        @discard="editor.discard"
      />
    </form>

    <AdminLeaveModal :open="guard.asking.value" @stay="guard.stay" @leave="guard.leave" />
    <ProductDeleteModal
      :open="deleting"
      :name="savedName"
      @confirm="remove"
      @cancel="deleting = false"
    />
  </div>
</template>

<style scoped lang="scss">
.product-edit {
  @include flex(column, stretch, flex-start);

  &__form {
    @include flex(column, stretch, flex-start, 1.25rem);
  }

  &__warn {
    @include flex(row, flex-start, flex-start, 0.6rem);
    padding: 0.85rem 1rem;
    border: 1px solid $gold-deep;
    border-radius: $radius-sm;
    background: $gold-soft;
    color: darken($gold-deep, 24%);
    font-size: $text-sm;
    font-weight: 600;

    i {
      margin-top: 0.2rem;
    }
  }

  &__delete {
    min-height: 3rem;

    @include from('sm') {
      align-self: flex-start;
    }
  }
}
</style>
