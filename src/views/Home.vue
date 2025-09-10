<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="container mx-auto flex justify-between items-center p-4">
        <h1 class="text-2xl font-bold text-blue-600">E-Commerce</h1>

        <!-- Kategori -->
        <div class="flex items-center space-x-3">
          <button
            :class="['btn btn-ghost btn-sm', activeCategory === null ? 'btn-active text-blue-600 font-bold' : '']"
            @click="filterByCategory(null)"
          >All</button>

          <button
            v-for="cat in categories.slice(0,4)"
            :key="cat.id"
            :class="['btn btn-ghost btn-sm', activeCategory === cat.id ? 'btn-active text-blue-600 font-bold' : '']"
            @click="filterByCategory(cat.id)"
          >
            {{ cat.name }}
          </button>

          <div v-if="categories.length > 4" class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-sm">Lainnya ▼</label>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-white rounded-box w-52">
              <li v-for="cat in categories.slice(4)" :key="cat.id">
                <a
                  @click="filterByCategory(cat.id)"
                  :class="activeCategory === cat.id ? 'font-bold text-blue-600' : ''"
                >
                  {{ cat.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Search & Login -->
        <div class="flex items-center space-x-2">
          <input
            v-model="search"
            type="text"
            placeholder="Cari produk..."
            class="input input-bordered input-sm"
          />
          <router-link v-if="!user" to="/login" class="btn btn-primary btn-sm">Login</router-link>
          <button v-else @click="logout" class="btn btn-error btn-sm">Logout</button>
        </div>
      </div>
    </nav>

    <!-- Hero Banner -->
    <section class="bg-blue-100 py-16 text-center mb-8">
      <h2 class="text-4xl font-bold text-blue-700 mb-2">Selamat Datang di Toko Kami</h2>
      <p class="text-gray-700 text-lg">Temukan produk terbaik sesuai kebutuhan Anda</p>
    </section>

    <!-- Grid Produk -->
    <main class="container mx-auto px-4 pb-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="card card-compact bg-white shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
        >
          <figure class="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              :src="product.photo_url || 'https://via.placeholder.com/300x200?text=No+Image'"
              :alt="product.name"
              class="w-full h-full object-contain"
            />
          </figure>
          <div class="card-body flex flex-col justify-between">
            <h3 class="card-title text-lg font-semibold truncate">{{ product.name }}</h3>
            <p class="text-blue-600 font-bold mb-2">Rp {{ Number(product.price).toLocaleString() }}</p>
            <div class="card-actions mt-auto flex gap-2">
              <button
                @click="addToCart(product)"
                class="btn btn-outline btn-sm flex-1 hover:bg-blue-500 hover:text-white"
              >
                🛒 Keranjang
              </button>
              <button
                @click="buyNow(product)"
                class="btn btn-primary btn-sm flex-1"
              >
                Beli
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-6 space-x-2">
        <button class="btn btn-sm" :disabled="currentPage === 1" @click="currentPage--">Prev</button>
        <span class="btn btn-sm normal-case">Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <button class="btn btn-sm" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
      </div>
    </main>

    <!-- Toast DaisyUI -->
    <div class="fixed top-5 right-5 z-50 space-y-2">
      <div
        v-for="(t, index) in toasts"
        :key="index"
        :class="['alert shadow-lg', t.type === 'error' ? 'alert-error' : 'alert-success']"
      >
        <div>
          <span>{{ t.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      products: [],
      categories: [],
      activeCategory: null,
      search: "",
      currentPage: 1,
      perPage: 8,
      user: null,
      toasts: [],
    };
  },
  computed: {
    filteredProducts() {
      let temp = this.products;
      if (this.activeCategory) {
        temp = temp.filter(p => p.category?.id === this.activeCategory);
      }
      if (this.search) {
        const s = this.search.toLowerCase();
        temp = temp.filter(p => p.name.toLowerCase().includes(s));
      }
      return temp;
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.perPage) || 1;
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredProducts.slice(start, start + this.perPage);
    }
  },
  methods: {
    filterByCategory(id) {
      this.activeCategory = id;
      this.currentPage = 1;
    },
    showToast(message, type = "success") {
      this.toasts.push({ message, type });
      setTimeout(() => this.toasts.shift(), 2000);
    },
    addToCart(product) {
      if (!this.user) {
        this.showToast("Silakan login terlebih dahulu!", "error");
        return this.$router.push("/login");
      }

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const index = cart.findIndex(c => c.id === product.id);
      if (index >= 0) cart[index].quantity++;
      else cart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      this.showToast("Produk ditambahkan ke keranjang!");
    },
    buyNow(product) {
      if (!this.user) {
        this.showToast("Silakan login terlebih dahulu!", "error");
        return this.$router.push("/login");
      }
      let cart = [{ ...product, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(cart));
      this.$router.push("/checkout");
    },
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      this.user = null;
      this.showToast("Berhasil logout!", "success");
      this.$router.push("/login");
    }
  },
  async mounted() {
    this.user = JSON.parse(localStorage.getItem("user")) || null;

    try {
      const catRes = await api.get("/categories");
      this.categories = catRes.data;

      const prodRes = await api.get("/products");
      this.products = prodRes.data.map(p => {
        let url = p.photo_url || null;
        if (url && !url.startsWith("http")) {
          url = `${import.meta.env.VITE_API_BASE_URL}/storage/${url}`;
        }
        return { ...p, photo_url: url };
      });
    } catch (err) {
      console.error("Gagal load data:", err);
    }
  }
};
</script>

<style scoped>
.card img {
  transition: transform 0.3s;
}
.card:hover img {
  transform: scale(1.05);
}
</style>
