<script setup>
const props = defineProps({
  value: {
    type: [String, Number, Array, Object, Boolean, null],
    required: false,
    default: null,
  },
  options: {
    type: Array,
    required: false,
  },
});

const emit = defineEmits(["update:value"]);
</script>

<template>
  <n-select
    :value="value"
    @update:value="emit('update:value', $event)"
    :options="options"
  />
</template>
