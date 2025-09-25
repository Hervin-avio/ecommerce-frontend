<template>
  <div class="p-6 flex flex-col lg:flex-row gap-6">

    <!-- ✅ Modal Konfirmasi Hapus -->
    <div v-if="showDeleteModal" class="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-96 border border-gray-200">
        <h3 class="text-lg font-bold mb-4">Konfirmasi Hapus</h3>
        <p class="mb-6">Apakah Anda yakin ingin menghapus kategori ini?</p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="btn btn-outline btn-sm btn-neutral"
          >
            Batal
          </button>
          <button
            @click="confirmDelete"
            class="btn btn-sm btn-error"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ Toast Notification -->
    <transition name="fade">
      <div
        v-if="toast.show"
        :class="[ 
          'fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white z-50',
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        ]"
      >
        {{ toast.message }}
      </div>
    </transition>

    <!-- Form Tambah / Edit Kategori -->
    <div class="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'Edit Kategori' : 'Tambah Kategori' }}</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input
          v-model="name"
          type="text"
          placeholder="Nama Kategori"
          class="input input-bordered w-full focus:outline-none focus:ring focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          class="btn btn-primary w-full"
        >
          {{ isEdit ? 'Update' : 'Tambah' }}
        </button>
        <button
          v-if="isEdit"
          type="button"
          @click="cancelEdit"
          class="btn btn-neutral w-full"
        >
          Batal
        </button>
      </form>
    </div>

    <!-- Tabel List Kategori -->
    <div class="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-lg overflow-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">List Kategori</h2>
        <!-- ✅ Input Search -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari kategori..."
          class="input input-bordered w-64 focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>

      <table class="w-full table-auto border-collapse border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2">Nama</th>
            <th class="border px-4 py-2">Created At</th>
            <th class="border px-4 py-2">Updated At</th>
            <th class="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in filteredCategories" :key="cat.id">
            <td class="border px-4 py-2">{{ cat.name }}</td>
            <td class="border px-4 py-2">{{ formatDate(cat.created_at) }}</td>
            <td class="border px-4 py-2">{{ formatDate(cat.updated_at) }}</td>
            <td class="border px-4 py-2 flex justify-center items-center gap-2">
              <button
                @click="editCategory(cat)"
                class="btn btn-warning btn-sm"
              >
                Edit
              </button>
              <button
                @click="openDeleteModal(cat.id)"
                class="btn btn-error btn-sm"
              >
                Hapus
              </button>
            </td>
          </tr>
          <tr v-if="filteredCategories.length === 0">
            <td colspan="4" class="text-center py-4 text-gray-500">Kategori tidak ditemukan</td>
          </tr>
        </tbody>
      </table>
    </div>   
  </div>
 </template>

<script>
import api from '../../services/api'


export default {
  name: 'Categories',
  data() {
    return {
      categories: [],
      name: '',
      isEdit: false,
      editId: null,
      deleteId: null,
      showDeleteModal: false,
      searchQuery: '',
      toast: {
        show: false,
        message: '',
        type: 'success',
      },
    }
  },
  mounted() {
    this.fetchCategories()
  },
  computed: {
    filteredCategories() {
      if (!this.searchQuery) return this.categories
      return this.categories.filter(cat =>
        cat.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await api.get('/categories')
        this.categories = res.data
      } catch {
        this.showToast('Gagal mengambil data kategori', 'error')
      }
    },
    async handleSubmit() {
      try {
        if (this.isEdit) {
          await api.put(`/categories/${this.editId}`, { name: this.name })
          this.showToast('Kategori berhasil diupdate', 'success')
          this.isEdit = false
          this.editId = null
        } else {
          await api.post('/categories', { name: this.name })
          this.showToast('Kategori berhasil ditambahkan', 'success')
        }
        this.name = ''
        this.fetchCategories()
      } catch {
        this.showToast('Gagal menyimpan kategori', 'error')
      }
    },
    editCategory(cat) {
      this.isEdit = true
      this.editId = cat.id
      this.name = cat.name
    },
    cancelEdit() {
      this.isEdit = false
      this.editId = null
      this.name = ''
    },
    openDeleteModal(id) {
      this.deleteId = id
      this.showDeleteModal = true
    },
    async confirmDelete() {
      try {
        await api.delete(`/categories/${this.deleteId}`)
        this.showToast('Kategori berhasil dihapus', 'success')
        this.fetchCategories()
      } catch {
        this.showToast('Gagal menghapus kategori', 'error')
      } finally {
        this.showDeleteModal = false
        this.deleteId = null
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString()
    },
    showToast(message, type = 'success') {
      this.toast.message = message
      this.toast.type = type
      this.toast.show = true
      setTimeout(() => {
        this.toast.show = false
      }, 3000)
    },
  },
}
</script>

<style scoped>
table {
  min-width: 600px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
