<template>
  <CommonPage>
    <template #action>
      <AddReload
        :reset="resetListTags"
        :handleAdd="handleAddTag"
        :titleAdd="'Tạo thẻ Tag'"
      />
    </template>

    <n-card title="Quản lý thẻ Tag">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Tìm kiếm thẻ Tag" class="w-full">
            <NaiveInput
              clearable
              placeholder="Nhập tìm kiếm ..."
              v-model:value="searchQuery"
              @keyup.enter="throttledLoadTags"
            />
          </n-form-item>
          <n-button type="primary" @click="searchData">Tìm kiếm</n-button>
        </div>

        <n-data-table
          :columns="columns"
          :data="tags"
          :bordered="true"
          :striped="true"
          :loading="loading"
        />

        <Pagination
          :total="total"
          :page="1"
          :limit="10"
          :name="'thẻ tag'"
          :pageSize="10"
          @change="loadTags"
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
import { NTag } from "naive-ui";
import { renderButtonWithTooltip } from "@/utils/common";
import IconPencil from "@/components/icon/Pencil.vue";
import IconBin from "@/components/icon/Bin.vue";

defineOptions({ name: "TagManagement" });

const router = useRouter();
const tags = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const dataDetail = ref(null);
const showDetailModal = ref(false);
const titleDetail = ref("Chi tiết thẻ Tag");
const detailModalRef = ref(null);
const total = ref(0);

const columns = [
  {
    title: "Tên thẻ",
    key: "name",
    ellipsis: true,
  },
  {
    title: "Đường dẫn",
    key: "slug",
    ellipsis: true,
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
            onClick: () => editTag(row.id),
            content: h(IconPencil),
            tooltipContent: "Chỉnh sửa",
          }),
          renderButtonWithTooltip({
            onClick: () => {
              deleteTag(row.id);
            },
            content: h(IconBin),
            tooltipContent: "Xóa",
          }),
        ].filter(Boolean)
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

// Tải danh sách thẻ Tag
async function loadTags() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    const response = await api.getTags(params);
    tags.value = response.data?.data?.tags || [];
    total.value = response.data?.data?.pagination?.total || 0;
  } catch (error) {
    $message.error("Không thể tải danh sách thẻ Tag");
  } finally {
    loading.value = false;
  }
}

// Tạo hàm throttle cho loadTags
const throttledLoadTags = throttle(loadTags, 500);

// Xem chi tiết thẻ Tag
async function viewTag(id) {
  showDetailModal.value = true;
  await nextTick();
  detailModalRef.value?.focus && detailModalRef.value.focus();
  try {
    const response = await api.getTagById(id);
    dataDetail.value = response.data?.data || null;
  } catch (error) {
    $message.error("Không thể tải chi tiết thẻ Tag");
  }
}

// Sửa thẻ Tag
function editTag(id) {
  router.push(`/tag/edit/${id}`);
}

// Xóa thẻ Tag
function deleteTag(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: "Bạn có chắc chắn muốn xóa thẻ Tag này?",
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteTag(id);
        $message.success("Đã xóa thẻ Tag thành công");
        loadTags();
      } catch (error) {
        console.error("Lỗi khi xóa thẻ Tag:", error);
        $message.error("Không thể xóa thẻ Tag");
      }
    },
  });
}

// Thêm thẻ Tag mới
function handleAddTag() {
  router.push("/tag/add");
}

function resetListTags() {
  searchQuery.value = "";
  throttledLoadTags();
}

function searchData() {
  throttledLoadTags();
}

// Tải danh sách khi component được mount
onMounted(() => {
  loadTags();
});
</script>

<style scoped>
:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>
