import { onBeforeUnmount, watchEffect } from 'vue'
import { site } from '@/config/site'

export interface SeoInput {
  /** Se pinta como "Título — Café Malacatos". Sin título queda el nombre con el lema. */
  title?: string
  description?: string
  /** Ruta canónica, sin dominio: "/tienda". */
  path?: string
  image?: string
  type?: 'website' | 'product'
  /** Carrito, cuenta y acceso no deben indexarse. */
  noindex?: boolean
  jsonLd?: object | null
}

const JSONLD_ID = 'seo-jsonld'
const DEFAULT_TITLE = `${site.name} — ${site.tagline}`
const DEFAULT_IMAGE = `${site.url}/og.png`

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function removeNode(selector: string) {
  document.head.querySelector(selector)?.remove()
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

function setJsonLd(data: object | null | undefined) {
  removeNode(`#${JSONLD_ID}`)
  if (!data) return
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = JSONLD_ID
  // "<" escapado: un texto de producto no puede cerrar la etiqueta script.
  script.textContent = JSON.stringify(data).replace(/</g, '\\u003c')
  document.head.appendChild(script)
}

function apply(input: SeoInput, withTitle: boolean) {
  const title = input.title ? `${input.title} — ${site.name}` : DEFAULT_TITLE
  const description = input.description || site.description
  const url = `${site.url}${input.path && input.path !== '/' ? input.path : ''}`

  if (withTitle) document.title = title
  setMeta('name', 'description', description)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:type', input.type || 'website')
  setMeta('property', 'og:image', input.image || DEFAULT_IMAGE)
  setCanonical(url)

  if (input.noindex) setMeta('name', 'robots', 'noindex, nofollow')
  else removeNode('meta[name="robots"]')

  setJsonLd(input.jsonLd)
}

/**
 * Metadatos por vista. Recibe una función para que se recalculen solos cuando
 * llegan los datos (el producto, el catálogo).
 *
 * Al desmontar se vuelve a los valores por defecto y se quita el JSON-LD, así
 * una vista sin useSeo no hereda los datos de la anterior. El título no se toca
 * en la limpieza: para entonces el router ya puso el de la ruta nueva.
 */
export function useSeo(input: () => SeoInput) {
  const stop = watchEffect(() => apply(input(), true))

  onBeforeUnmount(() => {
    stop()
    apply({}, false)
    removeNode('link[rel="canonical"]')
  })
}
