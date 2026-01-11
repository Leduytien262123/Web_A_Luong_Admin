<script setup>
const route = useRoute()
import CategoryAddEdit from '@/components/Categories/CategoryAddEdit.vue'
</script>

<template>
  <CategoryAddEdit :id="route?.params?.id" />
</template>