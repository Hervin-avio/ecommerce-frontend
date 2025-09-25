<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Manajemen User</h1>
    <table class="table w-full border">
      <thead>
        <tr class="bg-gray-200">
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Nama</th>
          <th class="px-4 py-2 text-left">Email</th>
          <th class="px-4 py-2 text-left">Role</th>
          <th class="px-4 py-2 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="px-4 py-2">{{ user.id }}</td>
          <td class="px-4 py-2">{{ user.name }}</td>
          <td class="px-4 py-2">{{ user.email }}</td>
          <td class="px-4 py-2">{{ user.role }}</td>
          <td class="px-4 py-2 text-center">
            <button
              class="btn btn-warning btn-sm mr-2"
              @click="editUser(user.id)"
            >
              Edit
            </button>
            <button
              class="btn btn-error btn-sm"
              @click="deleteUser(user.id)"
            >
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'Users',
  data() {
    return {
      users: []
    }
  },
  methods: {
    async getUsers() {
      try {
        const res = await api.get('/users')
        this.users = res.data
      } catch (err) {
        console.error('Error load users:', err)
      }
    },
    editUser(id) {
      // navigasi ke halaman edit user
      this.$router.push({ name: 'EditUser', params: { id } })
    },
    async deleteUser(id) {
      if (!confirm('Yakin hapus user ini?')) return
      try {
        await api.delete(`/users/${id}`)
        await this.getUsers()
      } catch(err) {
        console.error('Error delete user:', err)
      }
    }
  },
  mounted() {
    this.getUsers()
  }
}
</script>
