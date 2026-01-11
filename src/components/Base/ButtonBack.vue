<script setup>
const props = defineProps({
  handleBack: {
    type: Function,
    required: false,
  },
});
</script>

<template>
  <NButton @click="handleBack">
    <i class="i-material-symbols:arrow-back mr-4 text-18" />
    Quay lại
  </NButton>
</template>
