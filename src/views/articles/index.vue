<template>
  <CommonPage>
    <template #action>
      <AddReload
        :reset="resetListArticles"
        :handle-add="handleAddArticle"
        :title-add="'Tạo bài viết'"
      />
    </template>

    <n-card title="Quản lý bài viết">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item
            label="Tìm kiếm bài viết"
            class="w-full"
          >
            <NaiveInput
              v-model:value="searchQuery.search"
              clearable
              placeholder="Nhập tìm kiếm ..."
              @keyup.enter="throttledLoadArticles"
            />
          </n-form-item>
          <n-form-item
            label="Danh mục bài viết"
            class="w-full"
          >
            <TreeSelectCategories
              v-model:value="searchQuery.category"
              clearable
              placeholder="Chọn danh mục bài viết"
            />
          </n-form-item>
          <n-form-item
            label="Tag"
            class="w-full"
          >
            <NaiveSelect
              v-model:value="searchQuery.tag"
              clearable
              placeholder="Chọn tag"
              :options="tagOptions"
              @keyup.enter="throttledLoadArticles"
            />
          </n-form-item>
          <n-button
            type="primary"
            @click="searchData"
          >
            Tìm kiếm
          </n-button>
        </div>

        <n-data-table
          :columns="columns"
          :data="articles"
          :bordered="true"
          :striped="true"
          :loading="loading"
        />

        <Pagination
          :total="total"
          :page="1"
          :limit="10"
          :name="'bài viết'"
          :page-size="10"
          @change="loadArticles"
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

defineOptions({ name: "ArticlesManagement" });

const router = useRouter();
const articles = ref([]);
const loading = ref(false);
const searchQuery = ref({
  search: "",
  category: null,
  tag: null,
});
const dataDetail = ref(null);
const showDetailModal = ref(false);
const titleDetail = ref("Chi tiết bài viết");
const detailModalRef = ref(null);
const tagOptions = ref([]);
const total = ref(0);

const columns = [
  {
    title: "STT",
    key: "index",
    width: 60,
    render(row, index) {
      return index + 1;
    },
  },
  {
    title: "Tên",
    key: "title",
    ellipsis: true,
  },
  {
    title: "Đường dẫn",
    key: "slug",
    ellipsis: true,
  },
  {
    title: "Trạng thái",
    key: "status",
    render(row) {
      return h(
        NTag,
        { type: row.status === "post" ? "success" : "", size: "small" },
        { default: () => (row.status === "post" ? "Bài đăng" : "Bài nháp") }
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
            onClick: () => editArticle(row.id),
            content: h(IconPencil),
            tooltipContent: "Chỉnh sửa",
          }),
          renderButtonWithTooltip({
            onClick: () => {
              deleteArticle(row.id);
            },
            content: h(IconBin),
            tooltipContent: "Xóa",
          }),
        ].filter(Boolean)
      );
    },
  },
];

async function loadTags() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 100,
    };
    const response = await api.getTags(params);
    tagOptions.value =
      response.data?.data?.tags?.map((e) => ({
        label: e.name,
        value: e.id,
      })) || [];
  } catch (error) {
    $message.error("Không thể tải danh mục bài viết");
  } finally {
    loading.value = false;
  }
}

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

// Tải danh sách bài viết
async function loadArticles() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    if (searchQuery.value.search) {
      params.search = searchQuery.value.search;
    }
    if (searchQuery.value.category) {
      params.category_id = searchQuery.value.category;
    }
    if (searchQuery.value.tag) {
      params.tag_id = searchQuery.value.tag;
    }
    const response = await api.getArticles(params);
    articles.value = response.data?.data?.articles || [];
    total.value = response.data?.data?.total || 0;
  } catch (error) {
    $message.error("Không thể tải danh sách bài viết");
  } finally {
    loading.value = false;
  }
}

// Tạo hàm throttle cho loadArticles
const throttledLoadArticles = throttle(loadArticles, 500);

// Xem chi tiết bài viết
async function viewArticle(id) {
  showDetailModal.value = true;
  await nextTick();
  detailModalRef.value?.focus && detailModalRef.value.focus();
  try {
    const response = await api.getArticleById(id);
    dataDetail.value = response.data?.data || null;
  } catch (error) {
    $message.error("Không thể tải chi tiết bài viết");
  }
}

// Sửa bài viết
function editArticle(id) {
  router.push(`/articles/edit/${id}`);
}

// Xóa bài viết
function deleteArticle(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: "Bạn có chắc chắn muốn xóa bài viết này?",
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteArticle(id);
        $message.success("Đã xóa bài viết thành công");
        loadArticles();
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
        $message.error("Không thể xóa bài viết");
      }
    },
  });
}

// Thêm bài viết mới
function handleAddArticle() {
  router.push("/articles/add");
}

function resetListArticles() {
  searchQuery.value = {
    search: "",
    category: "",
    tag: "",
  };
  throttledLoadArticles();
}

function searchData() {
  throttledLoadArticles();
}

// Tải danh sách khi component được mount
onMounted(() => {
  loadArticles();
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
