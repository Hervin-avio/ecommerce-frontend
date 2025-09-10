<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Daftar Produk</h1>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari produk (nama, kategori, status, dsb.)..."
        class="input input-bordered w-full sm:w-1/3"
      />
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
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-semibold',
                  product.status === 'publish' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                ]"
              >
                {{ product.status || '-' }}
              </span>
            </td>
            <td>{{ product.category?.name || '-' }}</td>
            <td>{{ formatDate(product.created_at) }}</td>
            <td class="text-center flex justify-center gap-2">
              <button @click="editProduct(product.id)" class="btn btn-warning btn-sm">Edit</button>
              <button @click="confirmDelete(product.id)" class="btn btn-error btn-sm">Hapus</button>
            </td>
          </tr>

          <tr v-if="paginatedProducts.length === 0">
            <td colspan="7" class="text-center py-6 text-gray-500">Produk tidak ditemukan</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-6 items-center space-x-2">
      <button class="btn btn-sm" :disabled="currentPage === 1" @click="prevPage">Prev</button>
      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        class="btn btn-sm"
        :class="currentPage === page ? 'btn-primary' : 'btn-ghost'"
      >
        {{ page }}
      </button>
      <button class="btn btn-sm" :disabled="currentPage === totalPages" @click="nextPage">Next</button>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-black bg-opacity-40 absolute inset-0"></div>
      <div class="bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-md">
        <h3 class="text-lg font-bold mb-2">Konfirmasi Hapus</h3>
        <p class="mb-4">Apakah Anda yakin ingin menghapus produk ini?</p>
        <div class="flex justify-end gap-3">
          <button @click="showDeleteModal = false" class="btn">Batal</button>
          <button @click="deleteProduct" class="btn btn-error">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      products: [],
      searchQuery: '',
      currentPage: 1,
      perPage: 10,
      showDeleteModal: false,
      productToDelete: null,
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
        this.products = Array.isArray(res.data) ? res.data : res.data.data || [];
      } catch (err) {
        console.error('Gagal fetch produk:', err);
      }
    },
    formatDate(dt) {
      if (!dt) return '-';
      try { return new Date(dt).toLocaleDateString(); } catch { return dt; }
    },
    editProduct(id) {
      this.$router.push(`/products/edit/${id}`);
    },
    confirmDelete(id) {
      this.productToDelete = id;
      this.showDeleteModal = true;
    },
    async deleteProduct() {
      if (!this.productToDelete) return;
      try {
        await api.delete(`/products/${this.productToDelete}`);
        this.products = this.products.filter(p => p.id !== this.productToDelete);
        this.showDeleteModal = false;
        this.productToDelete = null;
      } catch (err) {
        console.error('Gagal hapus produk:', err);
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>
