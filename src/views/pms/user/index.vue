<template>
  <CommonPage>
    <template #action>
      <NButton v-permission="'AddUser'" type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        Tạo người dùng mới
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
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

    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          label="Tên người dùng"
          path="username"
          :rule="{
            required: true,
            message: 'Vui lòng nhập tên người dùng',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.username" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item
          v-if="['add', 'reset'].includes(modalAction)"
          :label="modalAction === 'reset' ? 'Đặt lại mật khẩu' : 'Mật khẩu ban đầu'"
          path="password"
          :rule="{
            required: true,
            message: 'Vui lòng nhập mật khẩu',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.password" type="password" show-password-on="mousedown" />
        </n-form-item>

        <n-form-item v-if="['add', 'setRole'].includes(modalAction)" label="Vai trò" path="roleIds">
          <n-select
            v-model:value="modalForm.roleIds"
            :options="roles"
            label-field="name"
            value-field="id"
            clearable
            filterable
            multiple
          />
        </n-form-item>
        <n-form-item v-if="modalAction === 'add'" label="Trạng thái" path="enable">
          <NSwitch v-model:value="modalForm.enable">
            <template #checked>
              Kích hoạt
            </template>
            <template #unchecked>
              Tắt
            </template>
          </NSwitch>
        </n-form-item>
      </n-form>
      <n-alert v-if="modalAction === 'add'" type="warning" closable>
        Thông tin chi tiết cần được người dùng bổ sung và chỉnh sửa
      </n-alert>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag } from 'naive-ui'
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import { withPermission } from '@/directives'
import { formatDateTime } from '@/utils'
import api from './api'

defineOptions({ name: 'UserMgt' })

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
const roles = ref([])
api.getAllRoles().then(({ data = [] }) => (roles.value = data))

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleDelete,
  handleOpen,
  handleSave,
} = useCrud({
  name: 'Người dùng',
  initForm: { enable: true },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})

const columns = [
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
  { title: 'Email', key: 'email', width: 150, ellipsis: { tooltip: true } },
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
    width: 120,
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
    width: 420,
    align: 'right',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        withPermission(
          h(NButton, {
            size: 'small',
            type: 'primary',
            secondary: true,
          }, {
            default: () => 'Dành cho quản trị',
            icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
          }),
          'SuperAdmin',
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            class: 'ml-12px',
            secondary: true,
            onClick: () => handleOpenRolesSet(row),
          },
          {
            default: () => 'Phân quyền vai trò',
            icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            onClick: () => handleOpen({ action: 'reset', title: 'Đặt lại mật khẩu', row, onOk: onSave }),
          },
          {
            default: () => 'Đặt lại mật khẩu',
            icon: () => h('i', { class: 'i-radix-icons:reset text-14' }),
          },
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: () => handleDelete(row.id),
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

async function handleEnable(row) {
  row.enableLoading = true
  try {
    await api.update({ id: row.id, enable: !row.enable })
    row.enableLoading = false
    $message.success('Thao tác thành công')
    $table.value?.handleSearch()
  }
  catch (error) {
    console.error(error)
    row.enableLoading = false
  }
}

function handleOpenRolesSet(row) {
  const roleIds = row.roles.map(item => item.id)
  handleOpen({
    action: 'setRole',
    title: 'Phân quyền vai trò',
    row: { id: row.id, username: row.username, roleIds },
    onOk: onSave,
  })
}

function onSave() {
  if (modalAction.value === 'setRole') {
    return handleSave({
      api: () => api.update(modalForm.value),
      cb: () => $message.success('Phân quyền thành công'),
    })
  }
  else if (modalAction.value === 'reset') {
    return handleSave({
      api: () => api.resetPwd(modalForm.value.id, modalForm.value),
      cb: () => $message.success('Đặt lại mật khẩu thành công'),
    })
  }
  handleSave()
}
</script>
