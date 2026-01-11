<template>
  <CommonPage>
    <template #action>
      <AddReload
        :reset="resetListProducts"
        :handleAdd="handleAddProduct"
        :titleAdd="'Thêm sản phẩm'"
      />
    </template>

    <n-card title="Quản lý sản phẩm">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Tìm kiếm sản phẩm" class="w-[60%]">
            <NaiveInput
              class="w-full"
              clearable
              placeholder="Nhập tìm kiếm ..."
              v-model:value="searchQuery.search"
              @keyup.enter="searchData"
            />
          </n-form-item>
          <n-form-item label="Tìm kiếm danh mục" class="w-[40%]">
            <NaiveSelect
              class="w-full"
              v-model:value="searchQuery.category_id"
              @update:value="searchByCategoryId"
              :options="categories"
              filterable
              placeholder="Tất cả danh mục"
              clearable
            />
          </n-form-item>
          <ButtonSearch ref="buttonSearchRef" :searchData="loadProducts" />
        </div>

        <n-data-table
          :columns="columns"
          :data="products"
          :bordered="true"
          :striped="true"
          :loading="loading"
        />
        <Pagination
          :total="total"
          :page="1"
          :limit="10"
          :name="'sản phẩm'"
          :pageSize="10"
          @change="loadProducts"
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

defineOptions({ name: "ProductManagement" });

const router = useRouter();
const products = ref([]);
const loading = ref(false);
const searchQuery = ref({
  search: "",
  category_id: null,
});
const dataDetail = ref(null);
const showDetailModal = ref(false);
const titleDetail = ref("Chi tiết sản phẩm");
const detailModalRef = ref(null);
const categories = ref([]);
const total = ref(0);
const buttonSearchRef = ref(null);

const columns = [
  {
    title: "STT",
    key: "stt",
    ellipsis: true,
    width: 70,
    fixed: "left",
    render(row, index) {
      return index + 1;
    },
  },
  {
    title: "Tên",
    key: "name",
    fixed: "left",
    ellipsis: true,
  },
  {
    title: "Danh mục",
    key: "category_id",
    ellipsis: true,
    render(row) {
      const category = categories.value.find(
        (cat) => cat.value === row.category_id
      );
      return category ? category.label : "";
    },
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
            onClick: () => editProduct(row.id),
            content: h(IconPencil),
            tooltipContent: "Chỉnh sửa",
          }),
          renderButtonWithTooltip({
            onClick: () => {
              deleteProduct(row.id);
            },
            content: h(IconBin),
            tooltipContent: "Xoá",
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

async function loadProducts() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    if (searchQuery.value?.search) {
      params.search = searchQuery.value?.search;
    }
    if (searchQuery.value?.category_id) {
      params.category_id = searchQuery.value?.category_id;
    }
    const response = await api.getProducts(params);
    if (response.data.success) {
      products.value = response.data?.data?.products || [];
      total.value = response.data?.data?.total || 0;
    }
  } catch (error) {
    $message.error("Không thể tải danh sách sản phẩm");
  } finally {
    loading.value = false;
  }
}

async function loadCategories() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 100,
    };
    const response = await api.getCategories(params);
    categories.value =
      response.data?.data?.categories?.map((e) => ({
        label: e.name,
        value: e.id,
      })) || [];
  } catch (error) {
    $message.error("Không thể tải danh sách danh mục");
  } finally {
    loading.value = false;
  }
}

// Xem chi tiết sản phẩm
async function viewProduct(id) {
  showDetailModal.value = true;
  await nextTick();
  detailModalRef.value?.focus && detailModalRef.value.focus();
  try {
    const response = await api.getProductById(id);
    dataDetail.value = response.data?.data || null;
  } catch (error) {
    $message.error("Không thể tải chi tiết sản phẩm");
  }
}

// Xóa sản phẩm
function deleteProduct(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: "Bạn có chắc chắn muốn xóa sản phẩm này?",
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteProduct(id);
        $message.success("Đã xóa sản phẩm thành công");
        loadProducts();
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        $message.error("Không thể xóa sản phẩm");
      }
    },
  });
}

function resetListProducts() {
  searchQuery.value.search = "";
  searchQuery.value.category_id = null;
  buttonSearchRef.value?.search?.();
}

function searchByCategoryId() {
  if (!searchQuery.value?.search) {
    buttonSearchRef.value?.search?.();
  }
}

function searchData() {
  buttonSearchRef.value?.search?.();
}

function handleAddProduct() {
  router.push("/product/add");
}

// Sửa sản phẩm
function editProduct(id) {
  router.push(`/product/edit/${id}`);
}

onMounted(() => {
  loadProducts();
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
