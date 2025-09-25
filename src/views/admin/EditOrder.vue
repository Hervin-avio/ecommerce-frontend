<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Edit Order</h1>
    <form @submit.prevent="updateOrder" class="space-y-4">
      <!-- Nama Pelanggan (readonly) -->
      <div>
        <label class="label">Customer</label>
        <input
          v-model="form.user_name"
          type="text"
          class="input input-bordered w-full"
          disabled
        />
      </div>

      <!-- Status -->
      <div>
        <label class="label">Status</label>
        <select v-model="form.status" class="select select-bordered w-full">
          <option value="baru">Baru</option>
          <option value="diproses">Diproses</option>
          <option value="dikirim">Dikirim</option>
          <option value="selesai">Selesai</option>
        </select>
      </div>

      <!-- Tanggal Order -->
      <div>
        <label class="label">Tanggal Order</label>
        <input
          v-model="form.order_date"
          type="date"
          class="input input-bordered w-full"
        />
      </div>

      <button class="btn btn-primary w-full" type="submit">
        Update Order
      </button>
    </form>
  </div>
</template>

<script>
import api from "../../services/api";

export default {
  data() {
    return {
      form: {
        user_name: "",
        status: "",
        order_date: "",
      },
      orderId: null,
    };
  },
  methods: {
    async fetchOrder() {
      try {
        const res = await api.get(`/orders/${this.orderId}`);
        this.form.user_name = res.data.user?.name || "-";
        this.form.status = res.data.status;
        this.form.order_date = res.data.order_date.split(" ")[0]; // ambil tanggal saja
      } catch (err) {
        console.error("Gagal load order:", err);
        alert("Gagal memuat data order.");
      }
    },
    async updateOrder() {
      try {
        await api.put(`/orders/${this.orderId}`, {
          status: this.form.status,
          order_date: this.form.order_date,
        });
        alert("Order berhasil diupdate");
        this.$router.push("/orders");
      } catch (err) {
        console.error("Gagal update order:", err);
        alert("Gagal update order.");
      }
    },
  },
  mounted() {
    this.orderId = this.$route.params.id;
    this.fetchOrder();
  },
};
</script>
