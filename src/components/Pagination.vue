<template>
  <div class="flex justify-center items-center mt-6 gap-2 flex-wrap select-none">
    <button
      class="btn btn-sm"
      :disabled="currentPage === 1"
      @click="$emit('update:currentPage', currentPage - 1)"
    >
      ←
    </button>

    <button
      v-for="page in pageNumbers"
      :key="page.key"
      class="btn btn-sm"
      :class="{
        'btn-primary': page.number === currentPage,
        'btn-ghost': page.number !== currentPage,
        'cursor-default': page.isEllipsis
      }"
      @click="handlePageClick(page)"
      :disabled="page.isEllipsis"
    >
      {{ page.display }}
    </button>

    <button
      class="btn btn-sm"
      :disabled="currentPage === totalPages"
      @click="$emit('update:currentPage', currentPage + 1)"
    >
      →
    </button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
  },
  computed: {
    pageNumbers() {
      const total = this.totalPages;
      const current = this.currentPage;
      const delta = 2;
      const pages = [];

      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push({ number: i, display: i, key: i, isEllipsis: false });
        }
      } else {
        pages.push({ number: 1, display: 1, key: 1, isEllipsis: false });

        let left = current - delta;
        let right = current + delta;

        if (left <= 2) {
          left = 2;
          right = 5;
        }
        if (right >= total - 1) {
          right = total - 1;
          left = total - 4;
        }

        if (left > 2) {
          pages.push({ number: -1, display: '...', key: 'left-ellipsis', isEllipsis: true });
        }

        for (let i = left; i <= right; i++) {
          pages.push({ number: i, display: i, key: i, isEllipsis: false });
        }

        if (right < total - 1) {
          pages.push({ number: -2, display: '...', key: 'right-ellipsis', isEllipsis: true });
        }

        pages.push({ number: total, display: total, key: total, isEllipsis: false });
      }

      return pages;
    },
  },
  methods: {
    handlePageClick(page) {
      if (!page.isEllipsis) {
        // Debug log klik halaman
        console.log("Klik halaman:", page.number);
        this.$emit("update:currentPage", page.number);
      }
    },
  },
};
</script>
