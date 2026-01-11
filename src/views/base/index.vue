<template>
  <CommonPage show-footer>
    <n-space size="large">
      <n-card title="Nút Button">
        <n-space>
          <n-button>Default</n-button>
          <n-button type="tertiary">
            Tertiary
          </n-button>
          <n-button type="primary">
            Primary
          </n-button>
          <n-button type="info">
            Info
          </n-button>
          <n-button type="success">
            Success
          </n-button>
          <n-button type="warning">
            Warning
          </n-button>
          <n-button type="error">
            Error
          </n-button>
        </n-space>
      </n-card>

      <n-card title="Nút có Icon">
        <n-space>
          <n-button type="info">
            <i class="i-material-symbols:add mr-4 text-18" />
            Thêm mới
          </n-button>
          <n-button type="error">
            <i class="i-material-symbols:delete-outline mr-4 text-18" />
            Xóa
          </n-button>
          <n-button type="warning">
            <i class="i-material-symbols:edit-outline mr-4 text-18" />
            Sửa
          </n-button>
          <n-button type="primary">
            <i class="i-majesticons:eye-line mr-4 text-18" />
            Xem
          </n-button>
        </n-space>
      </n-card>
    </n-space>

    <n-space size="large" mt-30>
      <n-card min-w-340 title="Thông báo Notification">
        <n-space>
          <n-button @click="notify('info')">
            Thông tin
          </n-button>
          <n-button @click="notify('success')">
            Thành công
          </n-button>
          <n-button @click="notify('warning')">
            Cảnh báo
          </n-button>
          <n-button @click="notify('error')">
            Lỗi
          </n-button>
        </n-space>
      </n-card>

      <n-card min-w-340 title="Hộp thoại xác nhận Dialog">
        <n-button type="error" @click="handleDelete">
          <i class="i-mi:delete mr-4" />
          Xóa
        </n-button>
      </n-card>

      <n-card min-w-340 title="Thông báo Message">
        <n-space>
          <n-button :loading="loading" type="primary" @click="handleLogin">
            <i v-show="!loading" class="i-mdi:login mr-4" />
            Đăng nhập
          </n-button>
          <n-button type="error" @click="handleMultiMessage">
            Nhiều thông báo lỗi
          </n-button>
        </n-space>
      </n-card>
    </n-space>
  </CommonPage>
</template>

<script setup>
import { sleep } from '@/utils'

function handleDelete() {
  $dialog.confirm({
    content: 'Xác nhận xóa?',
    confirm() {
      $message.success('Xóa thành công')
    },
    cancel() {
      $message.warning('Đã hủy')
    },
  })
}

const loading = ref(false)
async function handleLogin() {
  loading.value = true
  $message.loading('Đang đăng nhập...', { key: 'login' })
  await sleep(2000)
  $message.error('Đăng nhập thất bại', { key: 'login' })
  await sleep(500)
  $message.loading('Đang thử đăng nhập lại...', { key: 'login' })
  await sleep(2000)
  $message.success('Đăng nhập thành công', { key: 'login' })
  loading.value = false
}

function handleMultiMessage() {
  $message.error(['Tên người dùng không được để trống!', 'Mật khẩu không được để trống!', 'Mật khẩu phải dài hơn 6 ký tự!'])
}

function notify(type) {
  $notification[type]({
    content: 'Nội dung gì đó',
    meta: 'Không nghĩ ra gì',
    duration: 2500,
    keepAliveOnHover: true,
  })
}
</script>
