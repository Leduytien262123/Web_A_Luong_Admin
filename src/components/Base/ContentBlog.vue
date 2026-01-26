<script setup>
import NaiveUpload2 from "./NaiveUpload2.vue";

const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  coverPhoto: {
    type: Array,
    required: false,
    default: () => [],
  },
  files: {
    type: Array,
    required: false,
    default: () => [],
  },
  description: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: false,
  },
});

const emit = defineEmits([
  "update:coverPhoto",
  "update:files",
  "update:description",
  "update:content",
]);

const contentComputed = computed({
  get() {
    return props.content;
  },
  set(value) {
    emit("update:content", value);
  },
});

const descriptionComputed = computed({
  get() {
    return props.description;
  },
  set(value) {
    emit("update:description", value);
  },
});

function mapToMetaFiles(list) {
  return (list || []).map((f) => ({
    url: f.url || "",
    alt: f.alt || "",
  }));
}

function mapToFileList(list) {
  return (list || []).map((f, idx) => ({
    url: f.url || "",
    thumbUrl: f.url || "",
    alt: f.alt || "",
    uid: f.uid || `file-${Date.now()}-${idx}`,
    name: f.name || f.alt || `file-${idx}`,
    status: f.status || "finished",
  }));
}

const coverPhotoList = ref(mapToFileList(props.coverPhoto || []));
const fileList = ref(mapToFileList(props.files || []));

watch(
  () => props.coverPhoto,
  (newVal) => {
    if (
      JSON.stringify(mapToMetaFiles(newVal)) !==
      JSON.stringify(mapToMetaFiles(coverPhotoList.value))
    ) {
      coverPhotoList.value = mapToFileList(newVal || []);
      emit("update:coverPhoto", mapToMetaFiles(coverPhotoList.value));
    }
  },
  { deep: true },
);

watch(
  () => props.files,
  (newVal) => {
    if (
      JSON.stringify(mapToMetaFiles(newVal)) !==
      JSON.stringify(mapToMetaFiles(fileList.value))
    ) {
      fileList.value = mapToFileList(newVal || []);
      emit("update:files", mapToMetaFiles(fileList.value));
    }
  },
  { deep: true },
);

function handleCoverUploadSuccess(file) {
  const fileObj = mapToFileList([file])[0];
  coverPhotoList.value = [fileObj];
  emit("update:coverPhoto", mapToMetaFiles(coverPhotoList.value));
}

function handleRemoveCover() {
  coverPhotoList.value = [];
  emit("update:coverPhoto", []);
}

function handleUpdateCoverList(newList) {
  coverPhotoList.value = newList;
  if (coverPhotoList.value.length === 0) {
    emit("update:coverPhoto", []);
  } else {
    emit("update:coverPhoto", mapToMetaFiles(newList));
  }
}

function handleFileUploadSuccess(file) {
  const fileObj = mapToFileList([file])[0];
  fileList.value = [...fileList.value, fileObj];
  emit("update:files", mapToMetaFiles(fileList.value));
}

function handleRemoveFile(removedFile) {
  if (!removedFile) return;
  fileList.value = fileList.value.filter((f) => f.uid !== removedFile.uid);
  emit("update:files", mapToMetaFiles(fileList.value));
}

function handleUpdateFileList(newList) {
  fileList.value = newList;
  emit("update:files", mapToMetaFiles(fileList.value));
}
</script>

<template>
  <n-collapse
    accordion
    class="custom-collapse-light-blue grow rd-5 mb-10"
    arrow-placement="right"
  >
    <n-collapse-item
      class="custom-collapse-header-light-blue"
      :title="title"
      name="content"
    >
      <n-form-item label="Tải lên tài liệu">
        <NaiveUpload2
          :file-list="fileList"
          :multiple="true"
          @update:file-list="handleUpdateFileList"
          @upload-success="handleFileUploadSuccess"
          @remove="handleRemoveFile"
        />
      </n-form-item>

      <n-form-item label="Mô tả ngắn">
        <RichEditorTiny
          v-model="descriptionComputed"
          :height="300"
        />
      </n-form-item>
      <n-form-item label="Bài viết">
        <RichEditor
          v-model="contentComputed"
          :height="500"
        />
      </n-form-item>
    </n-collapse-item>
  </n-collapse>
</template>
