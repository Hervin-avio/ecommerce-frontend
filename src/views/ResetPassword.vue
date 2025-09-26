<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
    <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <h2 class="text-3xl font-bold mb-6 text-center text-blue-600">Reset Password</h2>
      <p class="text-gray-600 mb-6 text-center">Enter your new password below to reset your password.</p>

      <form @submit.prevent="resetPassword" class="space-y-5">
        <!-- New Password -->
        <div class="form-control">
          <label for="new-password" class="label">
            <span class="label-text">New Password</span>
          </label>
          <div class="relative">
            <input
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              id="new-password"
              placeholder="Enter your new password"
              required
              class="input input-bordered w-full focus:ring focus:ring-blue-400 pr-10"
            />
            <!-- Eye Icon for New Password -->
            <button
              type="button"
              @click="toggleNewPasswordVisibility"
              class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-blue-600 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l3 3-3 3M21 9l-3 3 3 3M12 5v14m-7-7h14" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="form-control">
          <label for="confirm-password" class="label">
            <span class="label-text">Confirm Password</span>
          </label>
          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirm-password"
              placeholder="Confirm your new password"
              required
              class="input input-bordered w-full focus:ring focus:ring-blue-400 pr-10"
            />
            <!-- Eye Icon for Confirm Password -->
            <button
              type="button"
              @click="toggleConfirmPasswordVisibility"
              class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-blue-600 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l3 3-3 3M21 9l-3 3 3 3M12 5v14m-7-7h14" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="form-control">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn btn-primary w-full"
          >
            {{ isSubmitting ? 'Resetting...' : 'Reset Password' }}
          </button>
        </div>
      </form>

      <!-- Error Message -->
      <p v-if="error" class="text-red-500 mt-3 text-center">{{ error }}</p>

      <!-- Link Back to Login -->
      <p class="mt-6 text-center text-sm text-gray-600">
        <router-link
          to="/login"
          class="text-blue-500 font-medium hover:underline"
          >Back to Login</router-link
        >
      </p>
    </div>
  </div>
</template>

<script>
import api from '../services/api'; // Import api.js

export default {
  data() {
    return {
      email: this.$route.query.email, // Mendapatkan email dari query params
      token: this.$route.query.token, // Mendapatkan token dari query params
      newPassword: "",
      confirmPassword: "",
      isSubmitting: false,
      error: "",
      showNewPassword: false, // Status untuk visibilitas password baru
      showConfirmPassword: false, // Status untuk visibilitas password konfirmasi
    };
  },
  methods: {
    toggleNewPasswordVisibility() {
      this.showNewPassword = !this.showNewPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async resetPassword() {
      // Validasi jika password dan konfirmasi password tidak sama
      if (this.newPassword !== this.confirmPassword) {
        this.error = "Passwords do not match!";
        return;
      }

      // Mengatur status saat form sedang disubmit
      this.isSubmitting = true;

      try {
        // Mengirim request POST ke API untuk reset password
        const response = await api.post("reset-password", {
          email: this.email,
          token: this.token,
          password: this.newPassword,
          password_confirmation: this.confirmPassword,
        });

        // Menampilkan alert berhasil
        alert("Password has been reset successfully!");
        // Redirect ke halaman login
        this.$router.push("/login");
      } catch (error) {
        // Menampilkan error jika gagal
        this.error = error.response?.data?.message || "Error resetting password";
        console.error(error);
      } finally {
        // Mengubah status menjadi tidak sedang submit
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
/* Tampilan untuk form Reset Password */
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
}

.reset-password-form {
  background-color: #fff;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 24px;
  color: #3b82f6;
}

p {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #4b5563;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input.form-control {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button.btn {
  width: 100%;
  padding: 0.8rem;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 1rem;
}

.link {
  text-align: center;
  font-size: 14px;
  color: #4b5563;
}

.link a {
  color: #3b82f6;
  text-decoration: underline;
}

/* Styling untuk Eye Icon */
button[type="button"]:focus {
  outline: none;
}

button[type="button"]:hover {
  background-color: transparent;
}
</style>
