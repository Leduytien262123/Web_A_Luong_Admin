<script setup>
const route = useRoute();
import DiscountAddEdit from "@/components/Discounts/DiscountAddEdit.vue";
</script>

<template>
  <DiscountAddEdit :id="route?.params?.id" />
</template>
