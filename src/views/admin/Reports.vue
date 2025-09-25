<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-4xl font-bold mb-6 text-center border-b pb-4">Laporan Penjualan</h1>

    <!-- Filter -->
    <div class="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 gap-4">
      <DateRangeFilter v-model="dateRange" @apply="onFilterApply" />

      <div>
        <label class="block mb-1 text-sm">Filter Status Order</label>
        <select v-model="selectedStatus" class="select select-bordered w-full md:w-52">
          <option value="">Semua</option>
          <option value="baru">Baru</option>
          <option value="diproses">Diproses</option>
          <option value="dikirim">Dikirim</option>
          <option value="selesai">Selesai</option>
        </select>
      </div>

      <div>
        <label class="block mb-1 text-sm">Filter Kategori Produk</label>
        <select v-model="selectedCategory" class="select select-bordered w-full md:w-52">
          <option value="">Semua</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
        </select>
      </div>
    </div>

    <!-- Total Omzet -->
    <div class="mb-6 text-right text-xl font-semibold text-primary">
      Total Omzet: Rp {{ formattedTotalOmset }}
    </div>

    <!-- Grafik -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card bg-base-200 shadow p-6">
        <h2 class="text-2xl font-bold mb-4">Omset Berdasarkan Status</h2>
        <canvas ref="omsetChart" />
      </div>
      <div class="card bg-base-200 shadow p-6">
        <h2 class="text-2xl font-bold mb-4">Distribusi Data</h2>
        <canvas ref="summaryChart" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, watch, computed } from "vue";
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../../services/api";
import DateRangeFilter from "@/components/DateRangeFilter.vue";

Chart.register(BarElement, BarController, CategoryScale, LinearScale, DoughnutController, ArcElement, Tooltip, Legend);

export default {
  name: "Reports",
  components: { DateRangeFilter },
  setup() {
    const omsetChart = ref(null);
    const summaryChart = ref(null);
    let omsetChartInstance = null;
    let summaryChartInstance = null;

    const orders = ref([]);
    const users = ref([]);
    const products = ref([]);
    const categories = ref([]);

    const dateRange = ref({ start: "", end: "" });
    const selectedStatus = ref("");
    const selectedCategory = ref("");

    const chartsReady = ref(false);

    function parseDate(str) {
      if (!str) return null;
      const d = new Date(str);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    const filteredOrders = computed(() => {
      return orders.value.filter((o) => {
        const orderDateStr = o.order_date || o.created_at || o.createdAt;
        if (!orderDateStr) return false;
        const od = new Date(orderDateStr);
        od.setHours(0, 0, 0, 0);

        const start = parseDate(dateRange.value.start);
        const end = parseDate(dateRange.value.end);

        let matchDate = true;
        if (start && od < start) matchDate = false;
        if (end && od > end) matchDate = false;

        let matchStatus = true;
        if (selectedStatus.value && o.status !== selectedStatus.value) matchStatus = false;

        let matchCategory = true;
        if (selectedCategory.value) {
          // cek apakah ada item dalam order yang produknya masuk kategori yang dipilih
          const adaItemKategori = o.items.some(item => {
            const prod = products.value.find(p => p.id === Number(item.product_id));
            if (!prod || prod.category_id == null) return false;
            const cat = categories.value.find(c => c.id === Number(prod.category_id));
            return cat && cat.name === selectedCategory.value;
          });
          if (!adaItemKategori) matchCategory = false;
        }

        return matchDate && matchStatus && matchCategory;
      });
    });

    // Hitung total omzet berdasarkan item produk yang masuk kategori filter
    const totalOmset = computed(() => {
      let total = 0;

      filteredOrders.value.forEach(order => {
        if (selectedCategory.value) {
          // Jika filter kategori aktif, jumlahkan subtotal item yang sesuai kategori
          order.items.forEach(item => {
            const prod = products.value.find(p => p.id === Number(item.product_id));
            if (!prod || prod.category_id == null) return;
            const cat = categories.value.find(c => c.id === Number(prod.category_id));
            if (cat && cat.name === selectedCategory.value) {
              total += Number(item.subtotal);
            }
          });
        } else {
          // Jika tidak pakai filter kategori, jumlahkan total order biasa
          total += Number(order.total);
        }
      });

      return total;
    });

    const formattedTotalOmset = computed(() =>
      totalOmset.value.toLocaleString("id-ID")
    );

    const renderCharts = () => {
      if (!omsetChart.value || !summaryChart.value) return;

      if (omsetChartInstance) omsetChartInstance.destroy();
      if (summaryChartInstance) summaryChartInstance.destroy();

      const statusLabels = ["baru", "diproses", "dikirim", "selesai"];
      const statusOmset = statusLabels.map((status) =>
        filteredOrders.value
          .filter((o) => o.status === status)
          .reduce((sum, o) => {
            if (selectedCategory.value) {
              // hitung subtotal item sesuai kategori di order dengan status ini
              const subtotal = o.items.reduce((acc, item) => {
                const prod = products.value.find(p => p.id === Number(item.product_id));
                if (!prod || prod.category_id == null) return acc;
                const cat = categories.value.find(c => c.id === Number(prod.category_id));
                if (cat && cat.name === selectedCategory.value) {
                  return acc + Number(item.subtotal);
                }
                return acc;
              }, 0);
              return sum + subtotal;
            } else {
              return sum + Number(o.total);
            }
          }, 0)
      );

      // Bar Chart
      omsetChartInstance = new Chart(omsetChart.value.getContext("2d"), {
        type: "bar",
        data: {
          labels: statusLabels.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
          datasets: [
            {
              label: "Omset (Rp)",
              data: statusOmset,
              backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
              borderRadius: 6,
              borderSkipped: false
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: ctx => `Rp ${ctx.parsed.y.toLocaleString("id-ID")}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: v => `Rp ${v.toLocaleString("id-ID")}`
              }
            }
          }
        }
      });

      // Doughnut
      summaryChartInstance = new Chart(summaryChart.value.getContext("2d"), {
        type: "doughnut",
        data: {
          labels: ["Customer", "Kategori", "Produk"],
          datasets: [
            {
              data: [users.value.length, categories.value.length, products.value.length],
              backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom"
            }
          }
        }
      });
    };

    const fetchData = async () => {
      try {
        const [ordersRes, usersRes, categoriesRes, productsRes] = await Promise.all([
          api.get("/orders"),
          api.get("/users"),
          api.get("/categories"),
          api.get("/products"),
        ]);

        orders.value = ordersRes.data;
        users.value = usersRes.data;
        categories.value = categoriesRes.data;
        products.value = productsRes.data;

        chartsReady.value = true;
        await nextTick();
        renderCharts();
      } catch (err) {
        console.error("Gagal load data laporan:", err);
      }
    };

    const onFilterApply = () => {
      renderCharts();
    };

    watch([selectedStatus, selectedCategory], () => {
      if (chartsReady.value) {
        renderCharts();
      }
    });

    watch(dateRange, () => {
      if (chartsReady.value) {
        renderCharts();
      }
    });

    onMounted(() => {
      fetchData();
    });

    return {
      dateRange,
      selectedStatus,
      selectedCategory,
      filteredOrders,
      totalOmset,
      formattedTotalOmset,
      omsetChart,
      summaryChart,
      categories,
      chartsReady,
      onFilterApply
    };
  }
};
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: 320px !important;
}
</style>
