<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Daftar Pesanan</h1>

    <!-- Filter Tanggal -->
    <div class="flex gap-4 mb-4">
      <input type="date" v-model="filter.start" class="input input-bordered" />
      <input type="date" v-model="filter.end" class="input input-bordered" />
      <button @click="filterOrders" class="btn btn-primary">Filter</button>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <input
        type="text"
        v-model="search"
        placeholder="Cari invoice / pelanggan..."
        class="input input-bordered w-full"
      />
    </div>

    <table class="table w-full">
      <thead>
        <tr>
          <th>Invoice ID</th>
          <th>Pelanggan</th>
          <th>Total</th>
          <th>Status</th>
          <th>Tanggal</th>
          <th>Aksi</th> <!-- Tambah kolom aksi -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in filteredOrders" :key="order.id">
          <td>{{ order.invoice_id }}</td>
          <td>{{ order.user?.name || '-' }}</td>
          <td>Rp {{ Number(order.total).toLocaleString() }}</td>
          <td>{{ order.status }}</td>
          <td>{{ new Date(order.order_date).toLocaleDateString() }}</td>
          <td class="flex gap-2">
            <router-link
              :to="`/orders/edit/${order.id}`"
              class="btn btn-sm btn-primary"
            >
              Edit
            </router-link>
            <button @click="deleteOrder(order.id)" class="btn btn-sm btn-error">
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      orders: [],
      search: "",
      filter: { start: "", end: "" },
    };
  },
  computed: {
    filteredOrders() {
      let temp = this.orders;

      // Filter berdasarkan search
      if (this.search) {
        const s = this.search.toLowerCase();
        temp = temp.filter(
          (o) =>
            o.invoice_id.toLowerCase().includes(s) ||
            o.user?.name.toLowerCase().includes(s)
        );
      }

      // Filter berdasarkan tanggal
      if (this.filter.start) {
        temp = temp.filter(
          (o) => new Date(o.order_date) >= new Date(this.filter.start)
        );
      }
      if (this.filter.end) {
        temp = temp.filter(
          (o) => new Date(o.order_date) <= new Date(this.filter.end)
        );
      }

      return temp;
    },
  },
  async mounted() {
    this.fetchOrders();
  },
  methods: {
    filterOrders() {
      // Trigger computed otomatis
    },
    async fetchOrders() {
      try {
        const res = await api.get("/orders");
        this.orders = res.data;
      } catch (err) {
        console.error("Gagal load orders:", err);
      }
    },
    async deleteOrder(id) {
      if (!confirm("Yakin ingin menghapus order ini?")) return;
      try {
        await api.delete(`/orders/${id}`);
        alert("Order berhasil dihapus");
        this.fetchOrders();
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus order");
      }
    },
  },
};
</script>
