import { ref } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { useToastStore } from '@/stores/toast'

/**
 * Copiar al portapapeles con respaldo: en http (túnel de pruebas) o navegadores
 * viejos no existe navigator.clipboard, y la factura se llena copiando datos.
 */
async function writeText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // cae al respaldo
  }
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  area.remove()
  return ok
}

export function useCopyText() {
  const toast = useToastStore()
  const copiedKey = ref('')
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copyText(key: string, text: string) {
    const ok = await writeText(text)
    if (!ok) {
      toast.error(adminCopy.common.copyFailed)
      return
    }
    copiedKey.value = key
    clearTimeout(timer)
    timer = setTimeout(() => (copiedKey.value = ''), 1800)
  }

  return { copiedKey, copyText }
}
