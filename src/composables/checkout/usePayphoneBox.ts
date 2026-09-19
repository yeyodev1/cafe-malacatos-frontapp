import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import type { PayphoneBoxConfig } from '@/types'

const BOX_CSS = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.css'
const BOX_JS = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.js'
/** Id del contenedor que Payphone busca al hacer `render`. */
export const BOX_CONTAINER_ID = 'pp-button'
// El formulario de Payphone vence a los 10 minutos.
const LIFETIME_MS = 10 * 60 * 1000
const GLOBAL_WAIT_MS = 4000

export interface PayphoneBuyer {
  email: string
  phoneNumber: string
  /** Vacío con consumidor final: no se inventa un documento. */
  documentId: string
}

export type BoxStatus = 'loading' | 'ready' | 'expired' | 'error'

// Una sola carga por visita, aunque el comprador genere varios intentos.
let assets: Promise<void> | null = null

function loadStyles() {
  if (document.querySelector(`link[href="${BOX_CSS}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = BOX_CSS
  document.head.appendChild(link)
}

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    // El bundle de Payphone es un módulo ES: sin type="module" no ejecuta.
    script.type = 'module'
    script.src = BOX_JS
    script.onload = () => resolve()
    script.onerror = () => {
      script.remove()
      reject(new Error('payphone-script'))
    }
    document.head.appendChild(script)
  })
}

/** El módulo deja `PPaymentButtonBox` en window; se espera un poco por si el onload se adelanta. */
async function waitForGlobal(): Promise<void> {
  const started = Date.now()
  while (typeof window.PPaymentButtonBox === 'undefined') {
    if (Date.now() - started > GLOBAL_WAIT_MS) throw new Error('payphone-global')
    await new Promise((resolve) => setTimeout(resolve, 80))
  }
}

function loadAssets(): Promise<void> {
  if (!assets) {
    loadStyles()
    assets = loadScript()
      .then(waitForGlobal)
      .catch((error) => {
        // Se permite reintentar: un fallo de red no debe quedar cacheado.
        assets = null
        throw error
      })
  }
  return assets
}

declare global {
  interface Window {
    PPaymentButtonBox?: typeof PPaymentButtonBox
  }
}

export function usePayphoneBox() {
  const status = ref<BoxStatus>('loading')
  const remainingMs = ref(LIFETIME_MS)

  let deadline = 0
  let ticker: ReturnType<typeof setInterval> | undefined

  const countdown = computed(() => {
    const seconds = Math.max(0, Math.ceil(remainingMs.value / 1000))
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
    const ss = String(seconds % 60).padStart(2, '0')
    return `${mm}:${ss}`
  })
  const isEnding = computed(() => remainingMs.value <= 60 * 1000)

  function clearBox() {
    const node = document.getElementById(BOX_CONTAINER_ID)
    if (node) node.innerHTML = ''
  }

  function stopTimer() {
    clearInterval(ticker)
    ticker = undefined
  }

  function tick() {
    // Contra la hora real y no restando por intervalo: una pestaña en segundo
    // plano frena los timers y el contador mentiría.
    remainingMs.value = Math.max(0, deadline - Date.now())
    if (remainingMs.value > 0) return
    stopTimer()
    clearBox()
    status.value = 'expired'
  }

  function startTimer() {
    // Reintentar la carga del script no regala tiempo: el plazo es del intento, no de la carga.
    if (deadline) return
    deadline = Date.now() + LIFETIME_MS
    remainingMs.value = LIFETIME_MS
    ticker = setInterval(tick, 1000)
  }

  /** Monta la Cajita. El contenedor debe estar ya en el DOM del componente. */
  async function mount(config: PayphoneBoxConfig, buyer: PayphoneBuyer) {
    status.value = 'loading'
    // El plazo corre desde que existe la orden, no desde que termina de cargar el script.
    startTimer()

    try {
      await loadAssets()
      await nextTick()
      // Si el plazo venció mientras cargaba el script, ya no se pinta un formulario muerto.
      if (status.value !== 'loading') return
      if (!document.getElementById(BOX_CONTAINER_ID) || !window.PPaymentButtonBox) {
        throw new Error('payphone-container')
      }
      clearBox()

      const box = new window.PPaymentButtonBox({
        token: config.token,
        clientTransactionId: config.clientTransactionId,
        amount: config.amount,
        amountWithoutTax: config.amountWithoutTax,
        currency: config.currency,
        storeId: config.storeId,
        reference: config.reference,
        lang: 'es',
        defaultMethod: 'card',
        timeZone: -5,
        email: buyer.email,
        phoneNumber: buyer.phoneNumber,
        ...(buyer.documentId ? { documentId: buyer.documentId } : {}),
      })
      box.render(BOX_CONTAINER_ID)
      if (status.value === 'loading') status.value = 'ready'
    } catch {
      if (status.value === 'loading') status.value = 'error'
    }
  }

  onBeforeUnmount(() => {
    stopTimer()
    clearBox()
  })

  return { status, countdown, isEnding, mount }
}
