<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Edit User</h1>

    <div v-if="loading" class="text-center">
      <span>Loading...</span>
    </div>

    <div v-else>
      <form @submit.prevent="updateUser">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Nama</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            class="input input-bordered w-full"
            required
            placeholder="Nama Pengguna" />
        </div>

        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            class="input input-bordered w-full"
            required
            placeholder="Email Pengguna" />
        </div>

        <div class="mb-4">
          <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
          <select
            v-model="form.role"
            id="role"
            class="select select-bordered w-full"
            required>
            <option disabled value="">-- Pilih Role --</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password (Kosongkan jika tidak ingin mengubah)</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            class="input input-bordered w-full"
            placeholder="Password baru" />
        </div>

        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";  // pastikan ini sudah ada path API-nya

export default {
  name: "EditUser",
  data() {
    return {
      form: {
        name: "",
        email: "",
        role: "",
        password: ""  // password hanya diubah jika diisi
      },
      loading: false
    };
  },

  methods: {
    async getUser() {
      const userId = this.$route.params.id;

      try {
        const res = await api.get(`/users/${userId}`);
        const { name, email, role } = res.data;
        this.form.name = name;
        this.form.email = email;
        this.form.role = role; // pastikan ini adalah 'admin' atau 'user'
      } catch (error) {
        console.error("Gagal mendapatkan data user:", error);
        alert("Gagal mendapatkan data user.");
      }
    },

    async updateUser() {
      const userId = this.$route.params.id;
      const payload = {
        name: this.form.name,
        email: this.form.email,
        role: this.form.role,
        // hanya kirim password jika diisi
        ...(this.form.password && { password: this.form.password })
      };

      this.loading = true;
      try {
        // Lakukan request PUT untuk update data user
        const res = await api.put(`/users/${userId}`, payload);

        // Log response untuk memastikan perubahan
        console.log("User updated successfully:", res.data);

        // Perbarui form dengan data terbaru dari server
        this.form = res.data;  // Menyesuaikan form dengan data terbaru dari server

        // Arahkan kembali ke daftar user
        this.$router.push("/users");
        alert("User berhasil diperbarui!");
      } catch (error) {
        console.error("Error update user:", error);
        alert("Gagal memperbarui data user.");
      } finally {
        this.loading = false;
      }
    }
  },

  mounted() {
    this.getUser();  // Ambil data user saat halaman dimuat
  }
};
</script>

<style scoped>
/* Styling untuk form */
input, select {
  padding: 8px;
  border-radius: 8px;
}

.btn {
  background-color: #4CAF50;
  color: white;
}

.btn:hover {
  background-color: #45a049;
}
</style>
