<template>
  <CommonPage>
    <template #action>
      <NButton type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        Thêm vai trò
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="Tên vai trò" :label-width="80">
        <n-input
          v-model:value="queryItems.name"
          type="text"
          placeholder="Nhập tên vai trò"
          clearable
        />
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
      >
        <n-form-item
          label="Tên vai trò"
          path="name"
          :rule="{
            required: true,
            message: 'Vui lòng nhập tên vai trò',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" />
        </n-form-item>
        <n-form-item
          label="Mã vai trò"
          path="code"
          :rule="{
            required: true,
            message: 'Vui lòng nhập mã vai trò',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input
            v-model:value="modalForm.code"
            :disabled="modalAction !== 'add'"
          />
        </n-form-item>
        <n-form-item label="Quyền" path="permissionIds">
          <n-tree
            key-field="id"
            label-field="name"
            :selectable="false"
            :data="permissionTree"
            :checked-keys="modalForm.permissionIds"
            :on-update:checked-keys="(keys) => (modalForm.permissionIds = keys)"
            checkable
            check-on-click
            default-expand-all
            class="cus-scroll max-h-200 w-full"
          />
        </n-form-item>
        <n-form-item label="Trạng thái" path="enable">
          <NSwitch v-model:value="modalForm.enable">
            <template #checked> Kích hoạt </template>
            <template #unchecked> Tắt </template>
          </NSwitch>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
defineOptions({ name: "RoleMgt" });

const router = useRouter();

const $table = ref(null);
/** Tham số lọc QueryBar (tùy chọn) */
const queryItems = ref({});

onMounted(() => {
  $table.value?.handleSearch();
});

const {
  modalRef,
  modalFormRef,
  modalAction,
  modalForm,
  handleAdd,
  handleDelete,
  handleEdit,
} = useCrud({
  name: "Vai trò",
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  initForm: { enable: true },
  refresh: (_, keepCurrentPage) => $table.value?.handleSearch(keepCurrentPage),
});

const columns = [
  { title: "Tên vai trò", key: "name" },
  { title: "Mã vai trò", key: "code" },
  {
    title: "Trạng thái",
    key: "enable",
    render: (row) =>
      h(
        NSwitch,
        {
          size: "small",
          rubberBand: false,
          value: row.enable,
          loading: !!row.enableLoading,
          disabled: row.code === "SUPER_ADMIN",
          onUpdateValue: () => handleEnable(row),
        },
        {
          checked: () => "Kích hoạt",
          unchecked: () => "Tắt",
        }
      ),
  },
  {
    title: "Thao tác",
    key: "actions",
    width: 320,
    align: "right",
    fixed: "right",
    render(row) {
      return [
        h(
          NButton,
          {
            size: "small",
            type: "primary",
            secondary: true,
            onClick: () =>
              router.push({
                path: `/pms/role/user/${row.id}`,
                query: { roleName: row.name },
              }),
          },
          {
            default: () => "Phân quyền người dùng",
            icon: () => h("i", { class: "i-fe:user-plus text-14" }),
          }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "primary",
            style: "margin-left: 12px;",
            disabled: row.code === "SUPER_ADMIN",
            onClick: () => handleEdit(row),
          },
          {
            default: () => "Sửa",
            icon: () =>
              h("i", { class: "i-material-symbols:edit-outline text-14" }),
          }
        ),

        h(
          NButton,
          {
            size: "small",
            type: "error",
            style: "margin-left: 12px;",
            disabled: row.code === "SUPER_ADMIN",
            onClick: () => handleDelete(row.id),
          },
          {
            default: () => "Xóa",
            icon: () =>
              h("i", { class: "i-material-symbols:delete-outline text-14" }),
          }
        ),
      ];
    },
  },
];

async function handleEnable(row) {
  row.enableLoading = true;
  try {
    await api.update({ id: row.id, enable: !row.enable });
    row.enableLoading = false;
    $message.success("Thao tác thành công");
    $table.value?.handleSearch();
  } catch (error) {
    console.error(error);
    row.enableLoading = false;
  }
}

const permissionTree = ref([]);
api
  .getAllPermissionTree()
  .then(({ data = [] }) => (permissionTree.value = data));
</script>
