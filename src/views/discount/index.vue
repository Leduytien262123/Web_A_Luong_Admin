<template>
  <CommonPage>
    <template #action>
      <AddReload
        :reset="resetListDiscounts"
        :handleAdd="handleAddDiscount"
        :titleAdd="'Thêm mã giảm giá'"
      />
    </template>

    <n-card title="Quản lý mã giảm giá">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Tìm kiếm mã giảm giá" class="w-[40%]">
            <NaiveInput
              class="w-full"
              clearable
              placeholder="Nhập tìm kiếm ..."
              v-model:value="searchQuery.search"
              @keyup.enter="throttledLoaddiscounts"
              @clear="onInputClear"
            />
          </n-form-item>
          <n-form-item label="Loại giảm giá" class="w-[30%]">
            <NaiveSelect
              class="w-full"
              v-model:value="searchQuery.type"
              @update:value="searchByQueryValue"
              :options="type_discount"
              filterable
              placeholder="Tất cả loại giảm giá"
              clearable
            />
          </n-form-item>
          <n-form-item label="Trạng thái" class="w-[30%]">
            <NaiveSelect
              class="w-full"
              v-model:value="searchQuery.status"
              @update:value="searchByQueryValue"
              :options="status_discount"
              filterable
              placeholder="Tất cả trạng thái"
              clearable
            />
          </n-form-item>
          <n-button type="primary" @click="searchData">Tìm kiếm</n-button>
        </div>

        <n-data-table
          :columns="columns"
          :data="discounts"
          :bordered="true"
          :striped="true"
          :loading="loading"
          :scroll-x="1200"
        />
        <Pagination
          :total="total"
          :page="1"
          :limit="10"
          :name="'mã giảm giá'"
          :pageSize="10"
          @change="loadDiscounts"
        />
      </n-space>
    </n-card>

    <ModalDetail
      ref="detailModalRef"
      v-model:show="showDetailModal"
      :data="dataDetail"
      :title="titleDetail"
    />

    <ModalUpdateDiscount
      :title="getModalTitle()"
      :showModal="updateStatusData.show"
      :loading="updateStatusData.loading"
      @on-cancel="updateStatusData.show = false"
      @on-confirm="confirmUpdateStatus"
      :isStatusDiscount="true"
    />
  </CommonPage>
</template>

<script setup>
import { NButton, NTag } from "naive-ui";
import { DISCOUNT_STATUS } from "@/constants";
import { renderButtonWithTooltip } from "@/utils/common";
import IconPencil from "@/components/icon/Pencil.vue";
import IconBin from "@/components/icon/Bin.vue";
import IconStart from "@/components/icon/Start.vue";
import IconPause from "@/components/icon/Pause.vue";

defineOptions({ name: "DiscountManagement" });

const router = useRouter();
const discounts = ref([]);
const loading = ref(false);
const pending = ref(false);
const total = ref(0);

const searchQuery = ref({
  search: null,
  type: null,
  status: null,
});
const dataDetail = ref(null);
const showDetailModal = ref(false);
const titleDetail = ref("Chi tiết mã giảm giá");
const detailModalRef = ref(null);

const type_discount = ref([
  { label: "Giảm theo phần trăm", value: "percentage" },
  { label: "Giảm theo số tiền", value: "fixed" },
]);

const status_discount = ref([
  { label: "Sắp diễn ra", value: DISCOUNT_STATUS.UPCOMING },
  { label: "Đang diễn ra", value: DISCOUNT_STATUS.ACTIVE },
  { label: "Dừng chạy", value: DISCOUNT_STATUS.STOPPED },
  { label: "Đã kết thúc", value: DISCOUNT_STATUS.ENDED },
]);

const columns = [
  {
    title: "Chương trình khuyến mại",
    key: "name",
    fixed: "left",
    width: 220,
    ellipsis: true,
  },
  {
    title: "Mã giảm giá",
    key: "discount_code",
    width: 150,
    ellipsis: true,
  },
  {
    title: "Loại giảm giá",
    key: "type",
    width: 180,
    ellipsis: true,
    render(row) {
      return row.type === "percentage"
        ? "Giảm theo phần trăm"
        : "Giảm theo số tiền";
    },
  },
  {
    title: "Thời gian diễn ra",
    key: "created_at",
    width: 190,
    render(row) {
      return (
        dayjs(row.start_at).format("DD/MM/YYYY HH:mm:ss") +
        " - " +
        dayjs(row.end_at).format("DD/MM/YYYY HH:mm:ss")
      );
    },
  },
  {
    title: "Giá trị",
    key: "value_voucher",
    width: 120,
    ellipsis: true,
    render(row) {
      return row.type === "percentage"
        ? row.value_voucher + "%"
        : row.value_voucher.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          });
    },
  },
  {
    title: "Trạng thái",
    key: "status",
    width: 140,
    render(row) {
      return h(
        NTag,
        {
          type:
            row?.status === "active"
              ? "success"
              : row?.status === "ended"
                ? "error"
                : row?.status === "upcoming"
                  ? "info"
                  : row?.status === "stopped"
                    ? "warning"
                    : "",
          size: "small",
        },
        {
          default: () =>
            row?.status === "upcoming"
              ? "Sắp diễn ra"
              : row?.status === "active"
                ? "Đang diễn ra"
                : row?.status === "stopped"
                  ? "Dừng chạy"
                  : row?.status === "ended"
                    ? "Đã kết thúc"
                    : "",
        }
      );
    },
  },
  {
    title: "Hành động",
    key: "actions",
    width: 125,
    render(row) {
      return h(
        "div",
        { class: "flex items-center gap-4" },
        [
          renderButtonWithTooltip({
            onClick: () => editDiscount(row.id),
            content: h(IconPencil),
            tooltipContent: "Chỉnh sửa",
            disabled: row.status === DISCOUNT_STATUS.FINISHED,
          }),
          row.status === DISCOUNT_STATUS.STOPPED &&
            renderButtonWithTooltip({
              onClick: () => {
                updateStatusData.id = row.id;
                confirmUpdateStatus(false);
              },
              content: h(IconStart),
              tooltipContent: "Tiếp tục",
            }),
          (row.status === DISCOUNT_STATUS.ACTIVE ||
            row.status === DISCOUNT_STATUS.IN_PROGRESS) &&
            renderButtonWithTooltip({
              onClick: () => {
                updateStatusData.id = row.id;
                updateStatusData.show = true;
              },
              content: h(IconPause),
              tooltipContent: "Dừng chạy",
            }),
          renderButtonWithTooltip({
            onClick: () => {
              deleteDiscount(row.id);
            },
            content: h(IconBin),
            tooltipContent: "Xoá",
            disabled: row.status !== DISCOUNT_STATUS.COMING,
          }),
        ].filter(Boolean)
      );
    },
  },
];

const updateStatusData = reactive({
  id: null,
  show: false,
  loading: false,
});

const confirmUpdateStatus = async (fromModal = true) => {
  if (updateStatusData.loading) return;

  if (!updateStatusData.id) return;

  // Tìm voucher hiện tại để kiểm tra trạng thái
  const currentDiscount = discounts.value.find(
    (d) => d.id === updateStatusData.id
  );
  if (!currentDiscount) return;

  if (!fromModal) pending.value = true;

  updateStatusData.loading = true;

  let data = null;
  let successMessage = "";

  try {
    // Kiểm tra trạng thái hiện tại và gọi API tương ứng
    if (
      currentDiscount.status === DISCOUNT_STATUS.ACTIVE ||
      currentDiscount.status === DISCOUNT_STATUS.IN_PROGRESS
    ) {
      // Nếu đang chạy -> dừng lại
      data = await api.pauseDiscount(updateStatusData.id);
      successMessage = "Đã dừng chạy mã giảm giá thành công";
    } else if (currentDiscount.status === DISCOUNT_STATUS.STOPPED) {
      // Nếu đang dừng -> tiếp tục chạy
      data = await api.resumeDiscount(updateStatusData.id);
      successMessage = "Đã tiếp tục chạy mã giảm giá thành công";
    }

    updateStatusData.loading = false;

    if (!fromModal) pending.value = false;

    console;
    if (!data?.data?.success) {
      message.error("Không thể cập nhật trạng thái mã giảm giá");
      return;
    }

    updateStatusData.show = false;
    updateStatusData.id = null;
    $message.success(successMessage);
    await loadDiscounts();
  } catch (error) {
    updateStatusData.loading = false;
    if (!fromModal) pending.value = false;
  }

  // if (discounts.value.length === 0 && params.page > 1) {
  //   params.page -= 1;
  // }
};

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

async function loadDiscounts() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    if (searchQuery.value?.search) {
      params.search = searchQuery.value?.search;
    }
    if (searchQuery.value?.type) {
      params.type = searchQuery.value?.type;
    }
    if (searchQuery.value?.status) {
      params.status = searchQuery.value?.status;
    }
    const response = await api.getDiscounts(params);
    if (response.data.success) {
      discounts.value = response.data?.data?.discounts || [];
      total.value = response.data?.data?.pagination?.total || 0;
      loading.value = false;
    }
  } catch (error) {
    $message.error("Không thể tải danh sách mã giảm giá");
  } finally {
    loading.value = false;
  }
}

// Tạo hàm throttle cho loadDiscounts
const throttledLoaddiscounts = throttle(loadDiscounts, 500);

// Xem chi tiết mã giảm giá
async function viewDiscount(id) {
  showDetailModal.value = true;
  await nextTick();
  detailModalRef.value?.focus && detailModalRef.value.focus();
  try {
    const response = await api.getDiscountById(id);
    dataDetail.value = response.data?.data || null;
  } catch (error) {
    $message.error("Không thể tải chi tiết mã giảm giá");
  }
}

// Xóa mã giảm giá
function deleteDiscount(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: "Bạn có chắc chắn muốn xóa mã giảm giá này?",
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteDiscount(id);
        $message.success("Đã xóa mã giảm giá thành công");
        loadDiscounts();
      } catch (error) {
        console.error("Lỗi khi xóa mã giảm giá:", error);
        $message.error("Không thể xóa mã giảm giá");
      }
    },
  });
}

function resetListDiscounts() {
  searchQuery.value.search = null;
  searchQuery.value.category_id = null;
  throttledLoaddiscounts();
}

function searchByQueryValue() {
  if (!searchQuery.value?.search) {
    throttledLoaddiscounts();
  }
}

function searchData() {
  throttledLoaddiscounts();
}

function handleAddDiscount() {
  router.push("/discount/add");
}

// Sửa mã giảm giá
function editDiscount(id) {
  router.push(`/discount/edit/${id}`);
}

function onInputClear() {
  searchQuery.value.search = "";
  throttledLoaddiscounts();
}

// Function để lấy title modal phù hợp
function getModalTitle() {
  if (!updateStatusData.id) return "Xác nhận thay đổi trạng thái";

  const currentDiscount = discounts.value.find(
    (d) => d.id === updateStatusData.id
  );
  if (!currentDiscount) return "Xác nhận thay đổi trạng thái";

  if (
    currentDiscount.status === DISCOUNT_STATUS.ACTIVE ||
    currentDiscount.status === DISCOUNT_STATUS.IN_PROGRESS
  ) {
    return "Xác nhận dừng chạy mã giảm giá?";
  } else if (currentDiscount.status === DISCOUNT_STATUS.STOPPED) {
    return "Xác nhận tiếp tục chạy mã giảm giá?";
  }

  return "Xác nhận thay đổi trạng thái";
}

onMounted(() => {
  loadDiscounts();
});
</script>

<style scoped>
:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>
