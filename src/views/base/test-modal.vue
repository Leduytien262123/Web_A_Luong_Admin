<template>
  <CommonPage show-footer>
    <n-button type="primary" @click="openModal1">
      Mở cửa sổ bật lên đầu tiên
    </n-button>
    <MeModal ref="$modal1">
      <n-input v-model:value="text" />
    </MeModal>
    <MeModal ref="$modal2" title="Nội dung đã gửi từ cửa sổ bật lên trước">
      <h2>{{ text }}</h2>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { MeModal } from '@/components'
import { useModal } from '@/composables'
import { sleep } from '@/utils'

const text = ref('')
const [$modal1, okLoading1] = useModal()
function openModal1() {
  $modal1.value?.open({
    title: 'Cửa sổ bật lên đầu tiên',
    width: '600px',
    okText: 'Mở cửa sổ bật lên khác',
    cancelText: 'Đóng',
    async onOk() {
      if (!text.value) {
        $message.warning('Vui lòng nhập nội dung')
        return false // Ngăn cửa sổ bật lên đóng
      }
      okLoading1.value = true
      $message.loading('Đang gửi...', { key: 'modal1' })
      await sleep(1000)
      okLoading1.value = false
      $message.success('Gửi thành công', { key: 'modal1' })
      openModal2()
      return false // Mặc định đóng cửa sổ bật lên, trả về false để không đóng cửa sổ bật lên
    },
    onCancel(message) {
      $message.info(message ?? 'Đã hủy')
    },
  })
}

const [$modal2, okLoading2] = useModal()
function openModal2() {
  $modal2.value?.open({
    cancelText: 'Đóng hiện tại',
    okText: 'Đóng tất cả cửa sổ bật lên',
    width: '400px',
    async onOk() {
      okLoading2.value = true
      $message.loading('Đang đóng...', { key: 'modal2' })
      await sleep(1000)
      okLoading2.value = false

      // Đóng cả modal1
      $modal1.value?.close()
      $message.success('Đã đóng', { key: 'modal2' })
    },
  })
}
</script>
