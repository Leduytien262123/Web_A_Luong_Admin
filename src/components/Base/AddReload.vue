<script setup>
const props = defineProps({
  titleReload: {
    type: String,
    required: false,
  },
  titleAdd: {
    type: String,
    required: false,
  },
  reset: {
    type: Function,
    required: false,
  },
  handleAdd: {
    type: Function,
    required: false,
  },
});
</script>

<template>
  <div class="flex justìy-end gap-12">
    <NButton type="info" @click="reset">
      <i class="i-material-symbols:refresh mr-4 text-18" />
      Tải lại danh sách
    </NButton>
    <NButton type="primary" @click="handleAdd">
      <i class="i-material-symbols:add mr-4 text-18" />
      {{ titleAdd }}
    </NButton>
  </div>
</template>
