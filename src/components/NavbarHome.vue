<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto flex flex-wrap justify-between items-center p-4">
      <!-- Logo -->
      <h1 class="text-2xl font-bold text-blue-600">E-Commerce</h1>

      <!-- Kategori -->
      <div class="flex items-center space-x-3 flex-wrap mt-2 sm:mt-0">
        <button
          :class="['btn btn-ghost btn-sm', activeCategory === null ? 'btn-active text-blue-600 font-bold' : '']"
          @click="$emit('filter-category', null)">
          All
        </button>

        <button
          v-for="cat in categories.slice(0,4)"
          :key="cat.id"
          :class="['btn btn-ghost btn-sm', activeCategory === cat.id ? 'btn-active text-blue-600 font-bold' : '']"
          @click="$emit('filter-category', cat.id)">
          {{ cat.name }}
        </button>

        <!-- Dropdown untuk kategori tambahan -->
        <div v-if="categories.length > 4" class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-sm">Lainnya ▼</label>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-white rounded-box w-52">
            <li v-for="cat in categories.slice(4)" :key="cat.id">
              <a
                @click="$emit('filter-category', cat.id)"
                :class="activeCategory === cat.id ? 'font-bold text-blue-600' : ''">
                {{ cat.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Search & Login/User -->
      <div class="flex items-center space-x-2 mt-2 sm:mt-0">
        <input
          v-model="search"
          @input="$emit('search', search)"
          type="text"
          placeholder="Cari produk..."
          class="input input-bordered input-sm"
        />

        <div v-if="!user">
          <router-link to="/login" class="btn btn-primary btn-sm">Login</router-link>
        </div>

        <div v-else class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-sm">{{ user.name }} ▼</label>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-white rounded-box w-52">
            <li><a @click="logout">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import api from "../services/api";

export default {
  props: {
    activeCategory: { type: [Number, null], default: null },
  },
  data() {
    return {
      categories: [],
      search: "",
      user: JSON.parse(localStorage.getItem("user")) || null,
    };
  },
  methods: {
    async loadCategories() {
      try {
        const res = await api.get("/categories");
        this.categories = res.data;
      } catch (err) {
        console.error("Gagal load kategori:", err);
      }
    },
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      this.user = null;
      this.$router.push("/login");
    },
  },
  mounted() {
    this.loadCategories();
  },
};
</script>

<style scoped>
/* Tambahkan styling jika perlu */
</style>
