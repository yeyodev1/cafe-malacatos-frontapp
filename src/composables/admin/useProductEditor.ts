import { computed, reactive, ref, watch, type Ref } from 'vue'
import { adminCopy } from '@/config/copy.admin'
import { adminService, type ProductPayload } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { centsToInput, dollarsToCents, isInvalid, parseInteger, slugify } from './adminFormat'
import type { ApiError, Product, ProductCategory, ProductImage } from '@/types'

export const NEW_PRODUCT_ID = 'nuevo'

/** Lo que se edita en pantalla: montos en dólares y números como texto, tal como se escriben. */
export interface VariantDraft {
  key: string
  id?: string
  label: string
  weightGrams: string
  price: string
  wholesalePrice: string
  wholesaleMinQty: string
  isActive: boolean
}

export interface ProductForm {
  name: string
  slug: string
  category: ProductCategory
  shortDescription: string
  description: string
  usage: string
  sortOrder: string
  isPublished: boolean
  variants: VariantDraft[]
}

let variantSeq = 0
export function blankVariant(): VariantDraft {
  variantSeq += 1
  return {
    key: `nueva-${variantSeq}`,
    label: '',
    weightGrams: '',
    price: '',
    wholesalePrice: '',
    wholesaleMinQty: '',
    isActive: true,
  }
}

function blankForm(): ProductForm {
  return {
    name: '',
    slug: '',
    category: 'cafe',
    shortDescription: '',
    description: '',
    usage: '',
    sortOrder: '0',
    isPublished: false,
    variants: [blankVariant()],
  }
}

function toForm(product: Product): ProductForm {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    usage: product.usage || '',
    sortOrder: String(product.sortOrder ?? 0),
    isPublished: product.isPublished,
    variants: product.variants.map((variant) => ({
      key: variant.id,
      id: variant.id,
      label: variant.label,
      weightGrams: String(variant.weightGrams ?? ''),
      price: centsToInput(variant.priceCents),
      wholesalePrice: centsToInput(variant.wholesalePriceCents),
      wholesaleMinQty: variant.wholesaleMinQty === null ? '' : String(variant.wholesaleMinQty),
      isActive: variant.isActive,
    })),
  }
}

/** Una presentación se vende en línea solo con peso y precio mayores a cero. */
export function variantSellable(variant: VariantDraft): boolean {
  const weight = parseInteger(variant.weightGrams)
  const price = dollarsToCents(variant.price)
  return Boolean(weight && weight > 0 && price && price > 0)
}

export function useProductEditor(id: Ref<string>) {
  const text = adminCopy.product
  const vText = adminCopy.variants
  const toast = useToastStore()

  const form = reactive<ProductForm>(blankForm())
  const images = ref<ProductImage[]>([])
  const savedName = ref('')
  const loading = ref(false)
  const loadError = ref('')
  const saving = ref(false)
  const errors = ref<Record<string, string>>({})
  const snapshot = ref('')
  // En un alta el slug sigue al nombre hasta que alguien lo toca a mano.
  const slugLinked = ref(true)

  const isNew = computed(() => id.value === NEW_PRODUCT_ID)
  const dirty = computed(() => snapshot.value !== '' && JSON.stringify(form) !== snapshot.value)
  const publishedUnsellable = computed(
    () => form.isPublished && !form.variants.some((v) => v.isActive && variantSellable(v)),
  )

  function fill(next: ProductForm) {
    Object.assign(form, next)
    snapshot.value = JSON.stringify(form)
    errors.value = {}
  }

  function applySaved(product: Product) {
    fill(toForm(product))
    images.value = product.images || []
    savedName.value = product.name
    slugLinked.value = false
  }

  async function load() {
    loadError.value = ''
    if (isNew.value) {
      fill(blankForm())
      images.value = []
      savedName.value = ''
      slugLinked.value = true
      return
    }
    loading.value = true
    try {
      applySaved(await adminService.product(id.value))
    } catch (e) {
      loadError.value = (e as ApiError).message
    } finally {
      loading.value = false
    }
  }

  watch(id, load, { immediate: true })
  watch(
    () => form.name,
    (name) => {
      if (slugLinked.value) form.slug = slugify(name)
    },
  )

  function onSlugInput(value: string) {
    slugLinked.value = false
    form.slug = value
  }

  function regenerateSlug() {
    form.slug = slugify(form.name)
  }

  function discard() {
    if (snapshot.value) fill(JSON.parse(snapshot.value) as ProductForm)
  }

  /** Valida y arma el cuerpo para el API; devuelve null si hay algo que corregir. */
  function buildPayload(): ProductPayload | null {
    const found: Record<string, string> = {}
    if (!form.name.trim()) found.name = text.nameRequired
    const slug = form.slug.trim()
    if (slug && slug !== slugify(slug)) found.slug = text.slugInvalid
    const sortOrder = parseInteger(form.sortOrder)
    if (isInvalid(sortOrder)) found.sortOrder = text.sortOrderInvalid

    const variants = form.variants.map((variant) => {
      const weight = parseInteger(variant.weightGrams)
      const price = dollarsToCents(variant.price)
      const wholesale = dollarsToCents(variant.wholesalePrice)
      const minQty = parseInteger(variant.wholesaleMinQty)
      if (!variant.label.trim()) found[`${variant.key}-label`] = vText.labelRequired
      if (isInvalid(weight)) found[`${variant.key}-weight`] = vText.invalidInt
      if (isInvalid(price)) found[`${variant.key}-price`] = vText.invalidMoney
      if (isInvalid(wholesale)) found[`${variant.key}-wholesale`] = vText.invalidMoney
      if (isInvalid(minQty) || minQty === 0) found[`${variant.key}-minqty`] = vText.invalidQty
      return {
        ...(variant.id ? { id: variant.id } : {}),
        label: variant.label.trim(),
        weightGrams: weight ?? 0,
        priceCents: price ?? 0,
        wholesalePriceCents: wholesale,
        wholesaleMinQty: minQty,
        isActive: variant.isActive,
      }
    })

    errors.value = found
    if (Object.keys(found).length) return null
    return {
      name: form.name.trim(),
      slug,
      category: form.category,
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      usage: form.usage.trim(),
      sortOrder: sortOrder ?? 0,
      isPublished: form.isPublished,
      variants,
    }
  }

  /** Devuelve el producto guardado, o null si no se pudo (validación o error del API). */
  async function save(): Promise<Product | null> {
    if (saving.value) return null
    const payload = buildPayload()
    if (!payload) {
      toast.error(adminCopy.common.fixErrors)
      return null
    }
    saving.value = true
    try {
      const product = isNew.value
        ? await adminService.createProduct(payload)
        : await adminService.updateProduct(id.value, payload)
      applySaved(product)
      toast.success(isNew.value ? text.created : text.saved)
      return product
    } catch (e) {
      toast.error((e as ApiError).message)
      return null
    } finally {
      saving.value = false
    }
  }

  async function remove(): Promise<boolean> {
    if (saving.value || isNew.value) return false
    saving.value = true
    try {
      await adminService.deleteProduct(id.value)
      toast.success(text.deleted(savedName.value))
      snapshot.value = JSON.stringify(form)
      return true
    } catch (e) {
      toast.error((e as ApiError).message)
      return false
    } finally {
      saving.value = false
    }
  }

  return {
    form,
    images,
    savedName,
    isNew,
    loading,
    loadError,
    saving,
    errors,
    dirty,
    publishedUnsellable,
    load,
    save,
    remove,
    discard,
    onSlugInput,
    regenerateSlug,
  }
}
