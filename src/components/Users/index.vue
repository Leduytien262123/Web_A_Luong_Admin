<template>
  <CommonPage>
    <template #action>
      <AddReload
        :reset="resetListUsers"
        :handle-add="handleAddUser"
        :title-add="`Thêm ${context}`"
      />
    </template>

    <n-card :title="`Danh sách ${context}`">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item :label="`Tìm kiếm ${context}`" class="w-full">
            <NaiveInput
              v-model:value="searchQuery.name"
              class="w-full"
              clearable
              placeholder="Nhập tìm kiếm theo tên, số điện thoại, email ..."
              @keyup.enter="throttledLoadUsers"
              @clear="
                () => {
                  searchQuery.name = '';
                  throttledLoadUsers();
                }
              "
            />
          </n-form-item>
          <ButtonSearch :search-data />
        </div>

        <n-spin :show="loading">
          <n-data-table
            :columns="columns"
            :data="users"
            :bordered="true"
            :striped="true"
            :loading="loading"
          />
        </n-spin>
      </n-space>
    </n-card>

    <ModalDetail
      ref="detailModalRef"
      v-model:show="showDetailModal"
      :data="dataDetail"
      :title="titleDetail"
    />
  </CommonPage>
</template>

<script setup>
import { NTag, NAvatar } from "naive-ui";
import { renderButtonWithTooltip } from "@/utils/common";
import IconPencil from "@/components/icon/Pencil.vue";
import IconBin from "@/components/icon/Bin.vue";
import userEmpty from "@/public/img/user_empty.jpg";

defineOptions({ name: "ProductManagement" });

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const users = ref([]);
const loading = ref(false);
const searchQuery = ref({
  name: "",
  category_id: null,
});
const dataDetail = ref(null);
const showDetailModal = ref(false);
const context = computed(() => {
  return "người dùng";
});
const titleDetail = ref(`Chi tiết ${context.value}`);
const detailModalRef = ref(null);
const role = ref(null);

const columns = [
  {
    title: "STT",
    key: "stt",
    ellipsis: true,
    width: 60,
    fixed: "left",
    render(row, index) {
      return index + 1;
    },
  },
  {
    title: `Tên ${context.value}`,
    key: "full_name",
    fixed: "left",
    width: 300,
    ellipsis: true,
    render(row) {
      return h("div", { class: "flex items-center gap-12" }, [
        h(NAvatar, {
          size: "medium",
          src: row?.avatar?.[0]?.url || userEmpty,
          class: "rounded-full min-w-40px max-w-40px min-h-40px max-h-40px",
        }),
        h("div", { class: "flex flex-col text-[14px]" }, [
          h("span", { class: "font-semibold" }, row?.full_name || ""),
          h("span", { class: "text-gray-500" }, row?.phone || ""),
          h("span", { class: "text-gray-500" }, row?.email || ""),
        ]),
      ]);
    },
  },
  {
    title: "Trạng thái",
    key: "is_active",
    render(row) {
      return h(
        NTag,
        { type: row.is_active ? "success" : "", size: "small" },
        { default: () => (row.is_active ? "Hoạt động" : "Dừng hoạt động") },
      );
    },
  },
  {
    title: "Ngày tạo",
    key: "created_at",
    render(row) {
      return dayjs(row.created_at).format("DD/MM/YYYY");
    },
  },
  {
    title: "Hành động",
    key: "actions",
    width: 100,
    render(row) {
      return h(
        "div",
        { class: "flex items-center gap-4" },
        [
          renderButtonWithTooltip({
            onClick: () => editUser(row.id),
            content: h(IconPencil),
            tooltipContent: "Chỉnh sửa",
          }),
          renderButtonWithTooltip({
            onClick: () => {
              deleteUser(row.id);
            },
            content: h(IconBin),
            tooltipContent: "Xóa",
          }),
        ].filter(Boolean),
      );
    },
  },
];

function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

async function loadUsers() {
  if (userStore.role === "owner" && route.path.includes("staff")) {
    role.value = "owner,admin,member";
  } else if (
    (userStore.role === "admin" && route.path.includes("staff")) ||
    (userStore.role === "member" && route.path.includes("staff"))
  ) {
    role.value = "admin,member";
  } else if (route.path.includes("user")) {
    role.value = "user";
  }

  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
      // role: role.value,
    };
    if (searchQuery.value?.name) {
      params.name = searchQuery.value?.name;
    }
    const response = await api.getUsers(params);
    if (response.data.success) {
      users.value = response.data?.data?.users || [];
      loading.value = false;
    }
  } catch (error) {
    $message.error(`Không thể tải danh sách ${context.value}`);
  } finally {
    loading.value = false;
  }
}

// Tạo hàm throttle cho loadUsers
const throttledLoadUsers = throttle(loadUsers, 500);

// Xóa
function deleteUser(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: `Bạn có chắc chắn muốn xóa ${context.value} này?`,
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteUser(id);
        $message.success(`Đã xóa ${context.value} thành công`);
        loadUsers();
      } catch (error) {
        console.error(`Lỗi khi xóa ${context.value}:`, error);
        $message.error(`Không thể xóa ${context.value}`);
      }
    },
  });
}

function resetListUsers() {
  searchQuery.value.name = "";
  searchQuery.value.category_id = null;
  throttledLoadUsers();
}

function searchData() {
  throttledLoadUsers();
}

function handleAddUser() {
  if (route.path.includes("staff")) {
    return router.push("/staff/add");
  } else {
    router.push("/user/add");
  }
}

// Sửa
function editUser(id) {
  if (route.path.includes("staff")) {
    return router.push(`/staff/edit/${id}`);
  } else {
    router.push(`/user/edit/${id}`);
  }
}

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>
