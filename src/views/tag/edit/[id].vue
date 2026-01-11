<script setup>
const route = useRoute();
import TagAddEdit from "@/components/Tags/TagAddEdit.vue";
</script>

<template>
  <TagAddEdit :id="route?.params?.id" />
</template>
