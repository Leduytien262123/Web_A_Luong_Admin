<template>
  <CommonPage>
    <template #action>
      <AddReload
        :reset="resetListCategories"
        :handleAdd="handleAddCategory"
        :titleAdd="'Thêm danh mục'"
      />
    </template>

    <n-card title="Quản lý danh mục">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Tìm kiếm danh mục" class="w-full">
            <NaiveInput
              clearable
              placeholder="Nhập tìm kiếm ..."
              v-model:value="searchQuery"
              @keyup.enter="searchData"
              @clear="
                () => {
                  searchQuery = '';
                  searchData();
                }
              "
            />
          </n-form-item>
          <ButtonSearch ref="buttonSearchRef" :searchData="loadCategories" />
        </div>

        <n-data-table
          :columns="columns"
          :data="categories"
          :bordered="true"
          :striped="true"
          :loading="loading"
          :scroll-x="1500"
          :row-key="rowKey"
        />

        <Pagination
          :total="total"
          :page="1"
          :limit="10"
          :name="'danh mục'"
          :pageSize="10"
          @change="loadCategories"
        />
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
import { NTag, NCheckbox } from "naive-ui";
import { renderButtonWithTooltip } from "@/utils/common";
import IconPencil from "@/components/icon/Pencil.vue";
import IconBin from "@/components/icon/Bin.vue";

defineOptions({ name: "CategoryManagement" });

const router = useRouter();
const categories = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const dataDetail = ref(null);
const showDetailModal = ref(false);
const titleDetail = ref("Chi tiết danh mục");
const detailModalRef = ref(null);
const buttonSearchRef = ref(null);
const total = ref(0);

const columns = [
  {
    title: "Tên",
    key: "name",
    ellipsis: true,
    width: 250,
    tree: true,
  },
  {
    title: "Đường dẫn",
    key: "slug",
    ellipsis: true,
    width: 250,
  },
  {
    title: "Trạng thái",
    key: "is_active",
    render(row) {
      return h(
        NTag,
        { type: row.is_active ? "success" : "", size: "small" },
        { default: () => (row.is_active ? "Hoạt động" : "Dừng hoạt động") }
      );
    },
  },
  {
    title: "Hiển thị ở menu",
    key: "show_menu",
    align: "center",
    render(row) {
      return h(NCheckbox, { checked: row.show_menu });
    },
  },
  {
    title: "Hiển thị ở footer",
    key: "show_footer",
    align: "center",
    render(row) {
      return h(NCheckbox, { checked: row.show_footer });
    },
  },
  {
    title: "Thứ tự ở Menu",
    key: "position",
    align: "center",
    width: 150,
    render(row) {
      return row.position_menu;
    },
  },
  {
    title: "Thứ tự ở Footer",
    key: "position",
    align: "center",
    width: 150,
    render(row) {
      return row.position_footer;
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
            onClick: () => editCategory(row.id),
            content: h(IconPencil),
            tooltipContent: "Chỉnh sửa",
          }),
          renderButtonWithTooltip({
            onClick: () => {
              deleteCategory(row.id);
            },
            content: h(IconBin),
            tooltipContent: "Xoá",
          }),
        ].filter(Boolean)
      );
    },
  },
];

// Tải danh sách danh mục
async function loadCategories() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    const response = await api.getCategories(params);
    categories.value = response.data?.data?.categories || [];
    total.value = response.data?.data?.pagination?.total || 0;
  } catch (error) {
    $message.error("Không thể tải danh sách danh mục");
  } finally {
    loading.value = false;
  }
}

// Xem chi tiết danh mục
async function viewCategory(id) {
  showDetailModal.value = true;
  await nextTick();
  detailModalRef.value?.focus && detailModalRef.value.focus();
  try {
    const response = await api.getCategoryById(id);
    dataDetail.value = response.data?.data || null;
  } catch (error) {
    $message.error("Không thể tải chi tiết danh mục");
  }
}

// Sửa danh mục
function editCategory(id) {
  router.push(`/category/edit/${id}`);
}

// Xóa danh mục
function deleteCategory(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: "Bạn có chắc chắn muốn xóa danh mục này?",
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteCategory(id);
        $message.success("Đã xóa danh mục thành công");
        loadCategories();
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        $message.error("Không thể xóa danh mục");
      }
    },
  });
}

// Thêm danh mục mới
function handleAddCategory() {
  router.push("/category/add");
}

function resetListCategories() {
  searchQuery.value = "";
  buttonSearchRef.value?.search?.();
}

function searchData() {
  buttonSearchRef.value?.search?.();
}

function rowKey(row) {
  return row.id;
}

// Tải danh sách khi component được mount
onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>
