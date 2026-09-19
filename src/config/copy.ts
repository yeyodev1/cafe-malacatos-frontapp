/**
 * Textos de interfaz de la tienda pública (tienda, producto, carrito, cuenta).
 *
 * `site.ts` es un archivo compartido y guarda el copy de marca; esto es su
 * complemento para los textos de UI. Si se prefiere un solo archivo, este objeto
 * se puede mover tal cual a `site.ts` como `site.ui`.
 */
export const copy = {
  common: {
    retry: 'Reintentar',
    backToShop: 'Volver a la tienda',
    goToShop: 'Ir a la tienda',
    whatsappAsk: 'Escríbenos por WhatsApp',
    whatsappGreeting: 'Hola, quiero más información sobre Café Malacatos',
    skipToContent: 'Saltar al contenido',
    scroll: 'Desliza',
  },

  header: {
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    cart: 'Carrito',
    account: 'Mi cuenta',
    login: 'Ingresar',
    menuLabel: 'Navegación principal',
  },

  footer: {
    navTitle: 'Navegación',
    shopTitle: 'Tienda',
    contactTitle: 'Contacto',
    allProducts: 'Todos los productos',
    madeBy: 'Hecho por',
  },

  home: {
    heroImageAlt: 'Funda de Café Malacatos, café tostado y molido 100% lojano',
    featured: {
      eyebrow: 'De nuestra tierra',
      title: 'Productos destacados',
      lead: 'Café tostado y molido, panela, harinas y más, directo desde Malacatos hasta tu mesa.',
      cta: 'Ver toda la tienda',
      emptyTitle: 'Estamos preparando el catálogo',
      emptyText:
        'Mientras tanto puedes hacer tu pedido directamente por WhatsApp y te atendemos enseguida.',
    },
    purpose: {
      eyebrow: 'Lo que nos mueve',
      title: 'Misión y visión',
    },
    contact: {
      eyebrow: 'Contacto',
      title: 'Ven por tu café o pídelo desde casa',
      lead: 'Encuéntranos en Malacatos y en nuestros puntos de venta en Loja, o escríbenos y coordinamos tu envío a cualquier provincia.',
      phoneLabel: 'Teléfono',
      emailLabel: 'Correo',
      socialLabel: 'Redes',
      cta: 'Pedir por WhatsApp',
    },
  },

  shop: {
    eyebrow: 'Tienda',
    title: 'Todo el sabor de Loja',
    lead: 'Elige tu presentación, arma tu pedido y recíbelo en cualquier provincia del Ecuador.',
    filterLabel: 'Filtrar por categoría',
    all: 'Todos',
    emptyTitle: 'Pronto verás aquí nuestros productos',
    emptyText:
      'Estamos cargando el catálogo en línea. Si quieres comprar hoy, escríbenos por WhatsApp y armamos tu pedido.',
    emptyCategoryTitle: 'Todavía no hay productos en esta categoría',
    emptyCategoryText: 'Revisa el resto de la tienda o pregúntanos por WhatsApp.',
    errorTitle: 'No pudimos cargar la tienda',
    errorText: 'Revisa tu conexión e inténtalo de nuevo. También puedes pedir por WhatsApp.',
    seeAll: 'Ver todos los productos',
  },

  product: {
    from: 'Desde',
    add: 'Agregar al carrito',
    addShort: 'Agregar',
    choose: 'Elegir presentación',
    view: 'Ver producto',
    added: 'Agregado al carrito',
    variantLabel: 'Presentación',
    wholesalePrefix: 'Al por mayor:',
    wholesaleFrom: 'desde',
    wholesaleUnits: 'unidades',
    variantsCount: 'presentaciones',
    qtyLabel: 'Cantidad',
    decrease: 'Quitar una unidad',
    increase: 'Agregar una unidad',
    descriptionTitle: 'Descripción',
    usageTitle: 'Uso',
    unavailable: 'Este producto no tiene presentaciones disponibles por ahora.',
    ask: 'Preguntar por este producto',
    askMessage: 'Hola, quiero más información sobre',
    notFoundTitle: 'No encontramos este producto',
    notFoundText: 'Puede que ya no esté disponible o que el enlace esté mal escrito.',
    errorTitle: 'No pudimos cargar el producto',
    errorText: 'Revisa tu conexión e inténtalo de nuevo.',
    noImage: 'Imagen en camino',
    breadcrumbLabel: 'Ruta de navegación',
    galleryLabel: 'Imágenes del producto',
    shippingHint:
      'Envíos a todo Ecuador. El costo se calcula según tu provincia y el peso del pedido.',
  },

  cart: {
    eyebrow: 'Tu pedido',
    title: 'Tu carrito',
    emptyTitle: 'Tu carrito está vacío',
    emptyText: 'Agrega tu café favorito y vuelve aquí para terminar tu compra.',
    remove: 'Quitar',
    removed: 'Producto quitado del carrito',
    clear: 'Vaciar carrito',
    summaryTitle: 'Resumen',
    subtotal: 'Subtotal',
    weight: 'Peso del pedido',
    shipping: 'Envío',
    shippingPending: 'Se calcula en el siguiente paso',
    checkout: 'Finalizar compra',
    keepShopping: 'Seguir comprando',
    or: 'o si prefieres',
  },

  whatsappOrder: {
    greeting: 'Hola, quiero hacer este pedido en Café Malacatos:',
    subtotal: 'Subtotal',
    shippingLine: 'El costo de envío lo confirmamos por este medio.',
    floatLabel: 'Escríbenos por WhatsApp',
    floatOrderLabel: 'Terminar compra por WhatsApp',
  },

  auth: {
    loginEyebrow: 'Acceso',
    loginTitle: 'Ingresar',
    loginLead: 'Entra para ver tus datos y seguir tus pedidos.',
    registerEyebrow: 'Cuenta nueva',
    registerTitle: 'Crear cuenta',
    registerLead: 'Guarda tus datos para comprar más rápido. También puedes comprar sin cuenta.',
    name: 'Nombre y apellido',
    email: 'Correo',
    phone: 'Teléfono',
    password: 'Contraseña',
    passwordHint: 'Mínimo 8 caracteres.',
    loginSubmit: 'Ingresar',
    loginLoading: 'Ingresando…',
    registerSubmit: 'Crear cuenta',
    registerLoading: 'Creando cuenta…',
    noAccount: '¿Todavía no tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?',
    goRegister: 'Crear cuenta',
    goLogin: 'Ingresar',
    welcome: 'Hola,',
  },

  account: {
    eyebrow: 'Mi cuenta',
    email: 'Correo',
    phone: 'Teléfono',
    noPhone: 'Sin registrar',
    logout: 'Cerrar sesión',
    loggedOut: 'Sesión cerrada',
    shopCta: 'Ir a la tienda',
    adminCta: 'Ir al panel',
  },

  notFound: {
    code: '404',
    title: 'Esta página no existe',
    text: 'Puede que el enlace esté mal escrito o que la página se haya movido.',
    home: 'Volver al inicio',
  },

  // Datos estructurados (JSON-LD). Las localidades salen de las direcciones de site.ts.
  seo: {
    country: 'EC',
    region: 'Loja',
    factoryLocality: 'Malacatos',
    branchLocality: 'Loja',
    shopTitle: 'Tienda',
    shopDescription:
      'Compra en línea café tostado y molido 100% lojano, panela, sango, siete harinas y pasta de maní de Café Malacatos. Envíos a todo Ecuador.',
  },
} as const
