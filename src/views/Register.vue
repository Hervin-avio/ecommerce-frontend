<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">Register User</h2>

      <form @submit.prevent="register" class="space-y-4">
        <div>
          <label class="block mb-1 font-medium">Nama</label>
          <input
            v-model="name"
            type="text"
            placeholder="Nama lengkap"
            required
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

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

        <div>
          <label class="block mb-1 font-medium">Konfirmasi Password</label>
          <input
            v-model="password_confirmation"
            type="password"
            placeholder="Konfirmasi Password"
            required
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Register
        </button>
      </form>

      <p v-if="error" class="text-red-500 mt-3 text-center">{{ error }}</p>
      <p class="mt-3 text-center">
        Sudah punya akun?
        <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      error: null,
    }
  },
  methods: {
    async register() {
      try {
        // kirim request ke API register Laravel
        await api.post('/register', {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation,
        })

        // redirect ke login setelah berhasil register
        this.$router.push('/login')
      } catch (err) {
        // ambil error dari response API jika ada
        if (err.response && err.response.data && err.response.data.errors) {
          const errors = err.response.data.errors
          this.error = Object.values(errors).flat().join(' ')
        } else {
          this.error = 'Registrasi gagal. Periksa input data.'
        }
      }
    },
  },
}
</script>

<style scoped>
/* optional styling */
</style>
