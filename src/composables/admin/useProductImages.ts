import { ref, type Ref } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, ProductImage } from '@/types'

const MAX_BYTES = 10 * 1024 * 1024

/**
 * Fotos del producto. Se guardan al instante, aparte del formulario: si la
 * subida falla (el servicio de fotos caído responde 502) solo se muestra el
 * error aquí y lo escrito en el resto del formulario queda intacto.
 */
export function useProductImages(productId: Ref<string>, images: Ref<ProductImage[]>) {
  const text = adminCopy.images
  const toast = useToastStore()
  const uploading = ref(false)
  const removingId = ref('')
  const error = ref('')

  function explain(apiError: ApiError): string {
    // 502/503/504: el backend no pudo hablar con el servicio de fotos.
    if ([502, 503, 504].includes(apiError.status)) return `${apiError.message} ${text.serviceDown}`
    return apiError.message
  }

  async function upload(file: File | undefined) {
    if (!file || uploading.value) return
    error.value = ''
    if (!file.type.startsWith('image/')) {
      error.value = text.notImage
      return
    }
    if (file.size > MAX_BYTES) {
      error.value = text.tooBig
      return
    }
    uploading.value = true
    try {
      const product = await adminService.addProductImage(productId.value, file)
      images.value = product.images
      toast.success(text.uploaded)
    } catch (e) {
      error.value = explain(e as ApiError)
      toast.error(text.errorTitle)
    } finally {
      uploading.value = false
    }
  }

  async function remove(publicId: string) {
    if (removingId.value) return
    error.value = ''
    removingId.value = publicId
    try {
      const product = await adminService.removeProductImage(productId.value, publicId)
      images.value = product.images
      toast.success(text.removed)
    } catch (e) {
      error.value = explain(e as ApiError)
      toast.error((e as ApiError).message)
    } finally {
      removingId.value = ''
    }
  }

  return { uploading, removingId, error, upload, remove }
}
