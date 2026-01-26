<script setup>
const route = useRoute();
import ArticleCategoryAddEdit from "@/components/ArticleCategories/ArticleCategoryAddEdit.vue";
</script>

<template>
  <ArticleCategoryAddEdit :id="route?.params?.id" />
</template>
