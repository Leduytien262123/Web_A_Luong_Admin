<script setup>
const route = useRoute();
import BlogAddEdit from "@/components/Blogs/BlogAddEdit.vue";
</script>

<template>
  <BlogAddEdit :id="route?.params?.id" />
</template>
