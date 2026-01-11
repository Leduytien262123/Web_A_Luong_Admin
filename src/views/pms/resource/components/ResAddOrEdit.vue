<template>
  <MeModal ref="modalRef">
    <n-form
      ref="modalFormRef"
      label-placement="left"
      require-mark-placement="left"
      :label-width="100"
      :model="modalForm"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" label="Menu thuộc về" path="parentId">
          <n-tree-select
            v-model:value="modalForm.parentId"
            :options="menuOptions"
            :disabled="parentIdDisabled"
            label-field="name"
            key-field="id"
            placeholder="Menu gốc"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="name" :rule="required">
          <template #label>
            <QuestionLabel label="Tên" content="Tiêu đề" />
          </template>
          <n-input v-model:value="modalForm.name" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="code" :rule="required">
          <template #label>
            <QuestionLabel label="Mã" content="Nếu là menu thì tương ứng với name của route frontend, sử dụng PascalCase" />
          </template>
          <n-input v-model:value="modalForm.code" />
        </n-form-item-gi>
        <n-form-item-gi
          v-if="modalForm.type === 'MENU'"
          :span="12"
          path="path"
          :rule="{
            trigger: ['blur', 'change'],
            type: 'string',
            message: 'Phải bắt đầu bằng /、http、https',
            validator(rule, value) {
              if (value) {
                return /\/|http|https/.test(value)
              }
              return true
            },
          }"
        >
          <template #label>
            <QuestionLabel label="Địa chỉ route" content="Menu cha có thể không cần điền" />
          </template>
          <n-input v-model:value="modalForm.path" />
        </n-form-item-gi>
        <n-form-item-gi v-if="modalForm.type === 'MENU'" :span="12" path="icon">
          <template #label>
            <QuestionLabel
              label="Icon menu"
              content="Như material-symbols:help，thư viện icon: https://icones.js.org/collection/all"
            />
          </template>
          <n-select v-model:value="modalForm.icon" :options="iconOptions" clearable filterable />
        </n-form-item-gi>
        <n-form-item-gi v-if="modalForm.type === 'MENU'" :span="12" path="layout">
          <template #label>
            <QuestionLabel
              label="layout"
              content="Tương ứng với tên thư mục trong layouts, để trống thì mặc định là default"
            />
          </template>
          <n-select v-model:value="modalForm.layout" :options="layoutOptions" clearable />
        </n-form-item-gi>
        <n-form-item-gi v-if="modalForm.type === 'MENU'" :span="24" path="component">
          <template #label>
            <QuestionLabel
              label="Đường dẫn component"
              content="Đường dẫn component frontend, bắt đầu bằng /src, menu cha có thể không cần điền"
            />
          </template>
          <n-select
            v-model:value="modalForm.component"
            :options="componentOptions"
            clearable
            filterable
            tag
          />
        </n-form-item-gi>

        <n-form-item-gi v-if="modalForm.type === 'MENU'" :span="12" path="show">
          <template #label>
            <QuestionLabel label="Trạng thái hiển thị" content="Kiểm soát có hiển thị trong thanh menu hay không, không ảnh hưởng đến đăng ký route" />
          </template>
          <n-switch v-model:value="modalForm.show">
            <template #checked>
              Hiển thị
            </template>
            <template #unchecked>
              Ẩn
            </template>
          </n-switch>
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="enable">
          <template #label>
            <QuestionLabel
              label="Trạng thái"
              content="Nếu là menu, vô hiệu hóa sẽ không được thêm vào bảng route, không thể vào trang này"
            />
          </template>
          <n-switch v-model:value="modalForm.enable">
            <template #checked>
              Kích hoạt
            </template>
            <template #unchecked>
              Vô hiệu hóa
            </template>
          </n-switch>
        </n-form-item-gi>
        <n-form-item-gi v-if="modalForm.type === 'MENU'" :span="12" path="keepAlive">
          <template #label>
            <QuestionLabel
              label="KeepAlive"
              content="Thiết lập keepAlive cần đặt tên component là mã của menu hiện tại"
            />
          </template>
          <n-switch v-model:value="modalForm.keepAlive">
            <template #checked>
              Có
            </template>
            <template #unchecked>
              Không
            </template>
          </n-switch>
        </n-form-item-gi>
        <n-form-item-gi
          v-if="modalForm.type === 'MENU'"
          :span="12"
          label="Sắp xếp"
          path="order"
          :rule="{
            type: 'number',
            required: true,
            message: 'Đây là trường bắt buộc',
            trigger: ['blur', 'change'],
          }"
        >
          <n-input-number v-model:value="modalForm.order" />
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </MeModal>
</template>

<script setup>
import icons from 'isme:icons'
import pagePathes from 'isme:page-pathes'
import { MeModal } from '@/components'
import { useForm, useModal } from '@/composables'
import api from '../api'
import QuestionLabel from './QuestionLabel.vue'

const props = defineProps({
  menus: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits(['refresh'])

const menuOptions = computed(() => {
  return [{ name: 'Menu gốc', id: '', children: props.menus || [] }]
})
const componentOptions = pagePathes.map(path => ({ label: path, value: path }))
const iconOptions = icons.map(item => ({
  label: () =>
    h('span', { class: 'flex items-center' }, [h('i', { class: `${item} text-18 mr-8` }), item]),
  value: item,
}))
const layoutOptions = [
  { label: 'Theo hệ thống', value: '' },
  { label: 'Tối giản-simple', value: 'simple' },
  { label: 'Thông thường-normal', value: 'normal' },
  { label: 'Đầy đủ-full', value: 'full' },
  { label: 'Trống-empty', value: 'empty' },
]
const required = {
  required: true,
  message: 'Đây là trường bắt buộc',
  trigger: ['blur', 'change'],
}

const defaultForm = { enable: true, show: true, layout: '' }
const [modalFormRef, modalForm, validation] = useForm()
const [modalRef, okLoading] = useModal()

const modalAction = ref('')
const parentIdDisabled = ref(false)
function handleOpen(options = {}) {
  const { action, row = {}, ...rest } = options
  modalAction.value = action
  modalForm.value = { ...defaultForm, ...row }
  parentIdDisabled.value = !!row.parentId && row.type === 'BUTTON'
  modalRef.value.open({ ...rest, onOk: onSave })
}

async function onSave() {
  await validation()
  okLoading.value = true
  try {
    let newFormData
    if (!modalForm.value.parentId)
      modalForm.value.parentId = null
    if (modalAction.value === 'add') {
      const res = await api.addPermission(modalForm.value)
      newFormData = res.data
    }
    else if (modalAction.value === 'edit') {
      await api.savePermission(modalForm.value.id, modalForm.value)
    }
    okLoading.value = false
    $message.success('Lưu thành công')
    emit('refresh', modalAction.value === 'add' ? newFormData : modalForm.value)
  }
  catch (error) {
    console.error(error)
    okLoading.value = false
    return false
  }
}

defineExpose({
  handleOpen,
})
</script>
