<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  metaContent: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const emit = defineEmits(["update:metaContent"]);

function normalizeMeta(v) {
  if (Array.isArray(v)) return v;
  if (v && typeof v === "object") return [v];
  return [];
}

const content = ref(normalizeMeta(props.metaContent));

watch(
  () => props.metaContent,
  (v) => {
    content.value = normalizeMeta(v);
  },
  { deep: true },
);

watch(
  content,
  (v) => {
    emit(
      "update:metaContent",
      Array.isArray(v) ? v.map((item) => ({ ...item })) : [],
    );
  },
  { deep: true },
);
</script>

<template>
  <div
    v-bind="$attrs"
    class="space-y-12"
  >
    <div
      v-for="(data, idx) in content"
      :key="data.id ?? idx"
      class=""
    >
      <n-collapse
        accordion
        class="custom-collapse-light-blue grow rd-5"
        arrow-placement="right"
      >
        <n-collapse-item
          class="custom-collapse-header-light-blue"
          :title="data.title || 'Thông tin Meta'"
          name="meta"
        >
          <n-form-item label="Title">
            <NaiveInput
              v-model:value="data.title"
              placeholder="Tiêu đề"
            />
          </n-form-item>

          <n-form-item label="Mô tả">
            <NaiveInput
              v-model:value="data.des"
              type="textarea"
              placeholder="Mô tả"
            />
          </n-form-item>

          <n-form-item label="Icon">
            <NaiveInput
              v-model:value="data.icon"
              placeholder="Icon"
            />
          </n-form-item>

          <n-form-item label="Màu">
            <n-color-picker v-model:value="data.color" />
          </n-form-item>
        </n-collapse-item>
      </n-collapse>
    </div>
  </div>
</template>
