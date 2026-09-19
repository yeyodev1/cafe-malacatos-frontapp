import type { BillingIdType, OrderStatus, PaymentMethod } from '@/types'

/**
 * Textos del panel de administración. Lo leen las dueñas del negocio, no un
 * equipo técnico: frases cortas, en español llano, que digan qué va a pasar.
 */

export interface StatusMeta {
  label: string
  icon: string
  tone: 'neutral' | 'warning' | 'info' | 'success' | 'danger' | 'done'
  /** Qué significa para quien atiende la tienda. */
  hint: string
}

export const orderStatus: Record<OrderStatus, StatusMeta> = {
  pending: {
    label: 'Esperando pago',
    icon: 'fa-solid fa-hourglass-half',
    tone: 'neutral',
    hint: 'El cliente todavía no paga ni sube su comprobante.',
  },
  awaiting_verification: {
    label: 'Transferencia por revisar',
    icon: 'fa-solid fa-magnifying-glass-dollar',
    tone: 'warning',
    hint: 'El cliente subió su comprobante. Revisa que el dinero llegó y aprueba.',
  },
  paid: {
    label: 'Pagado, por enviar',
    icon: 'fa-solid fa-box-open',
    tone: 'info',
    hint: 'El pago está confirmado. Falta despachar el pedido.',
  },
  shipped: {
    label: 'Enviado',
    icon: 'fa-solid fa-truck-fast',
    tone: 'success',
    hint: 'El pedido va en camino. Márcalo como entregado cuando llegue.',
  },
  delivered: {
    label: 'Entregado',
    icon: 'fa-solid fa-circle-check',
    tone: 'done',
    hint: 'El cliente ya recibió su pedido.',
  },
  cancelled: {
    label: 'Cancelado',
    icon: 'fa-solid fa-ban',
    tone: 'danger',
    hint: 'Este pedido se canceló y no se despacha.',
  },
}

export const orderStatusOrder: OrderStatus[] = [
  'awaiting_verification',
  'paid',
  'pending',
  'shipped',
  'delivered',
  'cancelled',
]

export const paymentMethod: Record<PaymentMethod, { label: string; icon: string }> = {
  card: { label: 'Tarjeta', icon: 'fa-solid fa-credit-card' },
  transfer: { label: 'Transferencia', icon: 'fa-solid fa-building-columns' },
}

export const billingIdType: Record<BillingIdType, string> = {
  cedula: 'Cédula',
  ruc: 'RUC',
  pasaporte: 'Pasaporte',
  consumidor_final: 'Consumidor final',
}

export const adminCopy = {
  common: {
    loading: 'Cargando…',
    retry: 'Reintentar',
    save: 'Guardar cambios',
    saving: 'Guardando…',
    saved: 'Cambios guardados',
    cancel: 'Cancelar',
    back: 'Volver',
    yes: 'Sí',
    no: 'No',
    active: 'Activa',
    inactive: 'Inactiva',
    errorTitle: 'No pudimos cargar esta información',
    errorFallback: 'Revisa tu conexión a internet e inténtalo otra vez.',
    unsavedBar: 'Tienes cambios sin guardar',
    discard: 'Descartar',
    copy: 'Copiar',
    copied: 'Copiado',
    copyFailed: 'No se pudo copiar. Mantén presionado el texto para copiarlo a mano.',
    fixErrors: 'Revisa los campos marcados en rojo antes de guardar.',
    empty: 'Sin dato',
  },

  leave: {
    title: '¿Salir sin guardar?',
    message: 'Hiciste cambios que todavía no se guardan. Si sales ahora, se pierden.',
    confirm: 'Salir sin guardar',
    cancel: 'Seguir editando',
  },

  pagination: {
    label: 'Páginas',
    previous: 'Anterior',
    next: 'Siguiente',
    page: 'Página',
    of: 'de',
  },

  nav: {
    label: 'Secciones del panel',
    brandSub: 'Panel de la tienda',
    dashboard: 'Panel',
    orders: 'Órdenes',
    products: 'Productos',
    customers: 'Clientes',
    shipping: 'Envíos',
    settings: 'Ajustes',
    more: 'Más',
    moreTitle: 'Más opciones',
    closeMore: 'Cerrar',
    viewStore: 'Ver la tienda',
    logout: 'Cerrar sesión',
    loggedOut: 'Sesión cerrada',
    pendingBadge: 'órdenes que necesitan tu atención',
  },

  dashboard: {
    eyebrow: 'Hoy en la tienda',
    greeting: 'Hola',
    lead: 'Esto es lo que pasa en tu tienda. Toca una cifra para ver esas órdenes.',
    stats: {
      ordersToday: { label: 'Órdenes de hoy', hint: 'Ver todas las órdenes' },
      pendingVerification: {
        label: 'Transferencias por revisar',
        hint: 'Revisar comprobantes',
      },
      toShip: { label: 'Pedidos por enviar', hint: 'Ver qué despachar' },
      revenueMonth: { label: 'Ventas del mes', hint: 'Ver las órdenes' },
    },
    actionTitle: 'Necesitan tu atención',
    actionLead: 'Primero las transferencias por revisar, luego lo que falta despachar.',
    allClearTitle: 'Todo al día',
    allClearText: 'No hay transferencias por revisar ni pedidos por enviar. Buen trabajo.',
    seeAll: 'Ver todas las órdenes',
    shortcutsTitle: 'Accesos rápidos',
    shortcuts: {
      newProduct: 'Agregar un producto',
      shipping: 'Poner tarifas de envío',
      settings: 'Cuentas bancarias y WhatsApp',
    },
  },

  orders: {
    title: 'Órdenes',
    lead: 'Todos los pedidos de la tienda, del más nuevo al más antiguo.',
    filterLabel: 'Mostrar',
    filterAll: 'Todas',
    columns: {
      number: 'Número',
      date: 'Fecha',
      customer: 'Cliente',
      total: 'Total',
      payment: 'Pago',
      status: 'Estado',
    },
    open: 'Abrir orden',
    count: (n: number) => (n === 1 ? '1 orden' : `${n} órdenes`),
    emptyTitle: 'Todavía no hay órdenes',
    emptyText: 'Cuando alguien compre en la tienda, su pedido aparece aquí.',
    emptyFilteredTitle: 'No hay órdenes en este estado',
    emptyFilteredText: 'Prueba con otro filtro o mira todas las órdenes.',
    clearFilter: 'Ver todas',
  },

  order: {
    back: 'Todas las órdenes',
    titlePrefix: 'Orden',
    placedOn: 'Recibida el',
    paidOn: 'Pagada el',
    shippedOn: 'Enviada el',
    notFoundTitle: 'No encontramos esta orden',
    itemsTitle: 'Qué pidió',
    qty: 'Cantidad',
    unit: 'c/u',
    subtotal: 'Subtotal',
    shipping: 'Envío',
    total: 'Total',
    weight: 'Peso total',
    contactTitle: 'Cliente',
    email: 'Correo',
    phone: 'Teléfono',
    whatsappCta: 'Escribirle por WhatsApp',
    whatsappMessage: (name: string, number: string) =>
      `Hola ${name}, te escribimos de Café Malacatos por tu pedido ${number}.`,
    shippingTitle: 'Dirección de envío',
    reference: 'Referencia',
    mapCta: 'Ver en Google Maps',
    trackingTitle: 'Nota de rastreo enviada al cliente',
    billingTitle: 'Datos para la factura',
    billingLead:
      'La factura electrónica se emite a mano en tu sistema de facturación. Copia cada dato con su botón.',
    billing: {
      idType: 'Tipo de identificación',
      idNumber: 'Número',
      name: 'Nombre o razón social',
      address: 'Dirección',
      email: 'Correo',
      phone: 'Teléfono',
      total: 'Total a facturar',
    },
    invoiceLabel: 'Factura emitida',
    invoiceHint: 'Márcala cuando ya hayas emitido la factura de esta orden.',
    invoiceOn: 'Factura marcada como emitida',
    invoiceOff: 'Factura marcada como pendiente',
    actionsTitle: 'Qué sigue',
    proofTitle: 'Comprobante de transferencia',
    proofAlt: 'Comprobante de transferencia enviado por el cliente',
    proofZoom: 'Ver en grande',
    proofClose: 'Cerrar comprobante',
    proofMissing:
      'El cliente todavía no sube su comprobante. Si ya te lo envió por WhatsApp y el dinero llegó, puedes aprobar igual.',
    cardPending:
      'El cliente eligió tarjeta y aún no completa el pago. Si lo abandonó, puedes cancelar la orden.',
    approve: 'Aprobar transferencia',
    approveTitle: '¿Aprobar esta transferencia?',
    approveMessage:
      'Confirma que el dinero ya está en tu cuenta. Al aprobar, el cliente recibe el correo "tu compra fue aprobada, empieza tu envío". No se puede deshacer.',
    approveConfirm: 'Sí, el dinero llegó',
    approved: 'Transferencia aprobada. Le avisamos al cliente por correo.',
    ship: 'Marcar como enviado',
    shipTitle: 'Marcar como enviado',
    shipMessage: 'El cliente recibirá un correo con esta nota para rastrear su pedido.',
    shipNoteLabel: 'Transportista y número de guía',
    shipNotePlaceholder: 'Ej.: Servientrega, guía 1234567890',
    shipNoteRequired: 'Escribe el transportista y la guía para que el cliente pueda rastrearlo.',
    shipConfirm: 'Enviar y avisar al cliente',
    shipped: 'Orden marcada como enviada. Le avisamos al cliente por correo.',
    deliver: 'Marcar como entregado',
    deliverTitle: '¿El cliente ya recibió su pedido?',
    deliverMessage: 'La orden quedará cerrada como entregada.',
    deliverConfirm: 'Sí, ya lo recibió',
    delivered: 'Orden marcada como entregada',
    cancel: 'Cancelar orden',
    cancelTitle: '¿Cancelar esta orden?',
    cancelMessage:
      'La orden quedará cancelada y no se podrá reactivar. Si el cliente ya pagó, recuerda devolverle el dinero por tu cuenta.',
    cancelConfirm: 'Sí, cancelar la orden',
    cancelKeep: 'No, conservarla',
    cancelled: 'Orden cancelada',
    closedNote: 'Esta orden ya está cerrada: no hay nada más que hacer.',
    noteTitle: 'Nota interna',
    noteHint: 'Solo la ve el equipo de la tienda. El cliente nunca la ve.',
    noteLabel: 'Nota interna de la orden',
    notePlaceholder: 'Ej.: pidió que se entregue después de las 5 de la tarde',
    noteSave: 'Guardar nota',
    noteSaved: 'Nota guardada',
  },

  products: {
    title: 'Productos',
    lead: 'Lo que está "Publicado" se ve en la tienda. Lo que está en "Borrador" solo lo ves tú.',
    add: 'Agregar producto',
    columns: {
      product: 'Producto',
      category: 'Categoría',
      prices: 'Precios',
      state: 'En la tienda',
    },
    published: 'Publicado',
    draft: 'Borrador',
    publishedToast: (name: string) => `"${name}" ya se ve en la tienda`,
    draftToast: (name: string) => `"${name}" quedó como borrador y ya no se ve en la tienda`,
    toggleLabel: (name: string) => `Publicar ${name} en la tienda`,
    edit: 'Editar',
    noVariants: 'Sin presentaciones',
    noPhoto: 'Sin foto',
    notSellable: 'No se puede vender en línea',
    emptyTitle: 'Aún no hay productos',
    emptyText: 'Agrega el primero para empezar a vender.',
  },

  product: {
    back: 'Todos los productos',
    newTitle: 'Nuevo producto',
    editTitle: 'Editar producto',
    notFoundTitle: 'No encontramos este producto',
    sectionInfo: 'Información',
    name: 'Nombre',
    namePlaceholder: 'Ej.: Café molido',
    nameRequired: 'Escribe el nombre del producto.',
    slug: 'Dirección en la web',
    slugHint:
      'Se arma sola con el nombre. Cámbiala solo si sabes lo que haces: es el enlace del producto.',
    slugPrefix: 'cafemalacatos.com/producto/',
    slugInvalid: 'Solo letras minúsculas, números y guiones.',
    slugRegenerate: 'Volver a armarla con el nombre',
    category: 'Categoría',
    shortDescription: 'Descripción corta',
    shortDescriptionHint: 'Una frase. Aparece en la tarjeta del producto en la tienda.',
    description: 'Descripción',
    descriptionHint: 'El texto completo de la página del producto.',
    usage: 'Uso',
    usageHint: 'Cómo se prepara o para qué sirve. Opcional.',
    sortOrder: 'Orden en la tienda',
    sortOrderHint: 'Número menor aparece primero.',
    sortOrderInvalid: 'Escribe un número entero.',
    visibility: 'Visible en la tienda',
    visibilityOn: 'Publicado: los clientes lo pueden ver y comprar.',
    visibilityOff: 'Borrador: todavía no se ve en la tienda.',
    publishWarning:
      'Este producto está publicado pero ninguna presentación se puede vender en línea. Revisa pesos y precios.',
    create: 'Crear producto',
    created: 'Producto creado. Ahora puedes subirle fotos.',
    saved: 'Producto guardado',
    dangerTitle: 'Eliminar producto',
    dangerText: 'Se borra de la tienda con sus fotos. Las órdenes ya hechas no se tocan.',
    delete: 'Eliminar este producto',
    deleteTitle: '¿Eliminar este producto?',
    deleteMessage: (name: string) =>
      `Vas a eliminar "${name}" para siempre. Si solo quieres ocultarlo de la tienda, mejor déjalo como borrador.`,
    deleteTypeLabel: (name: string) => `Para confirmar, escribe el nombre: ${name}`,
    deleteMismatch: 'El nombre no coincide. Escríbelo tal como aparece arriba.',
    deleteConfirm: 'Eliminar para siempre',
    deleted: (name: string) => `"${name}" fue eliminado`,
  },

  variants: {
    title: 'Presentaciones y precios',
    lead: 'Cada tamaño o presentación que vendes, con su peso y su precio.',
    item: 'Presentación',
    label: 'Nombre de la presentación',
    labelPlaceholder: 'Ej.: 1 libra',
    labelRequired: 'Ponle un nombre.',
    weight: 'Peso en gramos',
    weightHint: '1 libra = 454 g. Se usa para calcular el envío.',
    price: 'Precio',
    wholesalePrice: 'Precio al por mayor',
    wholesaleMinQty: 'Desde cuántas unidades',
    optional: 'Opcional',
    wholesaleHint: 'Informativo: se muestra en la tienda, no se aplica solo en el pago.',
    activeLabel: 'Disponible para la venta',
    add: 'Agregar presentación',
    remove: 'Quitar',
    removeLabel: (label: string) => `Quitar la presentación ${label || 'sin nombre'}`,
    notSellable:
      'Sin peso y precio mayores a cero, esta presentación no se puede vender en línea: el cliente solo podrá pedirla por WhatsApp.',
    invalidInt: 'Escribe un número entero, sin decimales.',
    invalidMoney: 'Escribe un monto como 4.50',
    invalidQty: 'Escribe un número entero desde 1.',
    empty:
      'Este producto todavía no tiene presentaciones. Agrega al menos una para poder venderlo.',
  },

  images: {
    title: 'Fotos',
    lead: 'La primera foto es la portada: la que se ve en la tienda. Las fotos se guardan al instante.',
    cover: 'Portada',
    add: 'Subir foto',
    uploading: 'Subiendo foto…',
    uploaded: 'Foto subida',
    remove: 'Borrar foto',
    removeTitle: '¿Borrar esta foto?',
    removeMessage: 'La foto se borra de inmediato y no se puede recuperar.',
    removeConfirm: 'Borrar foto',
    removed: 'Foto borrada',
    alt: (name: string, n: number) => `Foto ${n} de ${name}`,
    saveFirst: 'Primero crea el producto. Después vas a poder subirle fotos desde aquí.',
    empty: 'Este producto no tiene fotos todavía.',
    notImage: 'Ese archivo no es una imagen. Elige una foto JPG o PNG.',
    tooBig: 'La foto pesa más de 10 MB. Elige una más liviana.',
    serviceDown:
      'El servicio donde se guardan las fotos no está respondiendo. No es un problema tuyo ni de tu internet. Lo demás del formulario sigue intacto: puedes guardar el producto y subir la foto más tarde.',
    errorTitle: 'La foto no se subió',
    coverHint:
      'Para cambiar la portada, borra la primera foto: la siguiente pasa a ser la portada.',
  },

  customers: {
    title: 'Clientes',
    lead: 'Personas que crearon una cuenta en la tienda. Quien compra como invitado aparece solo en sus órdenes.',
    columns: {
      name: 'Nombre',
      email: 'Correo',
      phone: 'Teléfono',
      orders: 'Órdenes',
      since: 'Cliente desde',
    },
    count: (n: number) => (n === 1 ? '1 cliente' : `${n} clientes`),
    inactive: 'Cuenta desactivada',
    emptyTitle: 'Todavía no hay clientes registrados',
    emptyText: 'Cuando alguien cree su cuenta en la tienda, aparece aquí.',
  },

  shipping: {
    title: 'Envíos',
    lead: 'Cuánto cuesta enviar a cada provincia. La tienda suma este valor al total del pedido.',
    howTitle: 'Cómo se calcula',
    how: 'Tarifa base, que cubre los kilos incluidos. Por cada kilo adicional (o fracción) se suma el costo por kilo adicional.',
    noRateTitle: 'Provincias sin tarifa',
    noRate:
      'Si dejas la tarifa base vacía, en esa provincia no se puede pagar en línea: el cliente solo puede cerrar su pedido por WhatsApp.',
    noRateCount: (n: number) =>
      n === 1 ? 'Hay 1 provincia sin tarifa.' : `Hay ${n} provincias sin tarifa.`,
    allRated: 'Todas las provincias tienen tarifa.',
    bulkTitle: 'Poner la misma tarifa a varias provincias',
    bulkLead:
      'Llena estos tres valores y aplícalos de una vez a las provincias que aún no tienen tarifa.',
    bulkApply: (n: number) =>
      n === 1 ? 'Aplicar a la provincia sin tarifa' : `Aplicar a las ${n} provincias sin tarifa`,
    bulkNeedsBase: 'Escribe primero la tarifa base.',
    bulkApplied: (n: number) =>
      `Listo: ${n} ${n === 1 ? 'provincia lista' : 'provincias listas'}. Revisa y pulsa "Guardar cambios".`,
    base: 'Tarifa base',
    baseHint: 'Vacío = sin tarifa',
    basePlaceholder: 'Sin tarifa',
    includedKg: 'Kilos incluidos',
    extraPerKg: 'Por kilo adicional',
    active: 'Activa',
    activeLabel: (province: string) => `Envíos a ${province} activos`,
    province: 'Provincia',
    whatsappOnly: 'Solo por WhatsApp',
    inactiveNote: 'Desactivada',
    unsaved: 'Sin guardar',
    exampleTitle: 'Prueba la fórmula',
    exampleProvince: 'Provincia',
    exampleWeight: 'Peso del pedido (kg)',
    exampleResult: (kg: string, province: string, cost: string) =>
      `Un pedido de ${kg} kg a ${province} costaría ${cost} de envío.`,
    exampleBreakdown: (base: string, extraKg: number, perKg: string) =>
      extraKg > 0
        ? `${base} de base + ${extraKg} kg adicional${extraKg === 1 ? '' : 'es'} × ${perKg}`
        : `${base} de base: el peso entra en los kilos incluidos`,
    exampleNoRate: (province: string) =>
      `${province} no tiene tarifa: ese pedido no se podría pagar en línea, solo cerrar por WhatsApp.`,
    exampleInactive: (province: string) =>
      `${province} está desactivada: la tienda no ofrece envíos ahí.`,
    invalidMoney: 'Escribe un monto como 3.50',
    invalidKg: 'Escribe un número, como 1 o 2.5',
    saved: (n: number) =>
      n === 1 ? 'Tarifa de 1 provincia guardada' : `Tarifas de ${n} provincias guardadas`,
    partial: (ok: number, failed: number) =>
      `Se guardaron ${ok} provincias y ${failed} fallaron. Vuelve a intentar con las marcadas.`,
    pending: (n: number) =>
      n === 1 ? '1 provincia con cambios sin guardar' : `${n} provincias con cambios sin guardar`,
  },

  settings: {
    title: 'Ajustes',
    lead: 'Los datos de contacto que ve el cliente y las cuentas para recibir transferencias.',
    contactTitle: 'Contacto',
    whatsapp: 'WhatsApp de ventas',
    whatsappHint: 'Solo números, con el código del país y sin el 0 inicial. Ej.: 593985366039',
    whatsappRequired: 'Escribe el número de WhatsApp de ventas.',
    whatsappDigits: 'Solo números: sin espacios, guiones ni el signo +.',
    whatsappLeadingZero:
      'Falta el código del país. Cambia el 0 inicial por 593. Ej.: 0985366039 → 593985366039',
    whatsappLength: 'El número parece incompleto. Con código de país tiene entre 11 y 13 dígitos.',
    whatsappTest: 'Probar este número en WhatsApp',
    contactEmail: 'Correo de contacto',
    emailInvalid: 'Ese correo no parece válido.',
    contactPhone: 'Teléfono de contacto',
    contactPhoneHint: 'Como quieres que se vea en la web. Ej.: 0985 366 039',
    socialTitle: 'Redes sociales',
    socialLead: 'Pega el enlace completo de cada perfil. Deja vacío lo que no uses.',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    urlInvalid: 'Pega el enlace completo, empezando por https://',
    bankTitle: 'Cuentas bancarias',
    bankLead:
      'A estas cuentas transfieren tus clientes. Se muestran al finalizar la compra y en el correo de la orden.',
    bankEmpty:
      'Sin cuentas bancarias, la tienda no ofrece pago por transferencia: los clientes solo pueden pagar con tarjeta.',
    bankAdd: 'Agregar cuenta',
    bankItem: 'Cuenta',
    bank: 'Banco',
    bankPlaceholder: 'Ej.: Banco de Loja',
    accountType: 'Tipo de cuenta',
    accountTypes: ['Ahorros', 'Corriente'],
    number: 'Número de cuenta',
    holder: 'Titular',
    idNumber: 'Cédula o RUC del titular',
    bankRequired: 'Obligatorio.',
    bankRemove: 'Quitar cuenta',
    bankRemoveTitle: '¿Quitar esta cuenta?',
    bankRemoveMessage: 'Dejará de mostrarse a los clientes cuando guardes los cambios.',
    bankRemoveConfirm: 'Quitar cuenta',
    instructionsTitle: 'Indicaciones de pago',
    instructions: 'Instrucciones para la transferencia',
    instructionsHint:
      'Se muestran junto a las cuentas. Ej.: "Envía el comprobante desde la página de tu pedido".',
    saved: 'Ajustes guardados',
  },
}
