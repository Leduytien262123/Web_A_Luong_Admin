<template>
  <CommonPage back>
    <template #title-suffix>
      <NTag class="ml-12" type="warning">
        {{ route.query.roleName }}
      </NTag>
    </template>
    <template #action>
      <div class="flex items-center">
        <NButton :disabled="!userIds.length" type="error" @click="handleBatchRemove()">
          <i v-if="userIds.length" class="i-material-symbols:delete-outline mr-4 text-18" />
          Hủy phân quyền hàng loạt
        </NButton>
        <NButton
          class="ml-12"
          :disabled="!userIds.length"
          type="primary"
          @click="handleBatchAdd()"
        >
          <i v-if="userIds.length" class="i-line-md:confirm-circle mr-4 text-18" />
          Phân quyền hàng loạt
        </NButton>
      </div>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.getAllUsers"
      @on-checked="onChecked"
    >
      <MeQueryItem label="Tên người dùng" :label-width="90">
        <n-input
          v-model:value="queryItems.username"
          type="text"
          placeholder="Nhập tên người dùng"
          clearable
        />
      </MeQueryItem>

      <MeQueryItem label="Giới tính" :label-width="50">
        <n-select v-model:value="queryItems.gender" clearable :options="genders" />
      </MeQueryItem>

      <MeQueryItem label="Trạng thái" :label-width="50">
        <n-select
          v-model:value="queryItems.enable"
          clearable
          :options="[
            { label: 'Kích hoạt', value: 1 },
            { label: 'Tắt', value: 0 },
          ]"
        />
      </MeQueryItem>
    </MeCrud>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag } from 'naive-ui'
import { h } from 'vue'
import { MeCrud, MeQueryItem } from '@/components'
import { formatDateTime } from '@/utils'
import api from './api'

defineOptions({ name: 'RoleUser' })
const route = useRoute()

const $table = ref(null)
/** Tham số lọc QueryBar (tùy chọn) */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

const genders = [
  { label: 'Nam', value: 1 },
  { label: 'Nữ', value: 2 },
]

const columns = [
  { type: 'selection', fixed: 'left' },
  {
    title: 'Ảnh đại diện',
    key: 'avatar',
    width: 80,
    render: ({ avatar }) =>
      h(NAvatar, {
        size: 'medium',
        src: avatar,
      }),
  },
  { title: 'Tên người dùng', key: 'username', width: 150, ellipsis: { tooltip: true } },
  {
    title: 'Vai trò',
    key: 'roles',
    width: 200,
    ellipsis: { tooltip: true },
    render: ({ roles }) => {
      if (roles?.length) {
        return roles.map((item, index) =>
          h(
            NTag,
            { type: 'success', style: index > 0 ? 'margin-left: 8px;' : '' },
            { default: () => item.name },
          ),
        )
      }
      return 'Chưa có vai trò'
    },
  },
  {
    title: 'Giới tính',
    key: 'gender',
    width: 80,
    render: ({ gender }) => genders.find(item => gender === item.value)?.label ?? '',
  },
  {
    title: 'Thời gian tạo',
    key: 'createDate',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row.createTime))
    },
  },
  {
    title: 'Trạng thái',
    key: 'enable',
    width: 100,

    render: row =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: row.enable,
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
    width: 100,
    align: 'right',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return row.roles?.some(item => item.id === +route.params.roleId)
        ? h(
            NButton,
            {
              size: 'small',
              type: 'error',
              secondary: true,
              onClick: () => handleBatchRemove([row.id]),
            },
            {
              default: () => 'Hủy phân quyền',
              icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
            },
          )
        : h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              secondary: true,
              onClick: () => handleBatchAdd([row.id]),
            },
            {
              default: () => 'Phân quyền',
              icon: () => h('i', { class: 'i-line-md:confirm-circle text-14' }),
            },
          )
    },
  },
]

const userIds = ref([])
function onChecked(rowKeys) {
  userIds.value = rowKeys || []
}

function handleBatchAdd(ids = userIds.value) {
  const roleId = route.params.roleId
  if (!roleId)
    return $message.error('Vai trò bất thường, vui lòng chọn lại vai trò')
  if (!ids.length)
    return $message.error('Vui lòng chọn người dùng trước')
  $dialog.confirm({
    content: `Xác nhận phân quyền【${route.query.roleName}】?`,
    async confirm() {
      try {
        await api.assignUsers(roleId, ids)
        $message.success('Phân quyền thành công')
        $table.value?.handleSearch()
      }
      catch (error) {
        console.error(error)
      }
    },
  })
}

function handleBatchRemove(ids = userIds.value) {
  const roleId = route.params.roleId
  if (!roleId)
    return $message.error('Vai trò bất thường, vui lòng chọn lại vai trò')
  if (!ids.length)
    return $message.error('Vui lòng chọn người dùng trước')
  $dialog.confirm({
    content: `Xác nhận hủy phân quyền【${route.query.roleName}】?`,
    async confirm() {
      try {
        await api.removeUsers(roleId, ids)
        $message.success('Hủy phân quyền thành công')
        $table.value?.handleSearch()
      }
      catch (error) {
        console.error(error)
      }
    },
  })
}
</script>
