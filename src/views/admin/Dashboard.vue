<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

    <!-- Grid Statistik -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card bg-blue-500 text-white shadow-lg rounded-xl p-4">
        <div class="text-xl font-bold">Rp {{ totalOmset.toLocaleString() }}</div>
        <div class="text-sm">Keseluruhan Omset</div>
      </div>
      <div class="card bg-green-500 text-white shadow-lg rounded-xl p-4">
        <div class="text-xl font-bold">{{ totalCustomer }}</div>
        <div class="text-sm">Customer</div>
      </div>
      <div class="card bg-yellow-400 text-white shadow-lg rounded-xl p-4">
        <div class="text-xl font-bold">{{ totalKategori }}</div>
        <div class="text-sm">Kategori Produk</div>
      </div>
      <div class="card bg-red-500 text-white shadow-lg rounded-xl p-4">
        <div class="text-xl font-bold">{{ totalProduk }}</div>
        <div class="text-sm">Produk</div>
      </div>

      <div class="card bg-blue-400 text-white shadow-lg rounded-xl p-4">
        <div class="text-xl font-bold">{{ statusBaru }}</div>
        <div class="text-sm">Orderan Baru</div>
      </div>
      <div class="card bg-green-400 text-white shadow-lg rounded-xl p-4">
        <div class="text-xl font-bold">{{ statusDiproses }}</div>
        <div class="text-sm">Order Sedang Diproses</div>
      </div>
      <div class="card bg-yellow-300 text-white shadow-lg rounded-xl p-4">
        <div class="text-xl font-bold">{{ statusDikirim }}</div>
        <div class="text-sm">Orderan Dikirim</div>
      </div>
      <div class="card bg-red-400 text-white shadow-lg rounded-xl p-4">
        <div class="text-xl font-bold">{{ statusSelesai }}</div>
        <div class="text-sm">Orderan Selesai</div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../services/api";

export default {
  name: "Dashboard",
  data() {
    return {
      totalOmset: 0,
      totalCustomer: 0,
      totalKategori: 0,
      totalProduk: 0,
      statusBaru: 0,
      statusDiproses: 0,
      statusDikirim: 0,
      statusSelesai: 0,
    };
  },
  async mounted() {
    try {
      // Hit API orders
      const ordersRes = await api.get("/orders");
      const orders = ordersRes.data;

      this.totalOmset = orders.reduce((acc, o) => acc + Number(o.total), 0);
      this.statusBaru = orders.filter(o => o.status === "baru").length;
      this.statusDiproses = orders.filter(o => o.status === "diproses").length;
      this.statusDikirim = orders.filter(o => o.status === "dikirim").length;
      this.statusSelesai = orders.filter(o => o.status === "selesai").length;

      // Hit API users
      const usersRes = await api.get("/users");
      this.totalCustomer = usersRes.data.length;

      // Hit API categories
      const catRes = await api.get("/categories");
      this.totalKategori = catRes.data.length;

      // Hit API products
      const prodRes = await api.get("/products");
      this.totalProduk = prodRes.data.length;

    } catch (err) {
      console.error("Gagal load dashboard:", err);
    }
  },
};
</script>

<style>
main::-webkit-scrollbar {
  width: 8px;
}
main::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.2);
  border-radius: 4px;
}
</style>
