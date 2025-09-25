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
            placeholder="Email Anda"
            required
            class="input input-bordered w-full focus:ring focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary w-full cursor-pointer"
        >
          Kirim Instruksi Reset
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
import api from "../services/api";

export default {
  name: "ForgotPassword",
  data() {
    return {
      email: "",
      error: null,
      message: null,
    };
  },
  methods: {
    async sendResetEmail() {
      try {
        await api.post("/forgot-password", { email: this.email });
        this.message = "Instruksi reset password telah dikirimkan ke email Anda.";
        this.error = null;
      } catch (err) {
        this.error = "Terjadi kesalahan. Pastikan email yang Anda masukkan valid.";
        this.message = null;
      }
    },
  },
};
</script>
