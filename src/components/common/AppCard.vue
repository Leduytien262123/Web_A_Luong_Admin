<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/04 22:51:04
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang | https://isme.top
 --------------------------------->

<template>
  <div class="auto-bg" :class="{ 'card-border': bordered }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  bordered: Boolean,
})
</script>
