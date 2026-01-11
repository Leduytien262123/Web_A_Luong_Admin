<script setup>
const props = defineProps({
  value: {
    type: [String, Number, null],
    required: false,
  },
});

const emit = defineEmits(["update:value"]);

function onUpdateValue(val) {
  emit("update:value", val);
}
</script>

<template>
  <n-date-picker :value="value" @update:value="onUpdateValue" />
</template>
