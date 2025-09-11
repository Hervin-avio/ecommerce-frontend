<template>
    <aside class="w-64 bg-gray-800 text-white flex flex-col h-screen">
        <div class="p-4 text-xl font-bold border-b border-gray-700">
            E-Commerce
        </div>
        <nav class="flex-1 p-4 space-y-2">
            <router-link to="/dashboard"
                class="w-full block px-4 py-2 rounded hover:bg-gray-700">Dashboard</router-link>
            <hr class="border-gray-700" />
            <div class="text-gray-300 uppercase text-xs px-4 mt-2 mb-1">Manajemen Produk</div>
            <router-link to="/categories"
                class="w-full block px-4 py-2 rounded hover:bg-gray-700">Kategori</router-link>
            <router-link to="/products" class="w-full block px-4 py-2 rounded hover:bg-gray-700">Produk</router-link>
            <router-link to="/orders" class="w-full block px-4 py-2 rounded hover:bg-gray-700">Pesanan</router-link>
            <router-link to="/reports" class="w-full block px-4 py-2 rounded hover:bg-gray-700">Laporan</router-link>
           
            <hr class="border-gray-700 mt-2" />
            <!-- Logout Button -->
            <button @click="logout" class="w-full text-left px-4 py-2 rounded hover:bg-gray-700 mt-2 cursor-pointer">
                Logout
            </button>
        </nav>
    </aside>
</template>

<script>
export default {
    name: "Sidebar",
    methods: {
        logout() {
            // hapus token dan user
            localStorage.removeItem('token')
            localStorage.removeItem('user')

            // redirect ke login
            this.$router.push('/login')
        }
    }
}
</script>
