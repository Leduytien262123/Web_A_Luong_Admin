<template>
  <AppPage show-footer>
    <!-- <div class="flex">
      <n-card class="min-w-200 w-30%">
        <div class="flex items-center">
          <n-avatar
            round
            :size="60"
            :src="userStore.avatar?.[0]?.url || userEmpty"
            class="flex-shrink-0"
          />
          <div class="ml-20 flex-col">
            <span class="text-20 opacity-80">
              Xin chào, {{ userStore.nickName ?? userStore.username }}
            </span>
            <span class="mt-4 opacity-50">Vai trò hiện tại: {{ "Owner" }}</span>
          </div>
        </div>

        <p class="mt-28 text-14 opacity-60">
          Một người gần như có thể thành công trong bất kỳ việc gì mà họ có niềm
          đam mê vô hạn.
        </p>
      </n-card>
      <n-card
        class="ml-12 w-70%"
        title="✨ Chào mừng đến với ứng dụng quản trị"
      >
        <p class="opacity-60">
          Đây là một template quản trị backend với phong cách tối giản, bao gồm
          giải pháp frontend và backend, frontend sử dụng Vite + Vue3 + Pinia +
          Unocss, backend sử dụng Nestjs + TypeOrm + MySql, đơn giản dễ dùng,
          đẹp mắt, trải qua hàng chục lần tái cấu trúc và chăm chút chi tiết!
        </p>
        <footer class="mt-12 flex items-center justify-end">
          <n-button
            type="primary"
            ghost
            tag="a"
            href="https://isme.top"
            target="__blank"
          >
            Tài liệu phát triển
          </n-button>
          <n-button
            type="primary"
            class="ml-12"
            tag="a"
            href="https://github.com/zclzone/vue-naive-admin/tree/2.x"
            target="__blank"
          >
            Kho mã nguồn
          </n-button>
        </footer>
      </n-card>
    </div>
    <div class="mt-12 flex">
      <n-card class="w-50%" title="💯 Tính năng" segmented>
        <template #header-extra>
          <span class="text-highlight opacity-90"
            >👏 Trải qua hàng chục lần tái cấu trúc và chăm chút chi tiết</span
          >
        </template>

        <ul class="opacity-90">
          <li class="py-4">
            🆒 Sử dụng
            <b>Vue3</b>
            công nghệ chủ đạo:
            <span class="text-highlight">Vite + Vue3 + Pinia</span>
          </li>
          <li class="py-4">
            🍇 Sử dụng framework
            <b>Atomic CSS</b>
            :
            <span class="text-highlight">Unocss</span>
            , thanh lịch, nhẹ, dễ sử dụng
          </li>
          <li class="py-4">
            🤹 Sử dụng giải pháp icon chủ đạo
            <span class="text-highlight">iconify + unocss</span>
            , hỗ trợ icon tùy chỉnh và render động
          </li>
          <li class="py-4">
            🎨 Sử dụng Naive UI,
            <span class="text-highlight"
              >phong cách code cực kỳ đơn giản và thiết kế giao diện sạch
              sẽ</span
            >
            , thẩm mỹ trực tuyến, tùy chỉnh theme dễ dàng
          </li>
          <li class="py-4">
            👏 Thiết kế cấu trúc file tiên tiến và dễ hiểu, nhiều module
            <b>zero coupling</b>
            , xóa một module nghiệp vụ không ảnh hưởng đến các module khác
          </li>
          <li class="py-4">
            🚀
            <span class="text-highlight">Thiết kế route phẳng</span>
            , mỗi component đều có thể là một page, tạm biệt vấn đề khó
            implement KeepAlive của multi-level route
          </li>

          <li class="py-4">
            🍒
            <span class="text-highlight">Tạo route động dựa trên quyền</span>
            , không cần định nghĩa route thêm,
            <span class="text-highlight">phân biệt được 403 và 404</span>
            , thay vì không có quyền cũng nhảy 404
          </li>
          <li class="py-4">
            🔐 Tích hợp Redis
            <span class="text-highlight">refresh không cảm nhận</span>
            , trạng thái đăng nhập người dùng có thể kiểm soát, bảo mật và trải
            nghiệm không thể thiếu
          </li>
          <li class="py-4">
            ✨ Dựa trên Naive UI đóng gói
            <span class="text-highlight">message</span>
            phương thức công cụ toàn cục, hỗ trợ nhắc nhở hàng loạt, hỗ trợ chia
            sẻ instance giữa các trang
          </li>
          <li class="py-4">
            ⚡️ Dựa trên Naive UI đóng gói các component nghiệp vụ thường dùng,
            bao gồm
            <span class="text-highlight">Page</span>
            component,
            <span class="text-highlight">CRUD</span>
            table component và
            <span class="text-highlight">Modal</span>
            component, giảm thiểu nhiều công việc lặp lại
          </li>
        </ul>

        <n-divider class="mb-0! mt-12!">
          <p class="text-14 opacity-60">
            👉Nhấp vào
            <b class="mx-2 transition hover:text-primary">
              <a href="https://isme.top" target="_blank">Xem thêm</a>
            </b>
            để xem thêm tính năng hữu ích, đang phát triển liên tục...
          </p>
        </n-divider>
      </n-card>

      <n-card class="ml-12 w-50%" title="Thống kê theo danh mục" segmented>
        <VChart :option="skillOption" autoresize />
      </n-card>
    </div>

    <n-card class="mt-12" title="⚡️ Xu hướng" segmented>
      <div class="h-400">
        <VChart :option="trendOption" autoresize />
      </div>
    </n-card> -->
    <h1 class="">Tính năng đang phát triển...</h1>
  </AppPage>
</template>

<script setup>
import userEmpty from "@/public/img/user_empty.jpg";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";
import { useUserStore } from "@/store";

const userStore = useUserStore();
const dataOverview = ref([]);

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  PieChart,
]);

const trendOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#999",
      },
    },
  },
  legend: {
    top: "5%",
    data: ["star", "fork"],
  },
  xAxis: [
    {
      type: "category",
      data: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      axisPointer: {
        type: "shadow",
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      min: 0,
      max: 3000,
      interval: 500,
      axisLabel: {
        formatter: "{value}",
      },
    },
    {
      type: "value",
      min: 0,
      max: 500,
      interval: 100,
      axisLabel: {
        formatter: "{value}",
      },
    },
  ],
  series: [
    {
      name: "star",
      type: "line",
      data: [200, 320, 520, 550, 600, 805, 888, 950, 1300, 2503, 2702, 2712],
    },
    {
      name: "fork",
      yAxisIndex: 1,
      type: "bar",
      data: [40, 72, 110, 115, 121, 175, 180, 201, 260, 398, 423, 455],
    },
  ],
};

const getDashboardOverview = async () => {
  try {
    const resOverview = await api.getDashboardOverview();
    dataOverview.value =
      resOverview?.data?.data?.top_categories?.map((item) => ({
        name: item.category_name,
        value: item.orders,
      })) || [];
  } catch (e) {
    console.error("getDashboardOverview error", e);
    dataOverview.value = [];
  }
};

onMounted(async () => {
  await getDashboardOverview();
});

const skillOption = computed(() => ({
  tooltip: {
    trigger: "item",
    formatter({ name, value }) {
      return `${name} ${value}%`;
    },
  },
  legend: {
    left: "center",
  },
  series: [
    {
      top: "12%",
      type: "pie",
      radius: ["35%", "90%"],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 36,
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: dataOverview.value,
    },
  ],
}));
</script>
