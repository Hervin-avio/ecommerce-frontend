<template>
    <aside class="w-64 bg-[#4e73df] text-white flex flex-col h-screen">
        <div class="p-4 text-xl font-bold border-b border-[#3c60b5]">
            <router-link to="/dashboard" class="hover:text-blue-300 cursor-pointer">
                Admin
            </router-link>
        </div>

        <!-- Display User Name Here -->
        <div class="p-4 text-sm text-gray-300 border-b border-[#3c60b5]">
            <p v-if="user">Hello, {{ user.name }}</p>
            <p v-else>Welcome, Guest</p>
        </div>

        <nav class="flex-1 p-4 space-y-2">
            <!-- Dashboard -->
            <router-link to="/dashboard"
                class="w-full block px-4 py-2 rounded hover:bg-[#3c60b5] hover:text-white transition-colors duration-300"
                :class="{ 'bg-[#3c60b5]': $route.path === '/dashboard' }">
                Dashboard
            </router-link>

            <hr class="border-[#3c60b5]" />

            <div class="text-gray-300 uppercase text-xs px-4 mt-2 mb-1">Manajemen Produk</div>

            <!-- Kategori -->
            <router-link to="/categories"
                class="w-full block px-4 py-2 rounded hover:bg-[#3c60b5] hover:text-white transition-colors duration-300"
                :class="{ 'bg-[#3c60b5]': $route.path === '/categories' }">
                Kategori
            </router-link>

            <!-- Produk (Aktif) -->
            <router-link to="/products"
                class="w-full block px-4 py-2 rounded hover:bg-[#3c60b5] hover:text-white transition-colors duration-300"
                :class="{ 'bg-[#3c60b5] text-white': $route.path === '/products' }">
                Produk
            </router-link>

            <!-- Pesanan -->
            <router-link to="/orders"
                class="w-full block px-4 py-2 rounded hover:bg-[#3c60b5] hover:text-white transition-colors duration-300"
                :class="{ 'bg-[#3c60b5]': $route.path === '/orders' }">
                Pesanan
            </router-link>

            <router-link to="/reports"
                class="w-full block px-4 py-2 rounded hover:bg-[#3c60b5] hover:text-white transition-colors duration-300"
                :class="{ 'bg-[#3c60b5]': $route.path === '/reports' }">
                Laporan
            </router-link>

            <hr class="border-[#3c60b5] mt-2" />

            <div class="text-gray-300 uppercase text-xs px-4 mt-2 mb-1">Manajemen User</div>

            <router-link to="/users"
                class="w-full block px-4 py-2 rounded hover:bg-[#3c60b5] hover:text-white transition-colors duration-300"
                :class="{ 'bg-[#3c60b5]': $route.path === '/users' }">
                Data User
            </router-link>

            <hr class="border-[#3c60b5] mt-2" />

            <!-- Logout Button -->
            <button @click="logout"
                class="w-full text-left px-4 py-2 rounded hover:bg-[#3c60b5] hover:text-white mt-2 cursor-pointer transition-colors duration-300">
                Logout
            </button>
        </nav>
    </aside>




</template>

<script>
export default {
    name: "Sidebar",
    data() {
        return {
            user: JSON.parse(localStorage.getItem('user')) || null // Ambil data user dari localStorage
        };
    },
    methods: {
        logout() {
            // hapus token dan user
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // redirect ke login
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
/* Styling untuk Sidebar */
</style>
