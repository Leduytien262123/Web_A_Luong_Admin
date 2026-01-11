<template>
  <CommonPage show-footer>
    <div w-350>
      <n-input v-model:value="inputVal" />
      <n-input-number v-model:value="number" mt-30 />
      <p mt-20 text-center text-14 color-gray>
        Lưu ý: Nhấp chuột phải vào tab và tải lại để reset keep-alive
      </p>
    </div>
  </CommonPage>
</template>

<script setup>
defineOptions({ name: 'KeepAlive' })

const inputVal = ref('')
const number = ref(0)
</script>
