<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- Judul -->
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Catalog</h1>

    <!-- Filter kategori (sementara statis) -->
    <div class="flex gap-6 mb-8 text-gray-600">
      <button
        v-for="cat in categories"
        :key="cat"
        class="hover:text-blue-600 transition"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Grid Produk -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white shadow-md rounded-2xl p-4 hover:shadow-xl transition"
      >
        <!-- Gambar -->
        <img
          :src="product.photo || 'https://via.placeholder.com/300x200?text=No+Image'"
          :alt="product.name"
          class="w-full h-48 object-cover rounded-xl mb-4"
        />

        <!-- Nama Produk -->
        <h2 class="font-semibold text-lg text-gray-800 mb-2">
          {{ product.name }}
        </h2>

        <!-- Harga -->
        <p class="text-blue-600 font-bold mb-2">
          ${{ parseFloat(product.price).toLocaleString() }}
        </p>

        <!-- Deskripsi -->
        <p class="text-sm text-gray-600 mb-4">
          {{ product.description }}
        </p>

        <!-- Tombol Aksi -->
        <div class="flex justify-end">
          <button
            class="p-2 rounded-full border border-gray-300 hover:bg-blue-500 hover:text-white transition"
          >
            +
          </button>
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
      categories: ["All", "Beauty", "Food", "Shopping", "Travel"],
    };
  },
  async created() {
    try {
      const res = await api.get("/products");

      // Sekarang backend sudah mengirim photo sebagai URL lengkap
      this.products = res.data.map((p) => ({
        ...p,
        // bersihkan backslash jika ada
        photo: p.photo ? p.photo.replace(/\\/g, "") : null,
      }));
    } catch (err) {
      console.error("Gagal load products:", err);
    }
  },
};
</script>
