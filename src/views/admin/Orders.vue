<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Daftar Pesanan</h1>

    <!-- 📅 Komponen Filter Tanggal -->
    <DateRangeFilter
      v-model="filter"
      @apply="applyFilter"
      class="mb-4"
    />

    <!-- 🔍 Search -->
    <div class="mb-4">
      <input
        type="text"
        v-model="search"
        placeholder="Cari invoice / pelanggan..."
        class="input input-bordered w-full"
        @input="resetPage"
      />
    </div>

    <!-- 📋 Tabel Pesanan -->
    <table class="table w-full">
      <thead>
        <tr>
          <th>Invoice ID</th>
          <th>Pelanggan</th>
          <th>Total</th>
          <th>Status</th>
          <th>Tanggal</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in paginatedOrders" :key="order.id">
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
        <tr v-if="paginatedOrders.length === 0">
          <td colspan="6" class="text-center py-4">Tidak ada data</td>
        </tr>
      </tbody>
    </table>

    <!-- 📄 Pagination -->
    <Pagination
      v-model:currentPage="currentPage"
      :totalPages="totalPages"
      class="mt-6"
    />
  </div>
</template>

<script>
import api from "../../services/api";
import Pagination from "@/components/Pagination.vue";
import DateRangeFilter from "@/components/DateRangeFilter.vue";

export default {
  components: {
    Pagination,
    DateRangeFilter,
  },
  data() {
    return {
      orders: [],
      search: "",
      filter: {
        start: "",
        end: "",
      },
      currentPage: 1,
      perPage: 10,
    };
  },
  computed: {
    filteredOrders() {
      let temp = this.orders;

      // 🔍 Filter search
      if (this.search) {
        const s = this.search.toLowerCase();
        temp = temp.filter(
          (o) =>
            o.invoice_id.toLowerCase().includes(s) ||
            (o.user?.name && o.user.name.toLowerCase().includes(s))
        );
      }

      // 🧠 Fungsi bantu untuk ambil tanggal murni (tanpa jam)
      const toDateOnly = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      };

      // 📅 Filter tanggal mulai
      if (this.filter.start) {
        const start = toDateOnly(this.filter.start);
        temp = temp.filter((o) => toDateOnly(o.order_date) >= start);
      }

      // 📅 Filter tanggal akhir
      if (this.filter.end) {
        const end = toDateOnly(this.filter.end);
        temp = temp.filter((o) => toDateOnly(o.order_date) <= end);
      }

      return temp;
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.filteredOrders.length / this.perPage));
    },

    paginatedOrders() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredOrders.slice(start, start + this.perPage);
    },
  },
  watch: {
    filteredOrders() {
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    },
  },
  async mounted() {
    await this.fetchOrders();
  },
  methods: {
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
        await this.fetchOrders();
      } catch (err) {
        console.error("Gagal hapus order:", err);
        alert("Gagal menghapus order");
      }
    },
    applyFilter() {
      this.currentPage = 1;
    },
    resetPage() {
      this.currentPage = 1;
    },
  },
};
</script>
