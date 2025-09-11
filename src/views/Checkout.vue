<template>
  <div class="min-h-screen bg-gray-50">
    <NavbarPelanggan :user="user" :categories="categories" :currentCategory="null" @filter-category="goToCategory" />

    <section class="container mx-auto px-4 py-8">
      <h2 class="text-3xl font-bold mb-6">Checkout</h2>

      <!-- Cart Table -->
      <div class="overflow-x-auto shadow rounded-lg bg-white">
        <table class="table w-full">
          <thead class="bg-gray-100">
            <tr>
              <th>Produk</th>
              <th>Harga</th>
              <th>Qty</th>
              <th>Subtotal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart" :key="item.id">
              <td class="font-medium">{{ item.name }}</td>
              <td>Rp {{ Number(item.price).toLocaleString() }}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  v-model.number="item.quantity"
                  @change="updateCart"
                  class="input input-bordered input-sm w-20 text-center"
                />
              </td>
              <td class="font-semibold">Rp {{ (item.price * item.quantity).toLocaleString() }}</td>
              <td>
                <button @click="removeItem(item.id)" class="btn btn-error btn-xs text-white">
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Total -->
      <div class="text-right mt-4 font-bold text-xl">
        Total: Rp {{ totalPrice.toLocaleString() }}
      </div>

      <div class="flex justify-end mt-4">
        <button class="btn btn-primary" @click="checkout">Pesan</button>
      </div>

      <!-- Orders History -->
<h3 class="text-2xl font-bold mt-10 mb-4">Riwayat Pesanan</h3>
<div v-if="orders.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <div
    v-for="order in orders"
    :key="order.id"
    class="card border shadow-lg rounded-xl"
    :class="{
      'bg-green-50': order.status === 'selesai',
      'bg-yellow-50': order.status === 'proses',
      'bg-red-50': order.status === 'batal',
      'bg-white': order.status !== 'selesai' && order.status !== 'proses' && order.status !== 'batal'
    }"
  >
    <!-- Header -->
    <div class="card-body p-5">
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-bold text-lg text-blue-600">#{{ order.invoice_id }}</h4>
        <span
          class="badge px-3 py-2"
          :class="{
            'badge-success': order.status === 'selesai',
            'badge-warning': order.status === 'proses',
            'badge-error': order.status === 'batal'
          }"
        >
          {{ order.status }}
        </span>
      </div>
      <p class="text-sm text-gray-500 mb-2">
        Tanggal: {{ new Date(order.order_date).toLocaleDateString('id-ID') }}
      </p>

      <!-- Items -->
      <ul class="divide-y divide-gray-200 text-sm mb-4">
        <li
          v-for="item in order.items"
          :key="item.id"
          class="py-2 flex justify-between"
        >
          <span>
            {{ item.product.name }} × {{ item.quantity }}
          </span>
          <span class="font-medium">
            Rp {{ (item.price * item.quantity).toLocaleString() }}
          </span>
        </li>
      </ul>

      <!-- Footer -->
      <div class="flex justify-between items-center border-t pt-3">
        <span class="font-semibold">Total</span>
        <span class="font-bold text-lg text-green-600">
          Rp {{ Number(order.total).toLocaleString() }}
        </span>
      </div>
    </div>
  </div>
</div>
<div v-else class="text-gray-500">Belum ada pesanan.</div>

    </section>

    <!-- Toast -->
    <div class="toast toast-start toast-top" v-show="toast.show">
      <div class="alert alert-info">
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarPelanggan from "@/components/NavbarPelanggan.vue";
import api from "@/services/api";

export default {
  components: { NavbarPelanggan },
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || null,
      cart: [],
      orders: [],
      categories: [],
      toast: { show: false, message: "" }
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    }
  },
  methods: {
    showToast(msg) {
      this.toast.message = msg;
      this.toast.show = true;
      setTimeout(() => (this.toast.show = false), 2000);
    },
    goToCategory(id) {
      this.$router.push({ path: "/", query: { category: id } });
    },
    updateCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    removeItem(id) {
      this.cart = this.cart.filter(i => i.id !== id);
      this.updateCart();
      this.showToast("Item dihapus dari keranjang");
    },
    async checkout() {
      if (!this.cart.length) return this.showToast("Keranjang kosong!");
      try {
        await api.post("/order-items", {
          user_id: this.user.id,
          items: this.cart.map(i => ({
            product_id: i.id,
            quantity: i.quantity
          }))
        });
        localStorage.removeItem("cart");
        this.cart = [];
        this.showToast("Pesanan berhasil dibuat!");
        this.fetchOrders();
      } catch (e) {
        console.error(e);
        this.showToast("Gagal membuat pesanan!");
      }
    },
    async fetchOrders() {
      try {
        const res = await api.get("/orders");
        this.orders = res.data.filter(o => o.user.email === this.user.email);
      } catch (e) {
        console.error(e);
      }
    }
  },
  async mounted() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    try {
      const catRes = await api.get("/categories");
      this.categories = catRes.data;
      await this.fetchOrders();
    } catch (e) {
      console.error(e);
    }
  }
};
</script>
