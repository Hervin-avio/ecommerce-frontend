<template>
  <div class="min-h-screen bg-gray-50">
    <NavbarHome />

    <section class="container mx-auto px-4 py-8">
      <h2 class="text-3xl font-bold mb-6">Checkout</h2>

      <table class="table w-full border">
        <thead>
          <tr>
            <th>Produk</th>
            <th>Harga</th>
            <th>Qty</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item.id">
            <td>{{ item.name }}</td>
            <td>Rp {{ Number(item.price).toLocaleString() }}</td>
            <td>{{ item.quantity }}</td>
            <td>Rp {{ (item.price * item.quantity).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>

      <div class="text-right mt-4 font-bold text-lg">
        Total: Rp {{ totalPrice.toLocaleString() }}
      </div>

      <button class="btn btn-primary mt-4" @click="checkout">Checkout</button>
    </section>
  </div>
</template>

<script>
import NavbarHome from "@/components/NavbarHome.vue";

export default {
  components: { NavbarHome },
  data() {
    return {
      cart: [],
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      this.$router.push("/login");
      return;
    }
    let cartData = JSON.parse(localStorage.getItem("cart")) || [];
    this.cart = cartData.map(item => ({ ...item, quantity: item.quantity || 1 }));
  },
  methods: {
    checkout() {
      alert("Implement checkout API call di sini");
    },
  },
};
</script>
