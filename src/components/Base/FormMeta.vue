<script setup>
const props = defineProps({
  metaTitle: {
    type: String,
    required: false,
  },
  metaKeywords: {
    type: String,
    required: false,
  },
  metaDescription: {
    type: String,
    required: false,
  },
  metaImage: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const emit = defineEmits([
  "update:metaTitle",
  "update:metaKeywords",
  "update:metaDescription",
  "update:metaImage",
]);

function mapToMetaImages(list) {
  return (list || []).map((f) => ({
    url: f.url || f.thumbUrl || "",
    alt: f.alt || f.name || "",
  }));
}

function mapToFileList(list) {
  return (list || []).map((f, idx) => ({
    url: f.url || f.thumbUrl || "",
    thumbUrl: f.url || f.thumbUrl || "",
    alt: f.alt || f.name || "",
    uid: f.uid || `meta-${Date.now()}-${idx}`,
    name: f.name || f.alt || `image-${idx}`,
    status: f.status || "finished",
  }));
}

const fileList = ref(mapToFileList(props.metaImage || []));

watch(
  () => props.metaImage,
  (newVal) => {
    if (
      JSON.stringify(mapToMetaImages(newVal)) !==
      JSON.stringify(mapToMetaImages(fileList.value))
    ) {
      fileList.value = mapToFileList(newVal || []);
    }
  },
  { deep: true }
);

function handleUploadSuccess(file) {
  const imageObj = {
    url: file.url || file.thumbUrl || "",
    alt: file.alt || file.name || "",
    uid: file.uid || `meta-${Date.now()}`,
    name: file.name || file.alt || "",
    status: "finished",
  };
  fileList.value = [imageObj];
  emit("update:metaImage", mapToMetaImages(fileList.value));
}

// Xử lý khi xóa file
function handleRemove() {
  fileList.value = [];
  emit("update:metaImage", []);
}

function handleUpdateFileList(newFileList) {
  fileList.value = newFileList;
  if (newFileList.length === 0) {
    emit("update:metaImage", []);
  } else {
    emit("update:metaImage", mapToMetaImages(newFileList));
  }
}
</script>

<template>
  <n-collapse
    accordion
    class="custom-collapse-light-blue grow rd-5"
    arrow-placement="right"
  >
    <n-collapse-item
      class="custom-collapse-header-light-blue"
      title="Thông tin Meta"
      name="meta"
    >
      <n-form-item label="Meta Title">
        <NaiveInput
          :value="metaTitle"
          @update:value="emit('update:metaTitle', $event)"
          placeholder="Nhập meta title"
        />
      </n-form-item>
      <n-form-item label="Meta Keywords">
        <NaiveInput
          :value="metaKeywords"
          @update:value="emit('update:metaKeywords', $event)"
          placeholder="Nhập meta keywords"
        />
      </n-form-item>
      <n-form-item label="Meta Description">
        <NaiveInput
          :value="metaDescription"
          @update:value="emit('update:metaDescription', $event)"
          type="textarea"
          placeholder="Nhập meta description"
        />
      </n-form-item>
      <n-form-item label="Meta Image">
        <NaiveUpload
          :file-list="fileList"
          :max="1"
          @update:file-list="handleUpdateFileList"
          @upload-success="handleUploadSuccess"
          @remove="handleRemove"
        />
      </n-form-item>
    </n-collapse-item>
  </n-collapse>
</template>
