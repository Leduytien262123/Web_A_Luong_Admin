<template>
  <div>
    <n-space vertical :size="12">
      <h3>Menu</h3>
      <div class="flex">
        <n-input v-model:value="pattern" placeholder="Tìm kiếm" clearable />
        <NButton class="ml-12" type="primary" @click="handleAdd()">
          <i class="i-material-symbols:add mr-4 text-14" />
          Thêm mới
        </NButton>
      </div>

      <n-tree
        :show-irrelevant-nodes="false"
        :pattern="pattern"
        :data="treeData"
        :selected-keys="[currentMenu?.code]"
        :render-prefix="renderPrefix"
        :render-suffix="renderSuffix"
        :on-update:selected-keys="onSelect"
        key-field="code"
        label-field="name"
        block-line default-expand-all
      />
    </n-space>

    <ResAddOrEdit ref="modalRef" :menus="treeData" @refresh="(data) => emit('refresh', data)" />
  </div>
</template>

<script setup>
import { NButton } from 'naive-ui'
import { withModifiers } from 'vue'
import api from '../api'
import ResAddOrEdit from './ResAddOrEdit.vue'

defineProps({
  treeData: {
    type: Array,
    default: () => [],
  },
  currentMenu: {
    type: Object,
    default: () => null,
  },
})
const emit = defineEmits(['refresh', 'update:currentMenu'])

const pattern = ref('')

const modalRef = ref(null)
async function handleAdd(data = {}) {
  emit('refresh')
  emit('update:currentMenu', null)
  modalRef.value?.handleOpen({
    action: 'add',
    title: 'Thêm menu',
    row: { ...data, type: 'MENU' },
    okText: 'Lưu',
  })
}

function onSelect(keys, option, { action, node }) {
  emit('update:currentMenu', action === 'select' ? node : null)
}

function renderPrefix({ option }) {
  return h('i', { class: `${option.icon}?mask text-16` })
}

function renderSuffix({ option }) {
  return [
    h(
      NButton,
      {
        text: true,
        type: 'primary',
        title: 'Thêm menu con',
        size: 'tiny',
        onClick: withModifiers(() => handleAdd({ parentId: option.id }), ['stop']),
      },
      { default: () => 'Thêm mới' },
    ),

    h(
      NButton,
      {
        text: true,
        type: 'error',
        size: 'tiny',
        style: 'margin-left: 12px;',
        onClick: withModifiers(() => handleDelete(option), ['stop']),
      },
      { default: () => 'Xóa' },
    ),
  ]
}

function handleDelete(item) {
  $dialog.confirm({
    content: `Xác nhận xóa【${item.name}】?`,
    async confirm() {
      try {
        $message.loading('Đang xóa', { key: 'deleteMenu' })
        await api.deletePermission(item.id)
        $message.success('Xóa thành công', { key: 'deleteMenu' })
        emit('refresh')
        emit('update:currentMenu', null)
      }
      catch (error) {
        console.error(error)
        $message.destroy('deleteMenu')
      }
    },
  })
}
</script>
