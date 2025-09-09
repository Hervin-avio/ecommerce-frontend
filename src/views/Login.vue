<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async login() {
      try {
        const res = await api.post('/login', {
          email: this.email,
          password: this.password,
        });

        // simpan token
        localStorage.setItem('token', res.data.token);

        // ✅ langsung redirect tanpa popup
        this.$router.push('/categories');
      } catch (err) {
        this.error = 'Login gagal. Periksa email/password.';
      }
    },
  },
};
</script>

<style scoped>
.login {
  max-width: 300px;
  margin: auto;
  padding: 1rem;
}
</style>
