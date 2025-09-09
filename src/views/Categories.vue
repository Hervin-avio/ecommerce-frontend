<script>
import api from '../services/api';

export default {
  data() {
    return {
      categories: [],
      error: null,
    };
  },
  methods: {
    async loadCategories() {
      try {
        const token = localStorage.getItem('token'); // ambil token
        const res = await api.get('/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.categories = res.data;
      } catch (err) {
        this.error = 'Gagal memuat kategori';
      }
    },
  },
  mounted() {
    this.loadCategories(); // ✅ langsung dipanggil saat halaman dibuka
  },
};
</script>

<template>
  <div>
    <h2>Daftar Kategori</h2>

    <ul>
      <li v-for="cat in categories" :key="cat.id">{{ cat.name }}</li>
    </ul>

    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>
