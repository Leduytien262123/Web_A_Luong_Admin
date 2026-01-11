<template>
  <CommonPage :show-header="false">
    <div class="wh-full flex">
      <n-result
        class="m-auto"
        status="403"
        title="403 Cấm truy cập"
        description="Xin lỗi, bạn tạm thời không có quyền truy cập, vui lòng liên hệ quản trị viên để cấp quyền."
        size="large"
      >
        <template #footer>
          <n-button v-if="back" type="primary" ghost @click="router.replace(back)">
            Quay lại trang trước
          </n-button>
          <n-button type="primary" class="ml-20" @click="router.replace('/')">
            Về trang chủ
          </n-button>
        </template>
      </n-result>
    </div>
  </CommonPage>
</template>

<script setup>
const router = useRouter()
const route = useRoute()

const back = history.state.back

if (history.state.from === 'permission-guard') {
  delete history.state.from
}
else if (route.query.path) {
  router.replace(route.query.path)
}
</script>
