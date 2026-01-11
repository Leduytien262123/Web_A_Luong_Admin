<script setup>
const props = defineProps({
  searchData: {
    type: Function,
    required: false,
  },
});

const isWaiting = ref(false);

function handleClick() {
  if (isWaiting.value) return;
  props.searchData && props.searchData();
  isWaiting.value = true;
  setTimeout(() => {
    isWaiting.value = false;
  }, 1000);
}

defineExpose({ search: handleClick });
</script>

<template>
  <n-button type="primary" :disabled="isWaiting" @click="handleClick"
    >Tìm kiếm</n-button
  >
</template>
