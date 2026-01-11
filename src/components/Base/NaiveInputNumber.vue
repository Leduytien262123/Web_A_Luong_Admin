<script setup>
const props = defineProps({
  value: {
    type: Number,
    required: false,
  },
  money: {
    type: Boolean,
    required: false,
  },
  percent: {
    type: Boolean,
    required: false,
  },
});

const emit = defineEmits(["update:value"]);

const parse = (input) => {
  const nums = input.replace(/[^\d]/g, "");
  if (nums === "") return null;
  return Number(nums);
};

const format = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "";
  return Number(value).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
};
</script>

<template>
  <n-input-number
    :value="value"
    :parse="money ? parse : undefined"
    :format="money ? format : undefined"
    @update:value="emit('update:value', $event)"
    class="w-full"
  >
    <template v-if="percent" #suffix> % </template>
  </n-input-number>
</template>
