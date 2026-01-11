<script setup>
const props = defineProps({
  isEdit: {
    type: Boolean,
    required: true,
  },
  handleBack: {
    type: Function,
    required: false,
  },
  handleSave: {
    type: Function,
    required: false,
  },
  loading: {
    type: Boolean,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
});
</script>

<template>
  <div class="flex items-center justify-center">
    <NSpace>
      <NButton @click="handleBack">Hủy</NButton>
      <NButton
        type="primary"
        :loading="loading"
        :disabled="disabled"
        @click="handleSave"
        >{{ isEdit ? "Cập nhật" : "Thêm mới" }}</NButton
      >
    </NSpace>
  </div>
</template>
