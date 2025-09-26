<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
    <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <h2 class="text-3xl font-bold mb-6 text-center text-blue-600">Lupa Password</h2>

      <form @submit.prevent="sendResetEmail" class="space-y-5">
        <div>
          <label class="block mb-1 font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Masukkan email Anda"
            required
            class="input input-bordered w-full focus:ring focus:ring-blue-400"
          />
        </div>

        <button
          :disabled="loading"
          type="submit"
          class="btn btn-primary w-full cursor-pointer"
        >
          <span v-if="loading">Loading...</span>
          <span v-else>Kirim Reset ke Email</span>
        </button>
      </form>

      <!-- Success/Error Message -->
      <p v-if="message" class="text-green-500 mt-3 text-center">{{ message }}</p>
      <p v-if="error" class="text-red-500 mt-3 text-center">{{ error }}</p>

      <!-- Link Back to Login -->
      <p class="mt-6 text-center text-sm text-gray-600">
        Kembali ke 
        <router-link to="/login" class="text-blue-500 font-medium hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "ForgotPassword",
  data() {
    return {
      email: "",
      error: null,
      message: null,
      loading: false,
    };
  },
  methods: {
    async sendResetEmail() {
      this.loading = true;
      this.error = null;
      this.message = null;

      try {
        // Mengirim permintaan reset password ke backend
        const response = await axios.post("http://127.0.0.1:8000/api/forgot-password", { email: this.email });

        // Jika berhasil, tampilkan pesan sukses
        this.message = response.data.message;
      } catch (err) {
        // Tangani error jika ada
        if (err.response && err.response.data) {
          this.error = err.response.data.message || "Terjadi kesalahan. Pastikan email yang Anda masukkan valid.";
        } else {
          this.error = "Terjadi kesalahan jaringan. Coba lagi nanti.";
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
