<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
    <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <h2 class="text-3xl font-bold mb-6 text-center text-blue-600">Login</h2>

      <form @submit.prevent="login" class="space-y-5">
        <!-- Email -->
        <div>
          <label class="block mb-1 font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="input input-bordered w-full focus:ring focus:ring-blue-400"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block mb-1 font-medium text-gray-700">Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              required
              class="input input-bordered w-full pr-10 focus:ring focus:ring-blue-400"
            />
            <button
              type="button"
              @click="togglePassword"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-blue-600 cursor-pointer"
            >
              <!-- Eye icon for password visibility -->
            </button>
          </div>
        </div>

        <!-- Tombol Login -->
        <button
          type="submit"
          class="btn btn-primary w-full cursor-pointer"
        >
          Login
        </button>
      </form>

      <!-- Error -->
      <p v-if="error" class="text-red-500 mt-3 text-center">{{ error }}</p>

      <!-- Link Lupa Password -->
      <p class="mt-4 text-center text-sm text-gray-600">
        <router-link
          to="/forgot-password"
          class="text-blue-500 font-medium hover:underline"
          >Lupa Password?</router-link
        >
      </p>

      <!-- Link Register -->
      <p class="mt-6 text-center text-sm text-gray-600">
        Belum punya akun?
        <router-link
          to="/register"
          class="text-blue-500 font-medium hover:underline"
          >Register</router-link
        >
      </p>

      <!-- Link Back to Home -->
      <p class="mt-2 text-center text-sm text-gray-600">
        <router-link to="/" class="text-blue-500 font-medium hover:underline"
          >← Back to Home</router-link
        >
      </p>
    </div>
  </div>
</template>


<script>
import api from "../services/api";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      error: null,
      showPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      try {
        const res = await api.post("/login", {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        const role = res.data.user.role;

        if (role === "admin") {
          this.$router.push("/dashboard");
        } else {
          this.$router.push("/");
        }
      } catch (err) {
        this.error = "Login gagal. Periksa email/password.";
      }
    },
  },
};
</script>
