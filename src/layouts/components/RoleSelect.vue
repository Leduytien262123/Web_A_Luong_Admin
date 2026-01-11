<template>
  <MeModal ref="modalRef" title="Vui lòng chọn vai trò" width="360px" class="p-12">
    <n-radio-group v-model:value="roleCode" class="cus-scroll-y max-h-420 w-full py-16">
      <n-space vertical :size="24" class="mx-12">
        <n-radio-button
          v-for="role in roles"
          :key="role.id"
          class="h-36 w-full text-center text-16 leading-36"
          :class="{ 'bg-primary! color-white!': role.code === roleCode }"
          :value="role.code"
        >
          {{ role.name }}
        </n-radio-button>
      </n-space>
    </n-radio-group>

    <template #footer>
      <div class="flex">
        <n-button class="flex-1" size="large" @click="logout()">
          Thoát đăng nhập
        </n-button>
        <n-button
          :loading="okLoading"
          class="ml-20 flex-1"
          type="primary"
          size="large"
          :disabled="userStore.currentRole?.code === roleCode"
          @click="setCurrentRole"
        >
          Xác nhận
        </n-button>
      </div>
    </template>
  </MeModal>
</template>

<script setup>
import api from '@/api'
import { MeModal } from '@/components'
import { useModal } from '@/composables'
import { useAuthStore, useUserStore } from '@/store'

const userStore = useUserStore()
const authStore = useAuthStore()

const roles = ref(userStore.roles || [])
const roleCode = ref(userStore.currentRole?.code ?? roles.value[0]?.code ?? '')

const [modalRef, okLoading] = useModal()
function open(options) {
  modalRef.value?.open({
    ...options,
  })
}

async function setCurrentRole() {
  try {
    okLoading.value = true
    const { data } = await api.switchCurrentRole(roleCode.value)
    await authStore.switchCurrentRole(data)
    okLoading.value = false
    $message.success('Chuyển đổi thành công')
    modalRef.value?.handleOk()
  }
  catch (error) {
    console.error(error)
    okLoading.value = false
    return false
  }
}

async function logout() {
  // Chỉ logout local, không call API
  authStore.logout()
  modalRef.value?.close()
  $message.success('Đã đăng xuất')
}

defineExpose({
  open,
})
</script>
