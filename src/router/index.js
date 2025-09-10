import { createRouter, createWebHistory } from 'vue-router'

// Layout
import MainLayout from '../layouts/MainLayout.vue'

// Views
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Categories from '../views/Categories.vue'
import Products from '../views/Products.vue'
import TambahProduct from '../views/TambahProduct.vue'
import EditProduct from '@/views/EditProduct.vue'
import Login from '../views/Login.vue'
import Orders from '@/views/Orders.vue'
import EditOrder from '@/views/EditOrder.vue'
import Checkout from '@/views/Checkout.vue' // halaman checkout untuk pelanggan

const routes = [
  // Public Routes
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
  { path: '/checkout', name: 'Checkout', component: Checkout }, // ✅ checkout tetap di luar MainLayout

  // Routes admin pakai sidebar/MainLayout
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'categories', name: 'Categories', component: Categories },
      { path: 'products', name: 'Products', component: Products },
      { path: 'products/tambah', name: 'TambahProduct', component: TambahProduct },
      { path: 'products/edit/:id', name: 'EditProduct', component: EditProduct, props: true },
      { path: 'orders', name: 'Orders', component: Orders },
      { path: 'orders/edit/:id', name: 'EditOrder', component: EditOrder },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')

  // Proteksi halaman dashboard hanya untuk admin
  if (to.path === '/dashboard') {
    if (!token || !user || user.role !== 'admin') {
      return next('/login')
    }
  }

  // Proteksi halaman checkout agar harus login
  if (to.path === '/checkout') {
    if (!token || !user) {
      alert('Silakan login terlebih dahulu!')
      return next('/login')
    }
  }

  next()
})

export default router
