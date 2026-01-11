<script setup>
const route = useRoute()
import ProductAddEdit from '@/components/Products/ProductAddEdit.vue'
</script>

<template>
  <ProductAddEdit :id="route?.params?.id" />
</template>