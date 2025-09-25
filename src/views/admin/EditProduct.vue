<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Edit Produk</h1>
    <form @submit.prevent="updateProduct" class="space-y-4" enctype="multipart/form-data">
      
      <!-- Nama Produk -->
      <div>
        <label class="label">Nama Produk</label>
        <input v-model="form.name" type="text" class="input input-bordered w-full" required />
      </div>

      <!-- Deskripsi Produk -->
      <div>
        <label class="label">Deskripsi</label>
        <textarea v-model="form.description" class="textarea textarea-bordered w-full"></textarea>
      </div>

      <!-- Status Produk -->
      <div>
        <label class="label">Status</label>
        <select v-model="form.status" class="select select-bordered w-full">
          <option value="publish">Publish</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <!-- Kategori Produk -->
      <div>
        <label class="label">Kategori</label>
        <select v-model="form.category_id" class="select select-bordered w-full">
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <!-- Harga Produk -->
      <div>
        <label class="label">Harga</label>
        <input v-model="form.price" type="number" class="input input-bordered w-full" required />
      </div>

      <!-- Berat Produk -->
      <div>
        <label class="label">Berat (gram)</label>
        <input v-model="form.weight" type="number" class="input input-bordered w-full" />
      </div>

      <!-- Stok Produk -->
      <div>
        <label class="label">Stok</label>
        <input v-model="form.stock" type="number" class="input input-bordered w-full" required />
      </div>

      <!-- Foto Produk Saat Ini -->
      <div>
        <label class="label">Foto Produk Saat Ini</label>
        <img :src="form.photo_url || placeholder" class="w-32 h-32 object-cover rounded mb-2" />
        <input type="file" @change="handleFileUpload" class="input input-bordered w-full" />
      </div>

      <!-- Tombol Update -->
      <button class="btn btn-primary w-full" type="submit">Update</button>
    </form>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  data() {
    return {
      form: {},
      categories: [],
      productId: null,
      selectedFile: null,
      placeholder: 'https://via.placeholder.com/150',
    };
  },
  methods: {
    // Ambil daftar kategori dari API
    async fetchCategories() {
      try {
        const res = await api.get('/categories');
        this.categories = res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // Ambil data produk untuk diedit
    async fetchProduct() {
      try {
        const res = await api.get(`/products/${this.productId}`);
        this.form = { ...res.data };
      } catch (err) {
        console.error(err);
      }
    },

    // Tangani upload foto produk
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },

    // Update produk dengan data baru
    async updateProduct() {
      try {
        const formData = new FormData();
        formData.append('name', this.form.name);
        formData.append('description', this.form.description || '');
        formData.append('status', this.form.status);
        formData.append('category_id', this.form.category_id);
        formData.append('price', this.form.price);
        formData.append('weight', this.form.weight || 0);
        formData.append('stock', this.form.stock); // Menambahkan stok ke dalam form data

        // Jika ada foto baru, tambahkan foto ke dalam form data
        if (this.selectedFile) {
          formData.append('photo', this.selectedFile);
        }

        // Kirimkan permintaan POST untuk update produk
        await api.post(`/products/${this.productId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-HTTP-Method-Override': 'PUT', // Agar Laravel mengenali sebagai PUT
          },
        });

        alert('Produk berhasil diupdate!');
        this.$router.push('/products'); // Kembali ke halaman produk setelah update
      } catch (err) {
        console.error('Gagal update produk:', err);
        alert('Gagal update produk.');
      }
    },
  },
  mounted() {
    this.productId = this.$route.params.id;
    this.fetchCategories();
    this.fetchProduct();
  },
};
</script>
