<script setup>
const props = defineProps({
  fileList: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  max: {
    type: Number,
    default: undefined,
  },
  listType: {
    type: String,
    default: "image-card",
  },
  defaultFileList: {
    type: Array,
    default: undefined,
  },
  alt: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "update:fileList",
  "change",
  "remove",
  "preview",
  "upload-start",
  "upload-progress",
  "upload-success",
  "upload-error",
]);

const message = useMessage();
const uploadProgress = ref({});

const customRequest = async (options) => {
  const { file, onProgress, onFinish, onError } = options;

  try {
    const origFile = file?.file || file;
    const inferredAlt = origFile?.name || file?.name || "";

    file.alt = file.alt || inferredAlt;

    emit("upload-start", { file: origFile });

    const progressCallback = (progress) => {
      uploadProgress.value[file.uid] = progress;
      onProgress({ percent: progress });
      emit("upload-progress", { file: origFile, progress });
    };

    const contentType = origFile?.type || "image/jpeg";

    const filename = `${Date.now()}_${origFile?.name || "file"}`;

    const response = await api.uploadToS3(
      filename,
      origFile,
      {
        contentEncoding: "blob",
        contentType: contentType,
      },
      progressCallback
    );

    delete uploadProgress.value[file.uid];

    const url = response?.data?.direct_url || response?.data?.fileUrl || "";

    if (!url) {
      throw new Error("No URL returned from upload");
    }

    file.url = url;
    file.status = "finished";
    file.alt = file.alt || inferredAlt;

    const emittedFile = {
      ...file,
      alt: file.alt,
      name: file.name || origFile?.name || "",
    };
    emit("upload-success", { file: emittedFile, url });

    onFinish();

    message.success("Tải lên thành công!");
  } catch (error) {
    delete uploadProgress.value[file.file?.uid || file.uid];
    emit("upload-error", { file: file.file || file, error });
    onError();
    message.error(error?.message || "Đã có lỗi xảy ra vui lòng thử lại sau");
  }
};

function handleUpdateFileList(newList) {
  const normalized = (newList || []).map((f) => ({
    ...f,
    alt: f.alt || f.file?.name || f.name || "",
  }));
  emit("update:fileList", normalized);
}

function handleChange({ file, fileList }) {
  const normalized = (fileList || []).map((f) => ({
    ...f,
    alt: f.alt || f.file?.name || f.name || "",
  }));
  emit("change", { file, fileList: normalized });
  emit("update:fileList", normalized);
}

function handleRemove({ file, fileList }) {
  if (uploadProgress.value[file.uid]) {
    delete uploadProgress.value[file.uid];
  }

  const normalized = (fileList || []).map((f) => ({
    ...f,
    alt: f.alt || f.file?.name || f.name || "",
  }));

  emit("remove", { file, fileList: normalized });
  emit("update:fileList", normalized);
}

const updateAlt = (index, value) => {
  const newList = [...props.fileList];
  if (newList[index]) {
    newList[index] = { ...newList[index], alt: value };
    emit("update:fileList", newList);
  }
};
</script>

<template>
  <div class="flex gap-12 w-full">
    <n-upload
      :file-list="fileList"
      :list-type="listType"
      :disabled="disabled"
      :multiple="multiple"
      :max="max"
      :custom-request="customRequest"
      @update:file-list="handleUpdateFileList"
      @change="handleChange"
      @remove="handleRemove"
      class="max-w-[100px]"
    >
      <n-button v-if="listType === 'text'" :disabled="disabled">
        <template #icon>
          <n-icon><i class="i-mdi:cloud-upload" /></n-icon>
        </template>
        Upload File
      </n-button>
    </n-upload>

    <!-- <div v-if="Object.keys(uploadProgress).length > 0" class="upload-progress">
      <div
        v-for="(progress, uid) in uploadProgress"
        :key="uid"
        class="progress-item"
      >
        <n-progress :percentage="progress" />
        <span class="text-sm">Uploading... {{ progress }}%</span>
      </div>
    </div> -->

    <div v-if="fileList && fileList.length > 0" class="w-full">
      <div class="w-full flex flex-col gap-12px">
        <div
          v-for="(file, idx) in fileList"
          :key="file.uid || file.url || idx"
          class="min-h-96px max-h-96px flex items-start"
        >
          <n-form-item
            :label="'Alt image ' + (multiple ? idx + 1 : '')"
            class="w-full"
          >
            <n-input
              v-model:value="file.alt"
              placeholder="Nhập alt ..."
              class="w-full"
              @update:value="(val) => updateAlt(idx, val)"
            />
          </n-form-item>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-upload-file-list.n-upload-file-list--grid) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
