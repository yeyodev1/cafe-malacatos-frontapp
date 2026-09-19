import { computed, reactive, ref } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { adminService, type ZonePayload } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { formatCents } from '@/utils/money'
import {
  centsToInput,
  dollarsToCents,
  isInvalid,
  parseDecimal,
  shippingCostCents,
} from './adminFormat'
import type { ApiError, ShippingZone } from '@/types'

/** Una provincia tal como se edita: montos en dólares y como texto. */
export interface ZoneDraft {
  id: string
  province: string
  base: string
  includedKg: string
  extra: string
  isActive: boolean
}

export type ZoneErrors = Partial<Record<'base' | 'includedKg' | 'extra', string>>

function toDraft(zone: ShippingZone): ZoneDraft {
  return {
    id: zone.id,
    province: zone.province,
    base: centsToInput(zone.baseCents),
    includedKg: String(zone.includedKg ?? 0),
    extra: centsToInput(zone.extraPerKgCents ?? 0),
    isActive: zone.isActive,
  }
}

const text = adminCopy.shipping

export function zoneErrors(draft: Pick<ZoneDraft, 'base' | 'includedKg' | 'extra'>): ZoneErrors {
  const errors: ZoneErrors = {}
  if (isInvalid(dollarsToCents(draft.base))) errors.base = text.invalidMoney
  const included = parseDecimal(draft.includedKg)
  if (included === null || isInvalid(included)) errors.includedKg = text.invalidKg
  const extra = dollarsToCents(draft.extra)
  if (extra === null || isInvalid(extra)) errors.extra = text.invalidMoney
  return errors
}

function toPayload(draft: ZoneDraft): ZonePayload {
  return {
    // Vacío = sin tarifa: esa provincia solo cierra pedidos por WhatsApp.
    baseCents: dollarsToCents(draft.base),
    includedKg: parseDecimal(draft.includedKg) ?? 0,
    extraPerKgCents: dollarsToCents(draft.extra) ?? 0,
    isActive: draft.isActive,
  }
}

export function useShippingZones() {
  const toast = useToastStore()
  const drafts = ref<ZoneDraft[]>([])
  const saved = ref<Record<string, string>>({})
  const failedIds = ref<string[]>([])
  const loading = ref(false)
  const loadError = ref('')
  const saving = ref(false)

  const bulk = reactive({ base: '', includedKg: '1', extra: '0.00' })
  const example = reactive({ province: '', kg: '2' })

  const isDirty = (draft: ZoneDraft) => saved.value[draft.id] !== JSON.stringify(draft)
  const dirtyDrafts = computed(() => drafts.value.filter(isDirty))
  const dirty = computed(() => dirtyDrafts.value.length > 0)
  const withoutRate = computed(() => drafts.value.filter((draft) => !draft.base.trim()))
  const bulkErrors = computed(() => zoneErrors(bulk))

  function remember(list: ZoneDraft[]) {
    saved.value = Object.fromEntries(list.map((draft) => [draft.id, JSON.stringify(draft)]))
  }

  async function load() {
    loading.value = true
    loadError.value = ''
    try {
      const zones = await adminService.shippingZones()
      drafts.value = zones.map(toDraft)
      remember(drafts.value)
      failedIds.value = []
      if (!example.province) {
        example.province =
          zones.find((z) => z.province === 'Loja')?.province || zones[0]?.province || ''
      }
    } catch (e) {
      loadError.value = (e as ApiError).message
    } finally {
      loading.value = false
    }
  }

  function discard() {
    drafts.value = drafts.value.map((draft) => {
      const original = saved.value[draft.id]
      return original ? (JSON.parse(original) as ZoneDraft) : draft
    })
    failedIds.value = []
  }

  /** Rellena (sin guardar todavía) las provincias sin tarifa: la dueña revisa y luego guarda. */
  function applyBulk() {
    if (!bulk.base.trim()) {
      toast.error(text.bulkNeedsBase)
      return
    }
    if (Object.keys(bulkErrors.value).length) {
      toast.error(adminCopy.common.fixErrors)
      return
    }
    const targets = withoutRate.value
    for (const draft of targets) {
      draft.base = bulk.base.trim()
      draft.includedKg = bulk.includedKg.trim()
      draft.extra = bulk.extra.trim()
    }
    toast.info(text.bulkApplied(targets.length))
  }

  async function saveAll() {
    if (saving.value || !dirty.value) return
    const pending = dirtyDrafts.value
    if (pending.some((draft) => Object.keys(zoneErrors(draft)).length)) {
      toast.error(adminCopy.common.fixErrors)
      return
    }
    saving.value = true
    failedIds.value = []
    let ok = 0
    let lastError = ''
    // De una en una: son pocas y así un fallo no deja a medias a las demás.
    for (const draft of pending) {
      try {
        const zone = await adminService.updateShippingZone(draft.id, toPayload(draft))
        Object.assign(draft, toDraft(zone))
        saved.value[draft.id] = JSON.stringify(draft)
        ok += 1
      } catch (e) {
        failedIds.value.push(draft.id)
        lastError = (e as ApiError).message
      }
    }
    saving.value = false
    if (!failedIds.value.length) toast.success(text.saved(ok))
    else toast.error(`${text.partial(ok, failedIds.value.length)} ${lastError}`)
  }

  /** El ejemplo usa lo que está escrito ahora mismo, guardado o no. */
  const exampleResult = computed(() => {
    const draft = drafts.value.find((item) => item.province === example.province)
    const kg = parseDecimal(example.kg)
    if (!draft || kg === null || isInvalid(kg)) return null
    if (!draft.isActive)
      return { ok: false, main: text.exampleInactive(draft.province), detail: '' }
    const base = dollarsToCents(draft.base)
    if (base === null) return { ok: false, main: text.exampleNoRate(draft.province), detail: '' }
    const included = parseDecimal(draft.includedKg)
    const extra = dollarsToCents(draft.extra)
    if (
      isInvalid(base) ||
      included === null ||
      isInvalid(included) ||
      extra === null ||
      isInvalid(extra)
    ) {
      return null
    }
    const { totalCents, extraKg } = shippingCostCents(base, included, extra, kg)
    return {
      ok: true,
      main: text.exampleResult(example.kg.trim(), draft.province, formatCents(totalCents)),
      detail: text.exampleBreakdown(formatCents(base), extraKg, formatCents(extra)),
    }
  })

  return {
    drafts,
    loading,
    loadError,
    saving,
    dirty,
    dirtyDrafts,
    failedIds,
    withoutRate,
    bulk,
    bulkErrors,
    example,
    exampleResult,
    isDirty,
    load,
    discard,
    applyBulk,
    saveAll,
  }
}
