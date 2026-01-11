<template>
  <CommonPage>
    <template #action>
      <div class="flex justìy-end gap-12">
        <NButton type="info" @click="resetListOrders">
          <i class="i-material-symbols:refresh mr-4 text-18" />
          Tải lại danh sách
        </NButton>
        <NButton type="primary" @click="handleAddOrder">
          <i class="i-material-symbols:add mr-4 text-18" />
          Thêm đơn hàng
        </NButton>
      </div>
    </template>

    <n-card title="Quản lý đơn hàng">
      <n-space vertical>
        <div class="flex mb-8">
          <n-grid cols="3" x-gap="12" y-gap="12">
            <n-grid-item span="1">
              <n-form-item label="Mã đơn hàng">
                <NaiveInput
                  clearable
                  placeholder="Mã đơn hàng ..."
                  v-model:value="searchQuery.order_code"
                  @keyup.enter="searchData"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="1">
              <n-form-item label="Khách hàng">
                <NaiveInput
                  clearable
                  placeholder="Tên khách hàng or Số điện thoại ..."
                  v-model:value="searchQuery.customer"
                  @keyup.enter="searchData"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="1">
              <n-form-item label="Loại đơn hàng">
                <NaiveSelect
                  v-model:value="searchQuery.type_order"
                  @update:value="searchByQuery"
                  :options="typeOrders"
                  filterable
                  placeholder="Tất cả loại đơn"
                  clearable
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="1">
              <n-form-item label="Trạng thái xử lý">
                <NaiveSelect
                  v-model:value="searchQuery.status"
                  @update:value="searchByQuery"
                  filterable
                  placeholder="Tất cả trạng thái"
                  clearable
                  :options="optionsStatus"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="1">
              <n-form-item label="Trạng thái thanh toán">
                <NaiveSelect
                  v-model:value="searchQuery.payment_status"
                  @update:value="searchByQuery"
                  filterable
                  placeholder="Tất cả thanh toán"
                  clearable
                  :options="optionsPayment"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="1">
              <n-form-item label="Người tạo đơn">
                <NaiveSelect
                  v-model:value="searchQuery.creator"
                  @update:value="searchByQuery"
                  filterable
                  placeholder="Tất cả người tạo"
                  clearable
                  :options="creater"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="1">
              <n-form-item label="Ngày tạo">
                <NaiveDatePicker
                  v-model:value="searchQuery.range"
                  @update:value="searchByQuery"
                  type="daterange"
                  clearable
                  class="w-full"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="3">
              <div class="flex gap-12 justify-end">
                <n-button type="success" @click="exportExcel"
                  >Xuất file</n-button
                >
                <ButtonSearch ref="buttonSearchRef" :searchData="loadOrders" />
              </div>
            </n-grid-item>
          </n-grid>
        </div>

        <div>
          <n-data-table
            :columns="columns"
            :data="orders"
            :bordered="true"
            :striped="true"
            :loading="loading"
            :scroll-x="1300"
          />
          <Pagination
            :total="total"
            :page="1"
            :limit="10"
            :name="'sản phẩm'"
            :pageSize="10"
            @change="loadOrders"
          />
        </div>
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
import { renderButtonWithTooltip } from "@/utils/common";
import IconPencil from "@/components/icon/Pencil.vue";
import IconBin from "@/components/icon/Bin.vue";
import { ref, onMounted, h, nextTick } from "vue";
import ModalDetail from "@/components/Modal/ModalDetail.vue";
import { useRouter } from "vue-router";
import { NButton, NTag } from "naive-ui";
import { api } from "@/utils";
import dayjs from "dayjs";

defineOptions({ name: "OrderManagement" });

const router = useRouter();
const orders = ref([]);
const loading = ref(false);
const searchQuery = ref({
  order_code: null, // Mã đơn hàng
  customer: null, // Khách hàng
  type_order: null, // Loại đơn hàng
  status: null, // Trạng thái xử lý
  payment_status: null, // Trạng thái thanh toán
  creator: null, // Người tạo đơn
  range: null, // Ngày tạo
});
const dataDetail = ref(null);
const showDetailModal = ref(false);
const titleDetail = ref("Chi tiết đơn hàng");
const detailModalRef = ref(null);
const total = ref(0);
const buttonSearchRef = ref(null);

const typeOrders = ref([
  { label: "Đơn web", value: "web" },
  { label: "Đơn khách lẻ", value: "retail" },
]);

const optionsStatus = ref([
  { label: "Chờ xử lý", value: "pending" },
  { label: "Đang xử lý", value: "processing" },
  { label: "Hoàn thành", value: "completed" },
  { label: "Đã hủy", value: "canceled" },
  { label: "Trả hàng", value: "refunded" },
]);

const optionsPayment = ref([
  { label: "Chưa thanh toán", value: "unpaid" },
  { label: "Đã thanh toán", value: "paid" },
  { label: "Hoàn tiền", value: "refunded" },
]);

const creater = ref([
  { label: "Admin", value: "admin" },
  { label: "Nhân viên 1", value: "staff1" },
  { label: "Nhân viên 2", value: "staff2" },
]);

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
    title: "Mã đơn hàng",
    key: "order_code",
    ellipsis: true,
    width: 220,
  },
  {
    title: "Khách hàng",
    key: "name",
    ellipsis: true,
    render(row) {
      return h("div", {}, [
        h("div", {}, row?.name || ""),
        h("div", { style: "color: #888; font-size: 12px;" }, row?.phone || ""),
      ]);
    },
  },
  {
    title: "Loại đơn hàng",
    key: "type_order",
    ellipsis: true,
    render(row) {
      return h(
        NTag,
        { type: "info" },
        {
          default: () =>
            row?.type_order === "web" ? "Đơn web" : "Đơn khách lẻ",
        }
      );
    },
  },
  {
    title: "Trạng thái",
    key: "status",
    ellipsis: true,
    render(row) {
      const opt = optionsStatus.value.find((o) => o.value === row.status);
      const label = opt ? opt.label : row.status || "";
      const type =
        (row.status === "completed" && "success") ||
        (row.status === "canceled" && "error") ||
        (row.status === "processing" && "info") ||
        (row.status === "pending" && "default") ||
        "default";
      return h(NTag, { type }, { default: () => label });
    },
  },
  {
    title: "Thanh toán",
    key: "payment_status",
    width: 150,
    ellipsis: true,
    render(row) {
      const opt = optionsPayment.value.find(
        (o) => o.value === row.payment_method
      );
      const label = opt ? opt.label : row.payment_method || "";
      const type =
        (row.payment_method === "paid" && "success") ||
        (row.payment_method === "refunded" && "error") ||
        (row.payment_method === "unpaid" && "default") ||
        "default";
      return h(NTag, { type }, { default: () => label });
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
    title: "Người tạo đơn",
    key: "creator_name",
    ellipsis: true,
  },
  {
    title: "Hành động",
    key: "actions",
    fixed: "right",
    width: 100,
    render(row) {
      return h(
        "div",
        { class: "flex items-center gap-4" },
        [
          renderButtonWithTooltip({
            onClick: () => editOrder(row.id),
            content: h(IconPencil),
            tooltipContent: "Chỉnh sửa",
          }),
          renderButtonWithTooltip({
            onClick: () => {
              deleteOrder(row.id);
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

async function loadOrders() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    if (searchQuery.value?.order_code) {
      params.order_code = searchQuery.value?.order_code;
    }
    if (searchQuery.value?.customer) {
      params.customer = searchQuery.value?.customer;
    }
    if (searchQuery.value?.type_order) {
      params.type_order = searchQuery.value?.type_order;
    }
    if (searchQuery.value?.status) {
      params.status = searchQuery.value?.status;
    }
    if (searchQuery.value?.payment_status) {
      params.payment_status = searchQuery.value?.payment_status;
    }
    if (searchQuery.value?.creator) {
      params.creator = searchQuery.value?.creator;
    }
    if (
      searchQuery.value?.range &&
      Array.isArray(searchQuery.value.range) &&
      searchQuery.value.range.length === 2
    ) {
      params.start_time = dayjs(searchQuery.value.range[0])
        .startOf("day")
        .toISOString();
      params.end_time = dayjs(searchQuery.value.range[1])
        .endOf("day")
        .toISOString();
    }
    const response = await api.getOrders(params);
    if (response.data.success) {
      orders.value = response.data?.data?.orders || [];
      total.value = response.data?.data?.total || 0;
    }
  } catch (error) {
    $message.error("Không thể tải danh sách đơn hàng");
  } finally {
    loading.value = false;
  }
}

// Xem chi tiết đơn hàng
async function viewOrder(id) {
  showDetailModal.value = true;
  await nextTick();
  detailModalRef.value?.focus && detailModalRef.value.focus();
  try {
    const response = await api.getOrderById(id);
    dataDetail.value = response.data?.data || null;
  } catch (error) {
    $message.error("Không thể tải chi tiết đơn hàng");
  }
}

// Xóa đơn hàng
function deleteOrder(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: "Bạn có chắc chắn muốn xóa đơn hàng này?",
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteOrder(id);
        $message.success("Đã xóa đơn hàng thành công");
        loadOrders();
      } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
        $message.error("Không thể xóa đơn hàng");
      }
    },
  });
}

// Xuất file excel
async function exportExcel() {}

function resetListOrders() {
  searchQuery.value.order_code = null;
  searchQuery.value.customer = null;
  searchQuery.value.type_order = null;
  searchQuery.value.status = null;
  searchQuery.value.payment_status = null;
  searchQuery.value.creator = null;
  searchQuery.value.range = null;
  buttonSearchRef.value?.search?.();
}

function searchByQuery() {
  if (!searchQuery.value?.customer && !searchQuery.value.order_code) {
    buttonSearchRef.value?.search?.();
  }
}

function searchData() {
  buttonSearchRef.value?.search?.();
}

function handleAddOrder() {
  router.push("/order/add");
}

// Sửa đơn hàng
function editOrder(id) {
  router.push(`/order/edit/${id}`);
}

onMounted(() => {
  loadOrders();
});
</script>

<style scoped>
:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>
