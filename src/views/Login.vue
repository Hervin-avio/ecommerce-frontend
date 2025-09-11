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
              <svg
                v-if="!showPassword"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.574 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.574-3.007-9.963-7.178z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.774 3.162 10.066 7.5a10.52 10.52 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l12.544 12.544M17.772 17.772L21 21"
                />
              </svg>
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
