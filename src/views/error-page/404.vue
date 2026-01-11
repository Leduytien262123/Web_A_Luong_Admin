<template>
  <CommonPage :show-header="false">
    <div class="wh-full flex">
      <n-result
        m-auto
        status="404"
        title="404 Trang bạn truy cập không tồn tại"
        description="Chúng tôi sẽ phát triển chức năng này sớm nhất có thể."
        size="large"
      >
        <template #footer>
          <n-button type="primary" ghost @click="replace('/')">
            Quay về trang chủ
          </n-button>
        </template>
      </n-result>
    </div>
  </CommonPage>
</template>

<script setup>
const { replace } = useRouter()
</script>
