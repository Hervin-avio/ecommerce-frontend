<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block mb-1 font-medium">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <div>
          <label class="block mb-1 font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>

      <p v-if="error" class="text-red-500 mt-3 text-center">{{ error }}</p>

      <!-- Link Register -->
      <p class="mt-4 text-center text-sm text-gray-600">
        Belum punya akun?
        <router-link to="/register" class="text-blue-500 hover:underline">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: null,
    }
  },
  methods: {
    async login() {
      try {
        const res = await api.post('/login', {
          email: this.email,
          password: this.password,
        })

        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        const role = res.data.user.role

        if (role === 'admin') {
          this.$router.push('/dashboard')
        } else {
          this.$router.push('/')
        }
      } catch (err) {
        this.error = 'Login gagal. Periksa email/password.'
      }
    },
  },
}
</script>

<style scoped>
/* optional styling */
</style>
