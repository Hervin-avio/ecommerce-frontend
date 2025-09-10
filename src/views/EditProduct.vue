<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Edit Produk</h1>
    <form @submit.prevent="updateProduct" class="space-y-4" enctype="multipart/form-data">
      <div>
        <label class="label">Nama Produk</label>
        <input v-model="form.name" type="text" class="input input-bordered w-full" required />
      </div>

      <div>
        <label class="label">Deskripsi</label>
        <textarea v-model="form.description" class="textarea textarea-bordered w-full"></textarea>
      </div>

      <div>
        <label class="label">Status</label>
        <select v-model="form.status" class="select select-bordered w-full">
          <option value="publish">Publish</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div>
        <label class="label">Kategori</label>
        <select v-model="form.category_id" class="select select-bordered w-full">
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <div>
        <label class="label">Harga</label>
        <input v-model="form.price" type="number" class="input input-bordered w-full" required />
      </div>

      <div>
        <label class="label">Berat (gram)</label>
        <input v-model="form.weight" type="number" class="input input-bordered w-full" />
      </div>

      <div>
        <label class="label">Foto Produk Saat Ini</label>
        <img :src="form.photo_url || placeholder" class="w-32 h-32 object-cover rounded mb-2" />
        <input type="file" @change="handleFileUpload" class="input input-bordered w-full" />
      </div>

      <button class="btn btn-primary w-full" type="submit">Update</button>
    </form>
  </div>
</template>

<script>
import api from '../services/api';

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
    async fetchCategories() {
      try {
        const res = await api.get('/categories');
        this.categories = res.data;
      } catch (err) {
        console.error(err);
      }
    },
    async fetchProduct() {
      try {
        const res = await api.get(`/products/${this.productId}`);
        this.form = { ...res.data };
      } catch (err) {
        console.error(err);
      }
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
    async updateProduct() {
      try {
        const formData = new FormData();
        formData.append('name', this.form.name);
        formData.append('description', this.form.description || '');
        formData.append('status', this.form.status);
        formData.append('category_id', this.form.category_id);
        formData.append('price', this.form.price);
        formData.append('weight', this.form.weight || 0);

        if (this.selectedFile) {
          formData.append('photo', this.selectedFile);
        }

        await api.post(`/products/${this.productId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-HTTP-Method-Override': 'PUT', // supaya Laravel bisa menerima sebagai PUT
          },
        });

        alert('Produk berhasil diupdate!');
        this.$router.push('/products');
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
