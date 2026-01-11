<script setup>
const route = useRoute();
import UserAddEdit from "@/components/Users/UserAddEdit.vue";
</script>

<template>
  <UserAddEdit :id="route?.params?.id" />
</template>
