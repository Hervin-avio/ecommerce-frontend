import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  // Public Routes
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
  { path: '/checkout', name: 'Checkout', component: () => import('../views/Checkout.vue') }, // ✅ checkout tetap di luar MainLayout
  { path: '/forgot-password', name: 'ForgotPassword', component: () => import('../views/ForgotPassword.vue') }, // Tambahkan rute ini
   // Forgot Password & Reset Password Route
  { path: '/forgot-password', name: 'ForgotPassword', component: () => import('../views/ForgotPassword.vue') },
  // Rute untuk reset password yang mengarah ke halaman frontend
  { path: '/reset-password', name: 'ResetPassword', component: () => import('../views/ResetPassword.vue') },


  // Admin Routes (dalam layout utama)
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'), // Lazy load layout juga
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/admin/Dashboard.vue') },
      { path: 'categories', name: 'Categories', component: () => import('../views/admin/Categories.vue') },
      { path: 'products', name: 'Products', component: () => import('../views/admin/Products.vue') },
      { path: 'reports', name: 'Reports', component: () => import('../views/admin/Reports.vue') },
      { path: 'products/tambah', name: 'TambahProduct', component: () => import('../views/admin/TambahProduct.vue') },
      { path: 'products/edit/:id', name: 'EditProduct', component: () => import('../views/admin/EditProduct.vue'), props: true },
      { path: 'orders', name: 'Orders', component: () => import('../views/admin/Orders.vue') },
      { path: 'orders/edit/:id', name: 'EditOrder', component: () => import('../views/admin/EditOrder.vue') },
      { path: 'users', name: 'Users', component: () => import('../views/admin/Users.vue') },
      { path: 'users/edit/:id', name: 'EditUser', component: () => import('../views/admin/EditUser.vue'), props: true },


    ],
  },
];

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
