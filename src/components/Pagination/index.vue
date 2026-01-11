<script setup>
const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  limit: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: "mục",
  },
  pageCount: {
    type: Number,
    default: undefined,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
  showSizePicker: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:page", "update:page-size", "change"]);

function onUpdatePage(newPage) {
  emit("update:page", newPage);
  emit("change", { page: newPage, pageSize: props.pageSize });
}

function onUpdatePageSize(newSize) {
  emit("update:page-size", newSize);
  emit("change", { page: props.page, pageSize: newSize });
}
</script>

<template>
  <div class="mt-16 flex justify-end gap-6">
    <div class="">Tổng</div>
    <div class="">{{ total }}</div>
    <div class="">{{ name }}</div>
    <n-pagination
      :page="page"
      :page-size="pageSize"
      :page-count="pageCount"
      :page-sizes="pageSizes"
      :show-size-picker="showSizePicker"
      @update:page="onUpdatePage"
      @update:page-size="onUpdatePageSize"
    />
  </div>
</template>
