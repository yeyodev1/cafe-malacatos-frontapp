import { onBeforeUnmount, ref } from 'vue'
import { checkoutCopy } from '@/config/copy.checkout'
import { orderService } from '@/services/order.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Order } from '@/types'

// El backend acepta hasta 10 MB, pero una función de Vercel corta el cuerpo en
// 4.5 MB: por encima de 4 MB la subida fallaría sin un mensaje claro.
const MAX_BYTES = 4 * 1024 * 1024

/**
 * Comprobante de transferencia: valida que sea una imagen de tamaño razonable,
 * muestra la vista previa y la sube. `onUploaded` recibe la orden ya en
 * "por verificar".
 */
export function useProofUpload(
  target: () => { number: string; email: string },
  onUploaded: (order: Order) => void,
) {
  const toast = useToastStore()
  const text = checkoutCopy.proof

  const file = ref<File | null>(null)
  const previewUrl = ref('')
  const error = ref('')
  const uploading = ref(false)

  function releasePreview() {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }

  function clear() {
    releasePreview()
    file.value = null
  }

  function pick(event: Event) {
    const input = event.target as HTMLInputElement
    const chosen = input.files?.[0] ?? null
    // Se vacía para que elegir otra vez el mismo archivo vuelva a disparar `change`.
    input.value = ''
    if (!chosen) return

    error.value = ''
    clear()

    if (!chosen.type.startsWith('image/')) {
      error.value = text.notImage
      return
    }
    if (chosen.size > MAX_BYTES) {
      error.value = text.tooBig
      return
    }

    file.value = chosen
    previewUrl.value = URL.createObjectURL(chosen)
  }

  async function upload() {
    if (uploading.value || !file.value) return
    error.value = ''
    uploading.value = true
    try {
      const { number, email } = target()
      const order = await orderService.uploadProof(number, email, file.value)
      clear()
      toast.success(text.uploaded)
      onUploaded(order)
    } catch (e) {
      error.value = (e as ApiError).message
    } finally {
      uploading.value = false
    }
  }

  onBeforeUnmount(releasePreview)

  return { file, previewUrl, error, uploading, pick, upload }
}
