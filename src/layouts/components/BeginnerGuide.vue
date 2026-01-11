<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <i
        class="i-fe:beginner mr-16 cursor-pointer text-20"
        @click="show = true"
      />
    </template>
    Hướng dẫn sử dụng
  </n-tooltip>

  <Vue3IntroStep
    ref="myIntroStep"
    v-model:show="show"
    :config="config"
  >
    <template #prev="{ tipItem, index }">
      <NButton class="mr-12" type="primary" color="#fff" text-color="#fff" ghost round size="small" @click="prev(tipItem, index)">
        Bước trước
      </NButton>
    </template>
    <template #next="{ tipItem }">
      <NButton class="mr-12" type="primary" color="#fff" text-color="#fff" ghost round size="small" @click="next(tipItem)">
        Bước tiếp theo
      </NButton>
    </template>

    <template #skip>
      <NButton type="primary" color="#fff" text-color="#fff" ghost round size="small" @click="skip">
        Bỏ qua
      </NButton>
    </template>

    <template #done>
      <NButton type="primary" color="#fff" text-color="#fff" ghost round size="small" @click="done">
        Hoàn thành
      </NButton>
    </template>
  </Vue3IntroStep>
</template>

<script setup>
import Vue3IntroStep from 'vue3-intro-step'

const myIntroStep = shallowRef(null)
const show = shallowRef(false)
const config = {
  backgroundOpacity: 0.8,
  titleStyle: {
    textAlign: 'left',
    fontSize: '18px',
  },
  contentStyle: {
    textAlign: 'left',
    fontSize: '14px',
  },
  tips: [
    {
      el: '#toggleTheme',
      tipPosition: 'bottom',
      title: 'Chuyển đổi chủ đề hệ thống',
      content: 'Một chạm bật chế độ bảo vệ mắt',
    },
    {
      el: '#fullscreen',
      tipPosition: 'bottom',
      title: 'Toàn màn hình/Thoát toàn màn hình',
      content: 'Một chạm bật toàn màn hình',
    },
    {
      el: '#theme-setting',
      tipPosition: 'bottom',
      title: 'Thiết lập màu chủ đề',
      content: 'Điều chỉnh thành màu chủ đề bạn yêu thích',
    },
    {
      el: '#user-dropdown',
      tipPosition: 'bottom',
      title: 'Trung tâm cá nhân',
      content: 'Xem thông tin cá nhân và thoát hệ thống',
    },
    {
      el: '#menu-collapse',
      tipPosition: 'bottom',
      title: 'Mở rộng/Thu gọn menu',
      content: 'Một chạm mở rộng/thu gọn menu',
    },
    {
      el: '#top-tab',
      tipPosition: 'bottom',
      title: 'Thanh tab',
      content: 'Cuộn chuột để điều chỉnh đến tầm nhìn tốt nhất',
    },
    {
      el: '#layout-setting',
      tipPosition: 'left',
      title: 'Điều chỉnh bố cục hệ thống',
      content: 'Điều chỉnh bố cục hệ thống theo ý thích của bạn',
    },
  ],
}

function skip() {
  show.value = false
}

function done() {
  show.value = false
}

function next() {
  // tipItem thông tin mục gợi ý hiện tại
  // Gọi phương thức next của vue3-intro-step để kích hoạt bước tiếp theo thủ công
  myIntroStep.value.next()
}
function prev() {
  // Gọi phương thức prev của vue3-intro-step để kích hoạt bước trước thủ công
  myIntroStep.value.prev()
}
</script>
