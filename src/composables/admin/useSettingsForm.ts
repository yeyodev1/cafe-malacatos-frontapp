import { computed, reactive, ref } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { adminService, type AdminSettings, type SettingsPayload } from '@/services/admin.service'
import { useSettingsStore } from '@/stores/settings'
import { useToastStore } from '@/stores/toast'
import type { ApiError } from '@/types'

export interface BankDraft {
  key: string
  id?: string
  bank: string
  accountType: string
  number: string
  holder: string
  idNumber: string
}

export interface SettingsForm {
  whatsapp: string
  contactEmail: string
  contactPhone: string
  social: { instagram: string; facebook: string; tiktok: string }
  bankAccounts: BankDraft[]
  transferInstructions: string
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const URL_START = /^https?:\/\/\S+$/i
const text = adminCopy.settings

let bankSeq = 0
export function blankBank(): BankDraft {
  bankSeq += 1
  return {
    key: `nueva-${bankSeq}`,
    bank: '',
    accountType: text.accountTypes[0] ?? '',
    number: '',
    holder: '',
    idNumber: '',
  }
}

/** Solo dígitos, con código de país y sin el 0 inicial: es lo que necesita wa.me. */
export function whatsappError(value: string): string {
  const number = value.trim()
  if (!number) return text.whatsappRequired
  if (!/^\d+$/.test(number)) return text.whatsappDigits
  if (number.startsWith('0')) return text.whatsappLeadingZero
  if (number.length < 11 || number.length > 13) return text.whatsappLength
  return ''
}

function toForm(settings: AdminSettings): SettingsForm {
  return {
    whatsapp: settings.whatsapp || '',
    contactEmail: settings.contactEmail || '',
    contactPhone: settings.contactPhone || '',
    social: {
      instagram: settings.social?.instagram || '',
      facebook: settings.social?.facebook || '',
      tiktok: settings.social?.tiktok || '',
    },
    bankAccounts: (settings.bankAccounts || []).map((account) => ({ key: account.id, ...account })),
    transferInstructions: settings.transferInstructions || '',
  }
}

export function useSettingsForm() {
  const toast = useToastStore()
  const form = reactive<SettingsForm>(toForm({} as AdminSettings))
  const snapshot = ref('')
  const errors = ref<Record<string, string>>({})
  const loading = ref(false)
  const loadError = ref('')
  const saving = ref(false)

  const dirty = computed(() => snapshot.value !== '' && JSON.stringify(form) !== snapshot.value)

  function fill(next: SettingsForm) {
    Object.assign(form, next)
    snapshot.value = JSON.stringify(form)
    errors.value = {}
  }

  async function load() {
    loading.value = true
    loadError.value = ''
    try {
      fill(toForm(await adminService.settings()))
    } catch (e) {
      loadError.value = (e as ApiError).message
    } finally {
      loading.value = false
    }
  }

  function discard() {
    if (snapshot.value) fill(JSON.parse(snapshot.value) as SettingsForm)
  }

  function validate(): SettingsPayload | null {
    const found: Record<string, string> = {}
    const whatsapp = whatsappError(form.whatsapp)
    if (whatsapp) found.whatsapp = whatsapp
    const email = form.contactEmail.trim()
    if (email && !EMAIL.test(email)) found.contactEmail = text.emailInvalid
    for (const network of ['instagram', 'facebook', 'tiktok'] as const) {
      const url = form.social[network].trim()
      if (url && !URL_START.test(url)) found[network] = text.urlInvalid
    }
    for (const account of form.bankAccounts) {
      for (const field of ['bank', 'number', 'holder', 'idNumber'] as const) {
        if (!account[field].trim()) found[`${account.key}-${field}`] = text.bankRequired
      }
    }
    errors.value = found
    if (Object.keys(found).length) return null

    return {
      whatsapp: form.whatsapp.trim(),
      contactEmail: email,
      contactPhone: form.contactPhone.trim(),
      social: {
        instagram: form.social.instagram.trim(),
        facebook: form.social.facebook.trim(),
        tiktok: form.social.tiktok.trim(),
      },
      bankAccounts: form.bankAccounts.map(({ key: _key, ...account }) => account),
      transferInstructions: form.transferInstructions.trim(),
    }
  }

  async function save() {
    if (saving.value) return
    const payload = validate()
    if (!payload) {
      toast.error(adminCopy.common.fixErrors)
      return
    }
    saving.value = true
    try {
      fill(toForm(await adminService.updateSettings(payload)))
      // La tienda pública lee estos datos de su store: se refresca para que
      // "Ver la tienda" ya muestre el WhatsApp y las cuentas nuevas.
      const publicStore = useSettingsStore()
      publicStore.loaded = false
      publicStore.load()
      toast.success(text.saved)
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  return { form, errors, loading, loadError, saving, dirty, load, save, discard }
}
