<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto flex justify-between items-center p-4">
      <!-- Logo -->
      <h1
        class="text-2xl font-bold text-blue-600 cursor-pointer"
        @click="$router.push('/')"
      >
        E-Commerce
      </h1>

      <!-- Kategori -->
      <div class="flex items-center space-x-3">
        <button
          :class="['btn btn-ghost btn-sm', activeCategory === null ? 'btn-active text-blue-600 font-bold' : '']"
          @click="selectCategory(null)"
        >
          All
        </button>
        <button
          v-for="cat in categories.slice(0, 4)"
          :key="cat.id"
          :class="['btn btn-ghost btn-sm', activeCategory === cat.id ? 'btn-active text-blue-600 font-bold' : '']"
          @click="selectCategory(cat.id)"
        >
          {{ cat.name }}
        </button>

        <!-- Dropdown jika kategori lebih dari 4 -->
        <div v-if="categories.length > 4" class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-sm">Lainnya ▼</label>
          <ul
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-white rounded-box w-52"
          >
            <li v-for="cat in categories.slice(4)" :key="cat.id">
              <a
                @click="selectCategory(cat.id)"
                :class="activeCategory === cat.id ? 'font-bold text-blue-600' : ''"
              >
                {{ cat.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Search & User -->
      <div class="flex items-center space-x-3">
        <input
          v-model="search"
          type="text"
          placeholder="Cari produk..."
          class="input input-bordered input-sm"
          @input="searchProducts"
        />
        <router-link to="/checkout" class="btn btn-primary btn-sm">Checkout</router-link>
        <span class="font-medium">{{ user?.name }}</span>
        <button @click="logout" class="btn btn-outline btn-sm">Logout</button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "NavbarPelanggan",
  props: {
    categories: { type: Array, default: () => [] },
    activeCategory: { type: Number, default: null },
    user: { type: Object, required: true },
  },
  data() {
    return {
      search: "",
    };
  },
  methods: {
    selectCategory(id) {
      this.$emit("filter-category", id);
    },
    searchProducts() {
      this.$emit("search", this.search);
    },
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("cart");
      this.$router.push("/login");
    },
  },
};
</script>
