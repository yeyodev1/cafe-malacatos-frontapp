<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { useSettingsForm, whatsappError } from '@/composables/admin/useSettingsForm'
import { useUnsavedGuard } from '@/composables/admin/useUnsavedGuard'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminSection from '@/components/admin/AdminSection.vue'
import AdminField from '@/components/admin/AdminField.vue'
import AdminLoading from '@/components/admin/AdminLoading.vue'
import AdminSaveBar from '@/components/admin/AdminSaveBar.vue'
import AdminLeaveModal from '@/components/admin/AdminLeaveModal.vue'
import BankAccountsEditor from '@/components/admin/BankAccountsEditor.vue'
import StateBlock from '@/components/ui/StateBlock.vue'

const text = adminCopy.settings
const common = adminCopy.common
const settings = useSettingsForm()
const { form, errors, loading, loadError, saving, dirty } = settings
const guard = useUnsavedGuard(dirty)

// El error del WhatsApp se ve mientras se escribe: es el dato que más se equivoca.
const whatsappLive = computed(() =>
  dirty.value || errors.value.whatsapp ? whatsappError(form.whatsapp) : '',
)
const whatsappTest = computed(() =>
  whatsappError(form.whatsapp) ? '' : `https://wa.me/${form.whatsapp.trim()}`,
)

const networks = [
  { key: 'instagram', label: text.instagram, icon: 'fa-brands fa-instagram' },
  { key: 'facebook', label: text.facebook, icon: 'fa-brands fa-facebook-f' },
  { key: 'tiktok', label: text.tiktok, icon: 'fa-brands fa-tiktok' },
] as const

onMounted(settings.load)
</script>

<template>
  <div class="settings">
    <AdminPageHeader :title="text.title" :lead="text.lead" />

    <AdminLoading v-if="loading" />
    <StateBlock
      v-else-if="loadError"
      tone="error"
      icon="fa-solid fa-triangle-exclamation"
      :title="common.errorTitle"
      :text="loadError"
    >
      <button type="button" class="btn btn--dark" @click="settings.load()">
        {{ common.retry }}
      </button>
    </StateBlock>

    <form v-else class="settings__form" novalidate @submit.prevent="settings.save">
      <AdminSection :title="text.contactTitle" icon="fa-solid fa-address-book">
        <AdminField
          id="set-whatsapp"
          v-slot="f"
          :label="text.whatsapp"
          :hint="text.whatsappHint"
          :error="whatsappLive"
        >
          <input
            :id="f.id"
            v-model="form.whatsapp"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder="593985366039"
            :aria-describedby="f.describedBy"
            :aria-invalid="f.invalid"
          />
        </AdminField>
        <a
          v-if="whatsappTest"
          :href="whatsappTest"
          target="_blank"
          rel="noopener"
          class="settings__test"
        >
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>{{ text.whatsappTest }}
        </a>

        <div class="settings__pair">
          <AdminField
            id="set-email"
            v-slot="f"
            :label="text.contactEmail"
            :error="errors.contactEmail"
          >
            <input
              :id="f.id"
              v-model="form.contactEmail"
              type="email"
              autocomplete="off"
              :aria-describedby="f.describedBy"
              :aria-invalid="f.invalid"
            />
          </AdminField>
          <AdminField
            id="set-phone"
            v-slot="f"
            :label="text.contactPhone"
            :hint="text.contactPhoneHint"
          >
            <input
              :id="f.id"
              v-model="form.contactPhone"
              type="tel"
              autocomplete="off"
              :aria-describedby="f.describedBy"
            />
          </AdminField>
        </div>
      </AdminSection>

      <AdminSection
        :title="text.socialTitle"
        :lead="text.socialLead"
        icon="fa-solid fa-share-nodes"
      >
        <AdminField
          v-for="network in networks"
          :id="`set-${network.key}`"
          :key="network.key"
          v-slot="f"
          :label="network.label"
          :error="errors[network.key]"
        >
          <input
            :id="f.id"
            v-model="form.social[network.key]"
            type="url"
            inputmode="url"
            autocomplete="off"
            placeholder="https://"
            :aria-describedby="f.describedBy"
            :aria-invalid="f.invalid"
          />
        </AdminField>
      </AdminSection>

      <BankAccountsEditor :accounts="form.bankAccounts" :errors="errors" />

      <AdminSection :title="text.instructionsTitle" icon="fa-solid fa-circle-info">
        <AdminField
          id="set-instructions"
          v-slot="f"
          :label="text.instructions"
          :hint="text.instructionsHint"
        >
          <textarea
            :id="f.id"
            v-model="form.transferInstructions"
            rows="4"
            :aria-describedby="f.describedBy"
          ></textarea>
        </AdminField>
      </AdminSection>

      <AdminSaveBar
        :dirty="dirty"
        :saving="saving"
        @save="settings.save"
        @discard="settings.discard"
      />
    </form>

    <AdminLeaveModal :open="guard.asking.value" @stay="guard.stay" @leave="guard.leave" />
  </div>
</template>

<style scoped lang="scss">
.settings {
  @include flex(column, stretch, flex-start);

  &__form {
    @include flex(column, stretch, flex-start, 1.25rem);
  }

  &__pair {
    @include flex-cards(14rem, 1.1rem);
  }

  &__test {
    @include flex(row, center, flex-start, 0.5rem);
    @include focus-ring($whatsapp);
    align-self: flex-start;
    min-height: 2.75rem;
    color: $whatsapp-deep;
    font-size: $text-sm;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;

    i {
      font-size: 1.15rem;
    }
  }
}
</style>
