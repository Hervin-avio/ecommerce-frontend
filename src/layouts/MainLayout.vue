<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Konten Utama -->
    <main class="flex-1 p-6 overflow-auto">
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

<style scoped>
/* Styling untuk MainLayout */
html, body, #app {
  height: 100%;  /* Menjamin bahwa body dan container utama mengisi layar */
}

.flex {
  display: flex;
}

.h-screen {
  height: 100vh;
}

.flex-1 {
  flex: 1; /* Flex grow agar konten utama bisa mengisi ruang yang tersisa */
}

.overflow-auto {
  overflow: auto; /* Agar konten tidak terpotong dan scrollable jika dibutuhkan */
}


</style>
