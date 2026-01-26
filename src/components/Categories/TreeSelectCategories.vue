<script setup>
import { ref, onMounted } from "vue";
import NaiveSelectTree from "@/components/Base/NaiveSelectTree.vue";

const props = defineProps({
  value: {
    type: [String, Number, Array, Object, Boolean, null],
    default: null,
  },
  placeholder: {
    type: String,
    default: "Chọn danh mục",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fetchParams: {
    type: Object,
    default: () => ({ page: 1, length: 100 }),
  },
});

const emit = defineEmits(["update:value"]);

const options = ref([]);
const loading = ref(false);

function mapCategoriesToTree(nodes) {
  if (!nodes || !Array.isArray(nodes)) return [];
  return nodes.map((n) => {
    const children = mapCategoriesToTree(n.children || n.childs || []);
    const node = {
      label: n.name,
      value: n.id,
      key: n.id,
    };
    if (children && children.length) node.children = children;
    return node;
  });
}

async function loadCategories() {
  try {
    loading.value = true;
    const params = props.fetchParams || { page: 1, length: 100 };
    const response = await api.getCategories(params);
    const categories = response.data?.data?.categories || [];
    options.value = mapCategoriesToTree(categories);
  } catch (err) {
    $message.error("Không thể tải danh sách danh mục");
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadCategories();
});
</script>

<template>
  <NaiveSelectTree
    :value="value"
    :placeholder="placeholder"
    :options="options"
    :disabled="disabled || loading"
    clearable
    @update:value="(v) => emit('update:value', v)"
  />
</template>
