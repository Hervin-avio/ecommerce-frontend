<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <main class="flex-1 p-6 overflow-auto">
      <!-- konten halaman akan dimasukkan di sini -->
      <router-view />
    </main>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";

export default {
  name: "MainLayout",
  components: { Sidebar },
};
</script>
