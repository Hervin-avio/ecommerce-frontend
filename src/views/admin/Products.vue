<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Daftar Produk</h1>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <input v-model="searchQuery" type="text" placeholder="Cari produk (nama, kategori, status, dsb.)..."
        class="input input-bordered w-full sm:w-1/3" />
      <router-link to="/products/tambah" class="btn btn-primary cursor-pointer">
        + Tambah Produk
      </router-link>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white shadow rounded-lg">
      <table class="table w-full">
        <thead class="bg-gray-100">
          <tr class="text-left">
            <th>Gambar</th>
            <th>Nama</th>
            <th>Harga</th>
            <th>Status</th>
            <th>Kategori</th>
            <th>Stok</th>
            <th>Created</th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-50">
            <td class="w-24">
              <div class="w-20 h-20 rounded-lg overflow-hidden border bg-gray-50 flex items-center justify-center">
                <img :src="product.photo_url || placeholder" class="w-20 h-20 object-cover rounded-md" />
              </div>
            </td>
            <td>{{ product.name || '-' }}</td>
            <td>Rp {{ Number(product.price || 0).toLocaleString() }}</td>
            <td>
              <span :class="[
                'px-2 py-1 rounded text-xs font-semibold',
                product.status === 'publish' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
              ]">
                {{ product.status || '-' }}
              </span>
            </td>
            <td>{{ product.category?.name || '-' }}</td>
            <td>{{ product.stock || 0 }}</td>
            <td>{{ formatDate(product.created_at) }}</td>
            <td class="text-center">
              <div class="flex justify-center items-center gap-2 h-full">
                <button @click="editProduct(product.id)" class="btn btn-warning btn-sm">Edit</button>
                <button @click="confirmDelete(product.id)" class="btn btn-error btn-sm">Hapus</button>
              </div>
            </td>
          </tr>

          <tr v-if="paginatedProducts.length === 0">
            <td colspan="8" class="text-center py-6 text-gray-500">Produk tidak ditemukan</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-6 items-center space-x-2">
      <button class="btn btn-sm" :disabled="currentPage === 1" @click="prevPage">Prev</button>
      <button v-for="page in totalPages" :key="page" @click="changePage(page)" class="btn btn-sm"
        :class="currentPage === page ? 'btn-primary' : 'btn-ghost'">
        {{ page }}
      </button>
      <button class="btn btn-sm" :disabled="currentPage === totalPages" @click="nextPage">Next</button>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  data() {
    return {
      products: [],
      searchQuery: '',
      currentPage: 1,
      perPage: 10,
      placeholder: 'https://via.placeholder.com/150',
    };
  },
  computed: {
    filteredProducts() {
      const q = this.searchQuery.toLowerCase().trim();
      if (!q) return this.products;
      return this.products.filter(p =>
        [p.name, p.status, p.category?.name].some(f => f?.toLowerCase().includes(q))
      );
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredProducts.length / this.perPage));
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredProducts.slice(start, start + this.perPage);
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await api.get('/products');
        let data = Array.isArray(res.data) ? res.data : res.data.data || [];

        // Urutkan berdasarkan updated_at terbaru dulu, kalau updated_at sama, gunakan created_at
        data.sort((a, b) => {
          const dateA = new Date(a.updated_at || a.created_at);
          const dateB = new Date(b.updated_at || b.created_at);
          return dateB - dateA;
        });

        this.products = data;
        this.currentPage = 1; // reset ke halaman 1 agar produk terbaru terlihat
      } catch (err) {
        console.error('Gagal fetch produk:', err);
      }
    },
    formatDate(dt) {
      if (!dt) return '-';
      try {
        return new Date(dt).toLocaleDateString();
      } catch {
        return dt;
      }
    },
    editProduct(id) {
      this.$router.push(`/products/edit/${id}`);
    },
    async confirmDelete(id) {
      if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        await this.deleteProduct(id);
      }
    },
    async deleteProduct(id) {
      try {
        await api.delete(`/products/${id}`);
        this.products = this.products.filter(p => p.id !== id);
      } catch (err) {
        console.error('Gagal hapus produk:', err);
        alert('Gagal menghapus produk.');
      }
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    changePage(page) {
      this.currentPage = page;
    },
  },
  mounted() {
    this.fetchProducts();
  }
};
</script>
