<template>
  <div class="min-h-screen bg-gray-50">
    <component :is="user ? 'NavbarPelanggan' : 'NavbarHome'" :user="user" :categories="categories"
      :currentCategory="activeCategory" @filter-category="filterByCategory" @search="searchProducts" />

    <!-- Hero Banner -->
    <section class="bg-blue-100 py-16 text-center mb-8">
      <h2 class="text-4xl font-bold text-blue-700 mb-2">
        Selamat Datang di Toko Kami
      </h2>
      <p class="text-gray-700 text-lg">
        Temukan produk terbaik sesuai kebutuhan Anda
      </p>
    </section>

    <!-- Grid Produk -->
    <main class="container mx-auto px-4 pb-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="product in paginatedProducts" :key="product.id"
          class="card card-compact bg-white shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
          <figure class="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img :src="product.photo_url || 'https://via.placeholder.com/300x200?text=No+Image'" :alt="product.name"
              class="w-full h-full object-contain" />
          </figure>
          <div class="card-body flex flex-col justify-between">
            <h3 class="card-title text-lg font-semibold truncate">
              {{ product.name }}
            </h3>

            <!-- Harga -->
            <p class="text-blue-600 font-bold">
              Rp {{ Number(product.price).toLocaleString() }}
            </p>

            <!-- Stok -->
            <p class="text-sm text-gray-600">Stok: {{ product.stock ?? 0 }}</p>

            <!-- Tombol Aksi -->
            <div class="card-actions mt-auto flex gap-2">
              <button @click="addToCart(product)"
                class="btn btn-outline btn-sm flex-1 hover:bg-blue-500 hover:text-white">
                🛒 Keranjang
              </button>
              <button @click="buyNow(product)" class="btn btn-primary btn-sm flex-1">
                Beli
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-6 space-x-2">
        <button class="btn btn-sm" :disabled="currentPage === 1" @click="currentPage--">
          Prev
        </button>
        <span class="btn btn-sm normal-case">
          Halaman {{ currentPage }} dari {{ totalPages }}
        </span>
        <button class="btn btn-sm" :disabled="currentPage === totalPages" @click="currentPage++">
          Next
        </button>
      </div>
    </main>


    <!-- Toast -->
    <transition name="fade">
      <div v-if="toast.show" class="toast toast-top toast-end z-50">
        <div class="alert" :class="{
          'alert-success': toast.type === 'success',
          'alert-info': toast.type === 'info',
          'alert-warning': toast.type === 'warning',
          'alert-error': toast.type === 'error'
        }">
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import NavbarHome from "@/components/NavbarHome.vue";
import NavbarPelanggan from "@/components/NavbarPelanggan.vue";
import api from "@/services/api";

export default {
  components: { NavbarHome, NavbarPelanggan },
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || null,
      products: [],
      categories: [],
      activeCategory: null,
      searchQuery: "",
      currentPage: 1,
      perPage: 8,
      toast: { show: false, message: "", type: "info" },
    };
  },
  computed: {
    filteredProducts() {
      let temp = this.products;
      if (this.activeCategory)
        temp = temp.filter((p) => p.category?.id === this.activeCategory);
      if (this.searchQuery) {
        const s = this.searchQuery.toLowerCase();
        temp = temp.filter((p) => p.name.toLowerCase().includes(s));
      }
      return temp;
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredProducts.slice(start, start + this.perPage);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.perPage) || 1;
    },
  },
  watch: {
    "$route.query.category"(val) {
      this.activeCategory = val ? parseInt(val) : null;
    },
  },
  methods: {
    filterByCategory(id) {
      this.activeCategory = id;
      this.$router.push({ path: "/", query: { category: id } });
    },
    searchProducts(query) {
      this.searchQuery = query;
    },
    showToast(msg, type = "info") {
      this.toast.message = msg;
      this.toast.type = type;
      this.toast.show = true;
      setTimeout(() => (this.toast.show = false), 2000);
    },
    addToCart(product) {
      if (!this.user) {
        this.showToast("Silakan login terlebih dahulu!", "warning");
        setTimeout(() => this.$router.push("/login"), 800);
        return;
      }
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const index = cart.findIndex((c) => c.id === product.id);
      if (index >= 0) cart[index].quantity++;
      else cart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      this.showToast("Produk ditambahkan ke keranjang!", "success");
    },
    buyNow(product) {
      if (!this.user) {
        this.showToast("Silakan login terlebih dahulu!", "warning");
        setTimeout(() => this.$router.push("/login"), 800);
        return;
      }
      localStorage.setItem(
        "cart",
        JSON.stringify([{ ...product, quantity: 1 }])
      );
      this.$router.push("/checkout");
    },
  },
  async mounted() {
    try {
      const catRes = await api.get("/categories");
      this.categories = catRes.data;
      const prodRes = await api.get("/products");
      this.products = prodRes.data;
    } catch (e) {
      console.error(e);
    }
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
