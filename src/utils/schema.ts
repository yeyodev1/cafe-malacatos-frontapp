import { site } from '@/config/site'
import { copy } from '@/config/copy'
import { centsToDecimal } from './money'
import { activeVariants } from './product'
import type { Product } from '@/types'

/**
 * Datos estructurados (schema.org) para buscadores y asistentes de IA.
 * Solo se publica lo que está en site.ts o llega del API: nada inventado.
 */
const ORG_ID = `${site.url}/#organization`
const SITE_ID = `${site.url}/#website`

interface Contact {
  phone: string
  email: string
  sameAs: string[]
}

/** "0985 366 039" → "+593985366039". Si ya viene con código de país, se respeta. */
export function toInternationalPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('593')) return `+${digits}`
  return `+593${digits.replace(/^0/, '')}`
}

function postalAddress(lines: readonly string[], locality: string) {
  return {
    '@type': 'PostalAddress',
    streetAddress: lines.join(', '),
    addressLocality: locality,
    addressRegion: copy.seo.region,
    addressCountry: copy.seo.country,
  }
}

export function homeSchema(contact: Contact) {
  const telephone = toInternationalPhone(contact.phone)
  const { factory, branches } = site.locations

  const organization = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.name,
    url: site.url,
    slogan: site.tagline,
    description: site.description,
    email: contact.email,
    telephone,
    sameAs: contact.sameAs,
    address: postalAddress(factory.lines, copy.seo.factoryLocality),
    areaServed: { '@type': 'Country', name: 'Ecuador' },
  }

  const places = [
    {
      name: `${site.name} — ${factory.title}`,
      lines: factory.lines as readonly string[],
      locality: copy.seo.factoryLocality as string,
    },
    ...branches.lines.map((line) => ({
      name: `${site.name} — ${line}`,
      lines: [line] as readonly string[],
      locality: copy.seo.branchLocality as string,
    })),
  ].map((place, index) => ({
    '@type': 'LocalBusiness',
    '@id': `${site.url}/#local-${index + 1}`,
    name: place.name,
    url: site.url,
    telephone,
    email: contact.email,
    image: `${site.url}/og.png`,
    address: postalAddress(place.lines, place.locality),
    parentOrganization: { '@id': ORG_ID },
  }))

  const website = {
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: 'es-EC',
    publisher: { '@id': ORG_ID },
  }

  return { '@context': 'https://schema.org', '@graph': [organization, ...places, website] }
}

export function productSchema(product: Product) {
  const url = `${site.url}/producto/${product.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description: product.shortDescription || product.description,
    category: site.categories[product.category] ?? product.category,
    url,
    image: product.images.map((image) => image.url),
    brand: { '@type': 'Brand', name: site.name },
    offers: activeVariants(product).map((variant) => ({
      '@type': 'Offer',
      name: `${product.name} — ${variant.label}`,
      sku: variant.id,
      url,
      priceCurrency: 'USD',
      price: centsToDecimal(variant.priceCents),
      availability: variant.isActive
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': ORG_ID },
    })),
  }
}

export function shopSchema(products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${copy.seo.shopTitle} — ${site.name}`,
    url: `${site.url}/tienda`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      url: `${site.url}/producto/${product.slug}`,
    })),
  }
}
