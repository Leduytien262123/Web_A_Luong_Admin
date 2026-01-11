<script setup>
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
  images: {
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
  "update:images",
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

function mapToMetaImages(list) {
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
    uid: f.uid || `img-${Date.now()}-${idx}`,
    name: f.name || f.alt || `image-${idx}`,
    status: f.status || "finished",
  }));
}

const coverPhotoList = ref(mapToFileList(props.coverPhoto || []));
const imagesList = ref(mapToFileList(props.images || []));

watch(
  () => props.coverPhoto,
  (newVal) => {
    if (
      JSON.stringify(mapToMetaImages(newVal)) !==
      JSON.stringify(mapToMetaImages(coverPhotoList.value))
    ) {
      coverPhotoList.value = mapToFileList(newVal || []);
      emit("update:coverPhoto", mapToMetaImages(coverPhotoList.value));
    }
  },
  { deep: true }
);

watch(
  () => props.images,
  (newVal) => {
    if (
      JSON.stringify(mapToMetaImages(newVal)) !==
      JSON.stringify(mapToMetaImages(imagesList.value))
    ) {
      imagesList.value = mapToFileList(newVal || []);
      emit("update:images", mapToMetaImages(imagesList.value));
    }
  },
  { deep: true }
);

function handleCoverUploadSuccess(file) {
  const imageObj = mapToFileList([file])[0];
  coverPhotoList.value = [imageObj];
  emit("update:coverPhoto", mapToMetaImages(coverPhotoList.value));
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
    emit("update:coverPhoto", mapToMetaImages(newList));
  }
}

function handleImagesUploadSuccess(file) {
  const imageObj = mapToFileList([file])[0];
  imagesList.value = [...imagesList.value, imageObj];
  emit("update:images", mapToMetaImages(imagesList.value));
}

function handleRemoveImages(removedFile) {
  if (!removedFile) return;
  imagesList.value = imagesList.value.filter((f) => f.uid !== removedFile.uid);
  emit("update:images", mapToMetaImages(imagesList.value));
}

function handleUpdateImagesList(newList) {
  imagesList.value = newList;
  emit("update:images", mapToMetaImages(imagesList.value));
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
      <n-form-item label="Ảnh bìa">
        <NaiveUpload
          :file-list="coverPhotoList"
          :max="1"
          list-type="image-card"
          @update:file-list="handleUpdateCoverList"
          @upload-success="handleCoverUploadSuccess"
          @remove="handleRemoveCover"
        />
      </n-form-item>
      <n-form-item label="Ảnh">
        <NaiveUpload
          :file-list="imagesList"
          :multiple="true"
          list-type="image-card"
          @update:file-list="handleUpdateImagesList"
          @upload-success="handleImagesUploadSuccess"
          @remove="handleRemoveImages"
        />
      </n-form-item>
      <n-form-item label="Mô tả ngắn">
        <RichEditorTiny :height="300" v-model="descriptionComputed" />
      </n-form-item>
      <n-form-item label="Bài viết">
        <RichEditor :height="500" v-model="contentComputed" />
      </n-form-item>
    </n-collapse-item>
  </n-collapse>
</template>
