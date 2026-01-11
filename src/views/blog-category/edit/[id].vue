<script setup>
const route = useRoute();
import BlogCategoryAddEdit from "@/components/BlogCategories/BlogCategoryAddEdit.vue";
</script>

<template>
  <BlogCategoryAddEdit :id="route?.params?.id" />
</template>
