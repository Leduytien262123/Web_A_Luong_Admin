<template>
  <CommonPage>
    <n-card title="Quản lý nội dung trang chủ">
      <n-space vertical>
        <n-data-table
          :columns="columns"
          :data="categories"
          :bordered="true"
          :striped="true"
          :loading="loading"
          :row-key="rowKey"
        />
      </n-space>
    </n-card>
  </CommonPage>
</template>

<script setup>
import { NCheckbox } from "naive-ui";
import { renderButtonWithTooltip } from "@/utils/common";
import IconPencil from "@/components/icon/Pencil.vue";

defineOptions({ name: "CategoryManagement" });

const router = useRouter();
const categories = ref([]);
const loading = ref(false);

const columns = [
  {
    title: "Tiêu đề",
    key: "title",
    ellipsis: true,
    width: 250,
    tree: true,
  },
  {
    title: "Hiển thị ở trang chủ",
    key: "show_menu",
    align: "center",
    render(row) {
      return h(NCheckbox, { checked: row.show_home });
    },
  },
  {
    title: "Thứ tự ở trang chủ",
    key: "position",
    align: "center",
    render(row) {
      return row.position > 0 ? row.position : "-";
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
        ].filter(Boolean),
      );
    },
  },
];

// Tải danh sách danh mục
async function loadDataPageHomes() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 100,
    };
    const response = await api.getDataPageHome(params);
    categories.value = response.data?.data?.data || [];
  } catch (error) {
    $message.error("Không thể tải danh sách danh mục");
  } finally {
    loading.value = false;
  }
}

// Sửa danh mục
function editCategory(id) {
  router.push(`/configs/home-configuration/edit/${id}`);
}

function rowKey(row) {
  return row.id;
}

// Tải danh sách khi component được mount
onMounted(() => {
  loadDataPageHomes();
});
</script>
