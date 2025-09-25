<template>
  <div class="flex gap-4 items-end">
    <div class="flex flex-col">
      <label class="mb-1 text-sm">Dari Tanggal</label>
      <input type="date" v-model="start" class="input input-bordered" />
    </div>

    <div class="flex flex-col">
      <label class="mb-1 text-sm">Sampai Tanggal</label>
      <input type="date" v-model="end" class="input input-bordered" />
    </div>

    <button class="btn btn-primary" @click="emitFilter">
      Filter
    </button>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Object,
      default: () => ({ start: "", end: "" }),
    },
  },
  data() {
    return {
      start: this.modelValue.start || "",
      end: this.modelValue.end || "",
    };
  },
  watch: {
    modelValue: {
      handler(val) {
        this.start = val.start || "";
        this.end = val.end || "";
      },
      deep: true,
    },
  },
  methods: {
    emitFilter() {
      this.$emit("update:modelValue", { start: this.start, end: this.end });
      this.$emit("apply"); // optional emit untuk trigger di parent
    },
  },
};
</script>
