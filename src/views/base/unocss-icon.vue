<template>
  <CommonPage show-footer>
    <div class="w-350 f-c-c">
      <div class="mb-20 flex items-center">
        <span class="text-18 font-600">
          <i class="i-fe:zap mr-4 text-primary" />
          <span class="ml-4">Unocss Icon</span>
        </span>
        <a
          class="ml-12 text-primary cursor-pointer underline"
          href="https://icones.js.org/collection/all"
          target="_blank"
        >
          Nhấp để xem cách sử dụng Unocss Icon
        </a>
      </div>

      <div
        flex
        flex-wrap
        justify-around
        card-border
        rounded-10
        p-10
        style="grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); gap: 16px; max-width: 500px"
      >
        <div
          v-for="(icon, index) in icons"
          :key="index"
          p-8
          cursor-pointer
          rounded-4
          hover-bg-gray-100
          @click="handleCopy(icon)"
        >
          <i :class="icon" text-24 />
        </div>
      </div>
    </div>
  </CommonPage>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
import icons from 'isme:icons'

const { copy } = useClipboard()

function handleCopy(icon) {
  copy(icon)
  $message.success('Đã sao chép vào clipboard')
}
</script>
