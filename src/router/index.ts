import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { site } from '@/config/site'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: site.name },
  },
  {
    path: '/tienda',
    name: 'Shop',
    component: () => import('@/views/ShopView.vue'),
    meta: { title: 'Tienda' },
  },
  {
    path: '/producto/:slug',
    name: 'Product',
    component: () => import('@/views/ProductView.vue'),
    meta: { title: 'Producto' },
  },
  {
    path: '/carrito',
    name: 'Cart',
    component: () => import('@/views/CartView.vue'),
    meta: { title: 'Tu carrito' },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { title: 'Finalizar compra' },
  },
  {
    // URL de respuesta registrada en Payphone Developer: no cambiar la ruta.
    path: '/pago/respuesta',
    name: 'PaymentResponse',
    component: () => import('@/views/PaymentResponseView.vue'),
    meta: { title: 'Resultado del pago' },
  },
  {
    path: '/pedido/:number',
    name: 'OrderTracking',
    component: () => import('@/views/OrderTrackingView.vue'),
    meta: { title: 'Tu pedido' },
  },
  {
    path: '/registro',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: 'Crear cuenta', guestOnly: true },
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboardView.vue'),
        meta: { title: 'Panel' },
      },
      {
        path: 'productos',
        name: 'AdminProducts',
        component: () => import('@/views/admin/AdminProductsView.vue'),
        meta: { title: 'Productos' },
      },
      {
        path: 'productos/:id',
        name: 'AdminProductEdit',
        component: () => import('@/views/admin/AdminProductEditView.vue'),
        meta: { title: 'Editar producto' },
      },
      {
        path: 'ordenes',
        name: 'AdminOrders',
        component: () => import('@/views/admin/AdminOrdersView.vue'),
        meta: { title: 'Órdenes' },
      },
      {
        path: 'ordenes/:id',
        name: 'AdminOrderDetail',
        component: () => import('@/views/admin/AdminOrderDetailView.vue'),
        meta: { title: 'Orden' },
      },
      {
        path: 'clientes',
        name: 'AdminCustomers',
        component: () => import('@/views/admin/AdminCustomersView.vue'),
        meta: { title: 'Clientes' },
      },
      {
        path: 'envios',
        name: 'AdminShipping',
        component: () => import('@/views/admin/AdminShippingView.vue'),
        meta: { title: 'Envíos' },
      },
      {
        path: 'ajustes',
        name: 'AdminSettings',
        component: () => import('@/views/admin/AdminSettingsView.vue'),
        meta: { title: 'Ajustes' },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Ingresar', guestOnly: true },
  },
  {
    path: '/cuenta',
    name: 'Account',
    component: () => import('@/views/AccountView.vue'),
    meta: { title: 'Mi cuenta', requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Con "atrás" el navegador devuelve la posición guardada; con un hash se
  // baja a la sección; si no, arriba.
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { left: 0, top: 0 }
  },
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  const needsAuth = to.matched.some((r) => r.meta.requiresAuth)
  const needsAdmin = to.matched.some((r) => r.meta.requiresAdmin)

  if (needsAuth || to.meta.guestOnly) {
    // La sesión se verifica contra el API una sola vez por carga.
    await userStore.restore()
  }

  if (needsAuth && !userStore.isAuthenticated) {
    return { name: 'Login', query: { next: to.fullPath }, replace: true }
  }

  if (needsAdmin && !userStore.isAdmin) {
    return { name: 'Home', replace: true }
  }

  if (to.meta.guestOnly && userStore.isAuthenticated) {
    return userStore.isAdmin
      ? { name: 'AdminDashboard', replace: true }
      : { name: 'Account', replace: true }
  }
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title && title !== site.name ? `${title} — ${site.name}` : site.name
})

export default router
