<template>
  <div class="p-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-6">Tambah Produk Baru</h1>

    <div class="flex flex-col gap-4">
      <!-- Nama Produk -->
      <div>
        <label class="label">
          <span class="label-text font-semibold">Nama Produk</span>
        </label>
        <input
          v-model="name"
          type="text"
          placeholder="Masukkan nama produk"
          class="input input-bordered w-full"
        />
      </div>

      <!-- Deskripsi -->
      <div>
        <label class="label">
          <span class="label-text font-semibold">Deskripsi</span>
        </label>
        <textarea
          v-model="description"
          placeholder="Masukkan deskripsi produk"
          class="textarea textarea-bordered w-full"
        ></textarea>
      </div>

      <!-- Status -->
      <div>
        <label class="label">
          <span class="label-text font-semibold">Status</span>
        </label>
        <select v-model="status" class="select select-bordered w-full">
          <option value="publish">Publish</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <!-- Kategori -->
      <div>
        <label class="label">
          <span class="label-text font-semibold">Kategori</span>
        </label>
        <select v-model="category_id" class="select select-bordered w-full">
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Harga -->
      <div>
        <label class="label">
          <span class="label-text font-semibold">Harga</span>
        </label>
        <input
          v-model.number="price"
          type="number"
          placeholder="Masukkan harga produk"
          class="input input-bordered w-full"
        />
      </div>

      <!-- Berat -->
      <div>
        <label class="label">
          <span class="label-text font-semibold">Berat (gram)</span>
        </label>
        <input
          v-model.number="weight"
          type="number"
          placeholder="Masukkan berat produk"
          class="input input-bordered w-full"
        />
      </div>

      <!-- Foto Produk -->
      <div>
        <label class="label">
          <span class="label-text font-semibold">Foto Produk</span>
        </label>
        <input
          type="file"
          @change="onFileChange"
          class="file-input file-input-bordered w-full"
        />
      </div>

      <!-- Tombol Simpan -->
      <button @click="saveProduct" class="btn btn-primary mt-4">
        Simpan Produk
      </button>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      name: "",
      description: "",
      status: "publish",
      category_id: null,
      price: 0,
      weight: 0,
      photoFile: null,
      categories: [],
    };
  },
  methods: {
    onFileChange(e) {
      this.photoFile = e.target.files[0];
    },

    async fetchCategories() {
      try {
        const res = await api.get("/categories");
        this.categories = res.data;
        if (!this.category_id && this.categories.length > 0) {
          this.category_id = this.categories[0].id;
        }
      } catch (err) {
        console.error("Gagal load kategori:", err);
      }
    },

    async saveProduct() {
      try {
        const formData = new FormData();
        formData.append("name", this.name);
        formData.append("description", this.description);
        formData.append("status", this.status);
        formData.append("category_id", this.category_id);
        formData.append("price", this.price);
        formData.append("weight", this.weight);
        if (this.photoFile) {
          formData.append("photo", this.photoFile);
        }

        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("Produk berhasil ditambahkan!");
        this.$router.push("/products");
      } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat menambah produk!");
      }
    },
  },
  mounted() {
    this.fetchCategories();
  },
};
</script>
