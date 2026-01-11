<script setup>
const route = useRoute()
import OrderAddEdit from '@/components/Orders/OrderAddEdit.vue'
</script>

<template>
  <OrderAddEdit :id="route?.params?.id" />
</template>