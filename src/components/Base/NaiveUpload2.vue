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
  defaultFileList: {
    type: Array,
    default: undefined,
  },
  alt: {
    type: String,
    default: "",
  },
  accept: {
    type: String,
    default:
      "image/*,application/pdf,.pdf,application/msword,.doc,.docx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xls,.xlsx,application/zip",
  },
});

const emit = defineEmits([
  "update:file-list",
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

const normalizeList = (list) =>
  (list || []).map((f) => {
    const inferredName =
      f?.name ||
      f?.file?.name ||
      f?.alt ||
      f?.url?.split("/").pop() ||
      "không có tên file";
    const inferredAlt = f?.alt || inferredName;

    return {
      ...f,
      name: inferredName,
      alt: inferredAlt,
    };
  });

const fileList = ref(normalizeList(props.fileList || []));

watch(
  () => props.fileList,
  (newVal) => {
    fileList.value = normalizeList(newVal);
  },
  { immediate: true, deep: true },
);

const customRequest = async (options) => {
  const { file, onProgress, onFinish, onError } = options;

  try {
    const origFile = file?.file || file;
    const inferredAlt = origFile?.name || file?.name || "";

    file.name = file.name || origFile?.name || "";
    file.alt = file.alt || inferredAlt;

    emit("upload-start", origFile);

    const progressCallback = (progress) => {
      uploadProgress.value[file.uid] = progress;
      onProgress({ percent: progress });
      emit("upload-progress", { file: origFile, progress });
    };

    const contentType = origFile?.type || "file/jpeg";

    const filename = `${Date.now()}_${origFile?.name || "file"}`;

    const response = await api.uploadToS3(
      filename,
      origFile,
      {
        contentEncoding: "blob",
        contentType: contentType,
      },
      progressCallback,
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
      url,
    };
    emit("upload-success", emittedFile);

    onFinish();

    message.success("Tải lên thành công!");
  } catch (error) {
    delete uploadProgress.value[file.file?.uid || file.uid];
    emit("upload-error", file.file || file);
    onError();
    message.error(error?.message || "Đã có lỗi xảy ra vui lòng thử lại sau");
  }
};
function handleUpdateFileList(newList) {
  const normalized = normalizeList(newList);
  fileList.value = normalized;
  emit("update:file-list", normalized);
}

function handleChange({ file, fileList: newList }) {
  const normalized = normalizeList(newList);
  emit("change", { file, fileList: normalized });
  emit("update:file-list", normalized);
  fileList.value = normalized;
}

function handleRemove({ file, fileList: newList }) {
  if (uploadProgress.value[file.uid]) {
    delete uploadProgress.value[file.uid];
  }
  const normalized = normalizeList(newList);

  fileList.value = normalized;
  emit("remove", file);
  emit("update:file-list", normalized);
}
</script>

<template>
  <n-upload
    v-model:file-list="fileList"
    directory-dnd
    :multiple="props.multiple"
    :max="props.max || 5"
    :disabled="props.disabled"
    :accept="props.accept"
    :file-list="fileList"
    :default-file-list="props.defaultFileList"
    :custom-request="customRequest"
    @update:file-list="handleUpdateFileList"
    @change="handleChange"
    @remove="handleRemove"
  >
    <n-upload-dragger>
      <div style="margin-bottom: 12px">
        <n-icon size="48" :depth="3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
          >
            <path
              d="M80 152v256a40.12 40.12 0 0 0 40 40h272a40.12 40.12 0 0 0 40-40V152"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            />
            <rect
              x="48"
              y="64"
              width="416"
              height="80"
              rx="28"
              ry="28"
              fill="none"
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="32"
            />
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M320 304l-64 64l-64-64"
            />
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M256 345.89V224"
            />
          </svg>
        </n-icon>
      </div>
      <n-text style="font-size: 16px">
        Nhấp chuột hoặc kéo tệp vào khu vực này để tải lên.
      </n-text>
      <n-p depth="3" style="margin: 8px 0 0 0">
        Hỗ trợ tải lên ảnh, tài liệu word, pdf, excel, zip,...
      </n-p>
    </n-upload-dragger>
  </n-upload>
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
