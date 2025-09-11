<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto flex items-center justify-between p-4">
      <!-- Logo + Hamburger (mobile) -->
      <div class="flex items-center gap-3 w-1/4">
        <button class="lg:hidden btn btn-ghost btn-sm" @click="mobileMenu = !mobileMenu">
          ☰
        </button>
        <router-link to="/" class="text-2xl font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
          E-Commerce
        </router-link>
      </div>

      <!-- Kategori (desktop only) -->
      <div class="hidden lg:flex w-2/4 justify-center">
        <div class="flex items-center gap-2">
          <!-- All -->
          <button :class="[
            'btn btn-ghost btn-sm',
            localActiveCategory === null
              ? 'btn-active bg-blue-100 text-blue-600 font-bold'
              : ''
          ]" @click="setActiveCategory(null)">
            All
          </button>

          <!-- 5 kategori awal -->
          <button v-for="cat in categories.slice(0, 5)" :key="cat.id" :class="[
            'btn btn-ghost btn-sm',
            localActiveCategory === cat.id
              ? 'btn-active bg-blue-100 text-blue-600 font-bold'
              : ''
          ]" @click="setActiveCategory(cat.id)">
            {{ cat.name }}
          </button>

          <!-- Dropdown kategori tambahan -->
          <div v-if="categories.length > 5" class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-sm">Lainnya ▼</label>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-white rounded-box w-52">
              <li v-for="cat in categories.slice(5)" :key="cat.id">
                <a @click="setActiveCategory(cat.id)" :class="localActiveCategory === cat.id
                    ? 'font-bold text-blue-600 bg-blue-100'
                    : ''
                  ">
                  {{ cat.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Search & User -->
      <div class="w-1/4 flex justify-end items-center gap-2">
        <input v-model="search" @input="$emit('search', search)" type="text" placeholder="Cari produk..."
          class="input input-bordered input-sm w-40 hidden sm:block" />

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

    <!-- Mobile menu -->
    <div v-if="mobileMenu" class="lg:hidden bg-white border-t shadow-md p-4">
      <!-- Search -->
      <input v-model="search" @input="$emit('search', search)" type="text" placeholder="Cari produk..."
        class="input input-bordered input-sm w-full mb-3" />

      <!-- Kategori -->
      <div class="flex flex-wrap gap-2">
        <button :class="[
          'btn btn-ghost btn-sm',
          localActiveCategory === null
            ? 'btn-active bg-blue-100 text-blue-600 font-bold'
            : ''
        ]" @click="setActiveCategory(null)">
          All
        </button>
        <button v-for="cat in categories" :key="cat.id" :class="[
          'btn btn-ghost btn-sm',
          localActiveCategory === cat.id
            ? 'btn-active bg-blue-100 text-blue-600 font-bold'
            : ''
        ]" @click="setActiveCategory(cat.id)">
          {{ cat.name }}
        </button>
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
      localActiveCategory: this.activeCategory,
      mobileMenu: false,
    };
  },
  watch: {
    activeCategory(newVal) {
      this.localActiveCategory = newVal;
    },
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
    setActiveCategory(catId) {
      this.localActiveCategory = catId;
      this.$emit("filter-category", catId);
      this.mobileMenu = false; // auto close di mobile
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
/* optional custom styling */
</style>
