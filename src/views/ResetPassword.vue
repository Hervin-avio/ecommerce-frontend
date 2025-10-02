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

      <!-- Error / Success Message -->
      <p v-if="error" class="text-red-500 mt-3 text-center">{{ error }}</p>
      <p v-if="message" class="text-green-500 mt-3 text-center">{{ message }}</p>

      <!-- Link Back to Login -->
      <p class="mt-6 text-center text-sm text-gray-600">
        <router-link to="/login" class="text-blue-500 font-medium hover:underline">Back to Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      email: this.$route.query.email || "",
      token: this.$route.query.token || "",
      newPassword: "",
      confirmPassword: "",
      isSubmitting: false,
      error: "",
      message: "",
      showNewPassword: false,
      showConfirmPassword: false,
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
      this.error = "";
      this.message = "";

      if (this.newPassword !== this.confirmPassword) {
        this.error = "Passwords do not match!";
        return;
      }

      this.isSubmitting = true;

      try {
        const response = await api.post("/reset-password", {
          email: this.email,
          token: this.token,
          password: this.newPassword,
          password_confirmation: this.confirmPassword,
        });

        this.message = response.data.message || "Password has been reset successfully!";
        this.newPassword = "";
        this.confirmPassword = "";

        setTimeout(() => {
          this.$router.push("/login");
        }, 1500);

      } catch (err) {
        this.error = err.response?.data?.message || "Error resetting password";
        console.error(err);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
