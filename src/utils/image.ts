/**
 * Las fotos viven en Cloudinary: pedirlas al ancho que se van a pintar, en el
 * formato que el navegador prefiera, ahorra la mayor parte del peso de la página.
 * Si la URL no es de Cloudinary se devuelve intacta.
 */
const UPLOAD_SEGMENT = '/image/upload/'

export function cldUrl(url: string, width: number): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes(UPLOAD_SEGMENT)) return url
  return url.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}f_auto,q_auto,c_limit,w_${width}/`)
}

export function cldSrcset(url: string, widths: number[]): string | undefined {
  if (!url || !url.includes('res.cloudinary.com')) return undefined
  return widths.map((w) => `${cldUrl(url, w)} ${w}w`).join(', ')
}
