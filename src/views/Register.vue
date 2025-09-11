<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
    <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Register User</h2>

      <form @submit.prevent="register" class="space-y-4">
        <!-- Nama -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Nama</span>
          </label>
          <input
            v-model="name"
            type="text"
            placeholder="Nama lengkap"
            required
            class="input input-bordered w-full"
          />
        </div>

        <!-- Email -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Email</span>
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="input input-bordered w-full"
          />
        </div>

        <!-- Password -->
        <div class="form-control relative">
          <label class="label">
            <span class="label-text font-medium">Password</span>
          </label>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            required
            class="input input-bordered w-full pr-10"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute right-3 top-10 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <span v-if="showPassword">🙈</span>
            <span v-else>👁️</span>
          </button>
        </div>

        <!-- Konfirmasi Password -->
        <div class="form-control relative">
          <label class="label">
            <span class="label-text font-medium">Konfirmasi Password</span>
          </label>
          <input
            v-model="password_confirmation"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Konfirmasi Password"
            required
            class="input input-bordered w-full pr-10"
          />
          <button
            type="button"
            @click="toggleConfirmPassword"
            class="absolute right-3 top-10 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <span v-if="showConfirmPassword">🙈</span>
            <span v-else>👁️</span>
          </button>
        </div>

        <!-- Tombol Register -->
        <button
          type="submit"
          class="btn btn-success w-full text-white font-semibold cursor-pointer"
        >
          Register
        </button>
      </form>

      <!-- Error -->
      <p v-if="error" class="text-red-500 mt-3 text-center text-sm">{{ error }}</p>

      <!-- Link Login -->
      <p class="mt-4 text-center text-sm text-gray-600">
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
      showPassword: false,
      showConfirmPassword: false,
    }
  },
  methods: {
    async register() {
      try {
        await api.post('/register', {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation,
        })
        this.$router.push('/login')
      } catch (err) {
        if (err.response?.data?.errors) {
          const errors = err.response.data.errors
          this.error = Object.values(errors).flat().join(' ')
        } else {
          this.error = 'Registrasi gagal. Periksa input data.'
        }
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
  },
}
</script>
