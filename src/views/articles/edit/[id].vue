<script setup>
const route = useRoute();
import ArticleAddEdit from "@/components/Articles/ArticleAddEdit.vue";
</script>

<template>
  <ArticleAddEdit :id="route?.params?.id" />
</template>
