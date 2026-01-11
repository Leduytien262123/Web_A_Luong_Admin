<template>
  <n-modal
    v-model:show="show"
    class="modal-box"
    :style="{ width: modalOptions.width, ...modalOptions.modalStyle }"
    :preset="undefined"
    size="huge"
    :bordered="false"
    @after-leave="onAfterLeave"
  >
    <n-card :style="modalOptions.contentStyle" :closable="modalOptions.closable" @close="close()">
      <template #header>
        <header class="modal-header">
          {{ modalOptions.title }}
        </header>
      </template>
      <slot />

      <!-- Nút ở dưới cùng -->
      <template #footer>
        <slot name="footer">
          <footer v-if="modalOptions.showFooter" class="flex justify-end">
            <n-button v-if="modalOptions.showCancel" @click="handleCancel()">
              {{ modalOptions.cancelText }}
            </n-button>
            <n-button
              v-if="modalOptions.showOk"
              type="primary"
              :loading="modalOptions.okLoading"
              class="ml-20"
              @click="handleOk()"
            >
              {{ modalOptions.okText }}
            </n-button>
          </footer>
        </slot>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup>
import { initDrag } from './utils'

const props = defineProps({
  width: {
    type: String,
    default: '800px',
  },
  title: {
    type: String,
    default: '',
  },
  closable: {
    type: Boolean,
    default: true,
  },
  cancelText: {
    type: String,
    default: 'Hủy',
  },
  okText: {
    type: String,
    default: 'Xác nhận',
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  showOk: {
    type: Boolean,
    default: true,
  },
  modalStyle: {
    type: Object,
    default: () => {},
  },
  contentStyle: {
    type: Object,
    default: () => {},
  },
  onOk: {
    type: Function,
    default: () => {},
  },
  onCancel: {
    type: Function,
    default: () => {},
  },
})
// Khai báo biến show để điều khiển hiển thị và ẩn modal
const show = ref(false)
// Khai báo biến modalOptions để lưu trữ thông tin cấu hình của modal
const modalOptions = ref({})

const okLoading = computed({
  get() {
    return !!modalOptions.value?.okLoading
  },
  set(v) {
    if (modalOptions.value) {
      modalOptions.value.okLoading = v
    }
  },
})

// Mở modal
async function open(options = {}) {
  // Gán props và options vào modalOptions
  modalOptions.value = { ...props, ...options }

  // Đặt giá trị của show là true
  show.value = true
  await nextTick()
  initDrag(
    Array.prototype.at.call(document.querySelectorAll('.modal-header'), -1),
    Array.prototype.at.call(document.querySelectorAll('.modal-box'), -1),
  )
}

// Định nghĩa hàm close để đóng modal
function close() {
  show.value = false
}

// Định nghĩa hàm handleOk để xử lý hành động xác nhận của modal
async function handleOk(data) {
  // Nếu modalOptions không có hàm onOk, thì đóng modal trực tiếp
  if (typeof modalOptions.value.onOk !== 'function') {
    return close()
  }
  try {
    // Gọi hàm onOk, truyền vào tham số data
    const res = await modalOptions.value.onOk(data)
    // Nếu giá trị trả về của hàm onOk không phải false, thì đóng modal
    if (res !== false)
      close()
  }
  catch (error) {
    console.error(error)
    okLoading.value = false
  }
}

// Định nghĩa hàm handleCancel để xử lý hành động hủy của modal
async function handleCancel(data) {
  // Nếu modalOptions không có hàm onCancel, thì đóng modal trực tiếp
  if (typeof modalOptions.value.onCancel !== 'function') {
    return close()
  }
  try {
    // Gọi hàm onCancel, truyền vào tham số data
    const res = await modalOptions.value.onCancel(data)

    // Nếu giá trị trả về của hàm onCancel không phải false, thì đóng modal
    if (res !== false)
      close()
  }
  catch (error) {
    console.error(error)
    okLoading.value = false
  }
}

async function onAfterLeave() {
  await nextTick()
  initDrag(
    Array.prototype.at.call(document.querySelectorAll('.modal-header'), -1),
    Array.prototype.at.call(document.querySelectorAll('.modal-box'), -1),
  )
}

// Định nghĩa hàm defineExpose để lộ ra các hàm open, close, handleOk, handleCancel
defineExpose({
  open,
  close,
  handleOk,
  handleCancel,
  okLoading,
  options: modalOptions,
})
</script>
