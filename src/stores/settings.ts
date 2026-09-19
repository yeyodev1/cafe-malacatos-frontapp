import { defineStore } from 'pinia'
import { settingsService } from '@/services/settings.service'
import { site } from '@/config/site'
import type { PublicSettings } from '@/types'

let pending: Promise<void> | null = null

/** Si el admin dejó un campo vacío, se conserva el respaldo de site.ts. */
function pick(value: string | undefined | null, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // Respaldo de site.ts: la web se ve completa aunque el API esté apagado.
    whatsapp: site.whatsapp as string,
    contactEmail: site.email as string,
    contactPhone: site.phone as string,
    social: { ...site.social } as PublicSettings['social'],
    bankAccounts: [] as PublicSettings['bankAccounts'],
    transferInstructions: '',
    transferEnabled: false,
    loaded: false,
  }),

  getters: {
    socialLinks: (s) =>
      [
        {
          key: 'facebook',
          label: 'Facebook',
          icon: 'fa-brands fa-facebook-f',
          url: s.social.facebook,
        },
        {
          key: 'instagram',
          label: 'Instagram',
          icon: 'fa-brands fa-instagram',
          url: s.social.instagram,
        },
        { key: 'tiktok', label: 'TikTok', icon: 'fa-brands fa-tiktok', url: s.social.tiktok },
      ].filter((item) => Boolean(item.url)),
  },

  actions: {
    /** Carga /settings/public una sola vez por visita; las llamadas concurrentes comparten la promesa. */
    load(): Promise<void> {
      if (this.loaded) return Promise.resolve()
      if (pending) return pending

      pending = settingsService
        .getPublic()
        .then((data) => {
          this.whatsapp = pick(data.whatsapp, site.whatsapp).replace(/\D/g, '')
          this.contactEmail = pick(data.contactEmail, site.email)
          this.contactPhone = pick(data.contactPhone, site.phone)
          this.social = {
            instagram: pick(data.social?.instagram, site.social.instagram),
            facebook: pick(data.social?.facebook, site.social.facebook),
            tiktok: pick(data.social?.tiktok, site.social.tiktok),
          }
          this.bankAccounts = Array.isArray(data.bankAccounts) ? data.bankAccounts : []
          this.transferInstructions = data.transferInstructions || ''
          this.transferEnabled = Boolean(data.transferEnabled)
          this.loaded = true
        })
        .catch(() => {
          // Backend apagado: se queda el respaldo y se reintenta en la próxima visita.
        })
        .finally(() => {
          pending = null
        })

      return pending
    },
  },
})
