/**
 * El copy es configuración: todos los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan.
 *
 * Los textos de marca salen del brochure oficial del cliente. WhatsApp, redes y
 * cuentas bancarias que se editan desde el admin llegan por /settings/public;
 * lo de acá es el respaldo mientras esa respuesta carga.
 */
export const site = {
  name: 'Café Malacatos',
  tagline: 'El primero en aroma y sabor',
  description:
    'Café tostado y molido 100% lojano, panela, sango, siete harinas y pasta de maní. Compra en línea con envío a todo Ecuador.',
  url: 'https://cafemalacatos.com',
  email: 'sandritagj12@hotmail.com',
  // Solo dígitos con código de país. Número de pedidos del brochure; por confirmar con el cliente.
  whatsapp: '593985366039',
  phone: '0985 366 039',
  social: {
    instagram: '',
    facebook: 'https://www.facebook.com/Cafemalacatus/',
    tiktok: '',
  },
  nav: [
    { label: 'Inicio', to: '/' },
    { label: 'Tienda', to: '/tienda' },
    { label: 'Nuestra historia', to: '/#historia' },
    { label: 'Contacto', to: '/#contacto' },
  ],

  hero: {
    eyebrow: '100% lojano',
    title: 'El primero en aroma y sabor',
    lead: 'Un café que nace en los fértiles suelos de Loja, donde cada grano cuenta una historia de tradición, pasión y compromiso con la calidad.',
    ctaPrimary: 'Comprar café',
    ctaSecondary: 'Conoce el proceso',
  },

  story: {
    eyebrow: 'Nuestra historia',
    title: 'Mucho más que una bebida',
    intro:
      'Aquí celebramos el arte de cultivar y tostar café, llevando a cada taza una experiencia sensorial única, que evoca la calidez y el sabor de nuestra tierra. Es una conexión con lo mejor de Ecuador.',
    // Capítulos del recorrido con scroll. `video` y `poster` son rutas dentro de public/.
    // Hoy son clips de ambientación generados; se reemplazan por los videos reales del
    // proceso cuando el cliente los entregue. Sin `video`, el capítulo muestra su icono.
    steps: [
      {
        key: 'origen',
        video: '',
        poster: '',
        title: 'Origen',
        text: 'Cada grano ha sido cuidadosamente seleccionado en el corazón de las montañas de Malacatos.',
      },
      {
        key: 'tueste',
        video: '/videos/tueste.mp4',
        poster: '/videos/tueste.jpg',
        title: 'Tueste',
        text: 'Tostado para ofrecerte una experiencia rica, intensa y llena de autenticidad.',
      },
      {
        key: 'taza',
        video: '',
        poster: '',
        title: 'Tu taza',
        text: 'Un sabor profundo y auténtico que representa la rica herencia cafetera de Loja.',
      },
    ],
  },

  mission: {
    title: 'Misión',
    text: 'Brindar a nuestros clientes una experiencia inigualable de sabor y calidad a través de un café que refleja nuestras raíces, respetando el medio ambiente y promoviendo el bienestar de nuestros productores locales.',
  },
  vision: {
    title: 'Visión',
    text: 'Convertirnos en un símbolo de excelencia cafetera, donde cada taza cuente la historia de una comunidad dedicada a transformar la naturaleza en momentos inolvidables.',
  },

  badges: ['100% lojano', 'Producto de exportación', 'Mayor rendimiento', 'Consuma lo nuestro'],

  categories: {
    cafe: 'Café',
    harinas: 'Harinas',
    endulzantes: 'Endulzantes',
    untables: 'Untables',
    dulces: 'Dulces',
  },

  locations: {
    factory: { title: 'Fábrica', lines: ['Principal Malacatos', 'Salida vía Vilcabamba'] },
    branches: {
      title: 'Puntos de venta en Loja',
      lines: [
        'Centro Comercial Loja, local 502',
        'Mercado Gran Colombia, locales 82 y 83',
        'Mercado San Sebastián, locales 123-124',
      ],
    },
  },

  checkout: {
    shippingNote:
      'El total incluye el producto más el costo de envío, que se calcula según tu provincia y el peso del pedido.',
    noRateNote:
      'Todavía no tenemos tarifa de envío en línea para tu provincia. Cierra tu pedido por WhatsApp y te confirmamos el costo.',
    invoiceNote: 'Emitimos factura electrónica en todas las compras, sin importar el monto.',
    transferNote:
      'Tu pedido queda por verificar. Apenas confirmemos la transferencia te avisamos por correo y empieza tu envío.',
    whatsappCta: 'Terminar compra por WhatsApp',
  },
} as const

export function whatsappLink(
  message = 'Hola, quiero más información',
  number: string = site.whatsapp,
): string {
  if (!number) return '#'
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
