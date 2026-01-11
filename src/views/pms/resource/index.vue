<template>
  <CommonPage>
    <div class="flex">
      <n-spin size="small" :show="treeLoading">
        <MenuTree
          v-model:current-menu="currentMenu"
          class="w-320 shrink-0"
          :tree-data="treeData"
          @refresh="initData"
        />
      </n-spin>

      <div class="ml-40 w-0 flex-1">
        <template v-if="currentMenu">
          <div class="flex justify-between">
            <h3 class="mb-12">
              {{ currentMenu.name }}
            </h3>
            <NButton size="small" type="primary" @click="handleEdit(currentMenu)">
              <i class="i-material-symbols:edit-outline mr-4 text-14" />
              Sửa
            </NButton>
          </div>
          <n-descriptions label-placement="left" bordered :column="2">
            <n-descriptions-item label="Mã">
              {{ currentMenu.code }}
            </n-descriptions-item>
            <n-descriptions-item label="Tên">
              {{ currentMenu.name }}
            </n-descriptions-item>
            <n-descriptions-item label="Địa chỉ route">
              {{ currentMenu.path ?? '--' }}
            </n-descriptions-item>
            <n-descriptions-item label="Đường dẫn component">
              {{ currentMenu.component ?? '--' }}
            </n-descriptions-item>
            <n-descriptions-item label="Icon menu">
              <span v-if="currentMenu.icon" class="flex items-center">
                <i :class="`${currentMenu.icon}?mask text-22 mr-8`" />
                <span class="opacity-50">{{ currentMenu.icon }}</span>
              </span>
              <span v-else>Không có</span>
            </n-descriptions-item>
            <n-descriptions-item label="layout">
              {{ currentMenu.layout || 'Theo hệ thống' }}
            </n-descriptions-item>
            <n-descriptions-item label="Có hiển thị">
              {{ currentMenu.show ? 'Có' : 'Không' }}
            </n-descriptions-item>
            <n-descriptions-item label="Có kích hoạt">
              {{ currentMenu.enable ? 'Có' : 'Không' }}
            </n-descriptions-item>
            <n-descriptions-item label="KeepAlive">
              {{ currentMenu.keepAlive ? 'Có' : 'Không' }}
            </n-descriptions-item>
            <n-descriptions-item label="Sắp xếp">
              {{ currentMenu.order ?? '--' }}
            </n-descriptions-item>
          </n-descriptions>

          <div class="mt-32 flex justify-between">
            <h3 class="mb-12">
              Nút bấm
            </h3>
            <NButton size="small" type="primary" @click="handleAddBtn">
              <i class="i-fe:plus mr-4 text-14" />
              Thêm mới
            </NButton>
          </div>

          <MeCrud
            ref="$table"
            :columns="btnsColumns"
            :scroll-x="-1"
            :get-data="api.getButtons"
            :query-items="{ parentId: currentMenu.id }"
          />
        </template>
        <n-empty v-else class="h-450 f-c-c" size="large" description="Vui lòng chọn menu bên trái" />
      </div>
    </div>
    <ResAddOrEdit ref="modalRef" :menus="treeData" @refresh="initData" />
  </CommonPage>
</template>

<script setup>
import { NButton, NSwitch } from 'naive-ui'
import { MeCrud } from '@/components'
import api from './api'
import MenuTree from './components/MenuTree.vue'
import ResAddOrEdit from './components/ResAddOrEdit.vue'

const treeData = ref([])
const treeLoading = ref(false)
const $table = ref(null)
const currentMenu = ref(null)
async function initData(data) {
  if (data?.type === 'BUTTON') {
    $table.value.handleSearch()
    return
  }
  treeLoading.value = true
  const res = await api.getMenuTree()
  treeData.value = res?.data || []
  treeLoading.value = false

  if (data)
    currentMenu.value = data
}
initData()

const modalRef = ref(null)
function handleEdit(item = {}) {
  modalRef.value?.handleOpen({
    action: 'edit',
    title: `Sửa menu - ${item.name}`,
    row: item,
    okText: 'Lưu',
  })
}

const btnsColumns = [
  { title: 'Tên', key: 'name' },
  { title: 'Mã', key: 'code' },
  {
    title: 'Trạng thái',
    key: 'enable',
    render: row =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: row.enable,
          loading: !!row.enableLoading,
          onUpdateValue: () => handleEnable(row),
        },
        {
          checked: () => 'Kích hoạt',
          unchecked: () => 'Tắt',
        },
      ),
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 320,
    align: 'right',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            onClick: () => handleEditBtn(row),
          },
          {
            default: () => 'Sửa',
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-14' }),
          },
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: () => handleDeleteBtn(row.id),
          },
          {
            default: () => 'Xóa',
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          },
        ),
      ]
    },
  },
]

watch(
  () => currentMenu.value,
  async (v) => {
    await nextTick()
    if (v)
      $table.value.handleSearch()
  },
)

function handleAddBtn() {
  modalRef.value?.handleOpen({
    action: 'add',
    title: 'Thêm nút bấm',
    row: { type: 'BUTTON', parentId: currentMenu.value.id },
    okText: 'Lưu',
  })
}

function handleEditBtn(row) {
  modalRef.value?.handleOpen({
    action: 'edit',
    title: `Sửa nút bấm - ${row.name}`,
    row,
    okText: 'Lưu',
  })
}

function handleDeleteBtn(id) {
  const d = $dialog.warning({
    content: 'Xác nhận xóa?',
    title: 'Thông báo',
    positiveText: 'Xác nhận',
    negativeText: 'Hủy',
    async onPositiveClick() {
      try {
        d.loading = true
        await api.deletePermission(id)
        $message.success('Xóa thành công')
        $table.value.handleSearch()
        d.loading = false
      }
      catch (error) {
        console.error(error)
        d.loading = false
      }
    },
  })
}

async function handleEnable(item) {
  try {
    item.enableLoading = true
    await api.savePermission(item.id, {
      enable: !item.enable,
    })
    $message.success('Thao tác thành công')
    $table.value?.handleSearch()
    item.enableLoading = false
  }
  catch (error) {
    console.error(error)
    item.enableLoading = false
  }
}
</script>
