<script setup>
const { showModal, title, text, loading, isStatusDiscount } = defineProps({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: false,
  },
  showModal: {
    type: Boolean,
    default: false,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
  },
  isStatusDiscount: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["onCancel", "onConfirm"]);

const handleClickCancel = () => {
  emit("onCancel");
};

const handleClickConfirm = () => {
  emit("onConfirm");
};
</script>

<template>
  <n-modal :show="showModal">
    <div class="min-w-[400px] px-24 py-16 rounded-12 bg-white">
      <div class="flex items-center justify-between">
        <svg
          v-if="isStatusDiscount"
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="4" y="4" width="48" height="48" rx="24" fill="#FFF6E1" />
          <rect
            x="4"
            y="4"
            width="48"
            height="48"
            rx="24"
            stroke="#FFFAEE"
            stroke-width="8"
          />
          <path
            d="M34.75 19H31C30.6022 19 30.2206 19.158 29.9393 19.4393C29.658 19.7206 29.5 20.1022 29.5 20.5V35.5C29.5 35.8978 29.658 36.2794 29.9393 36.5607C30.2206 36.842 30.6022 37 31 37H34.75C35.1478 37 35.5294 36.842 35.8107 36.5607C36.092 36.2794 36.25 35.8978 36.25 35.5V20.5C36.25 20.1022 36.092 19.7206 35.8107 19.4393C35.5294 19.158 35.1478 19 34.75 19ZM34.75 35.5H31V20.5H34.75V35.5ZM25 19H21.25C20.8522 19 20.4706 19.158 20.1893 19.4393C19.908 19.7206 19.75 20.1022 19.75 20.5V35.5C19.75 35.8978 19.908 36.2794 20.1893 36.5607C20.4706 36.842 20.8522 37 21.25 37H25C25.3978 37 25.7794 36.842 26.0607 36.5607C26.342 36.2794 26.5 35.8978 26.5 35.5V20.5C26.5 20.1022 26.342 19.7206 26.0607 19.4393C25.7794 19.158 25.3978 19 25 19ZM25 35.5H21.25V20.5H25V35.5Z"
            fill="#FF7A00"
          />
        </svg>

        <IconDeleteModal v-else />
        <button class="w-32 h-32 bg-white" @click="handleClickCancel">
          <IconX class="ml-4" />
        </button>
      </div>
      <div class="mt-16 ml-4">
        <h1 class="text-20px text-[#344054] font-semibold">{{ title }}</h1>
        <h2 v-if="text" class="text-14px mt-6 text-#8BA3CB">{{ text }}</h2>
      </div>
      <div class="mt-32 grid grid-cols-2 gap-16">
        <n-button
          type="default"
          class="h-40 text-14 !font-medium"
          style="
            border: 1px solid #8ba3cb !important;
            color: #8ba3cb !important;
            background: #fff !important;
          "
          @click="handleClickCancel"
        >
          Huỷ
        </n-button>
        <n-button
          type="primary"
          :color="isStatusDiscount ? '#FF7A00' : '#FE5C73'"
          class="h-40 text-14 !font-medium"
          @click="handleClickConfirm"
          :loading
        >
          Xác nhận
        </n-button>
      </div>
    </div>
  </n-modal>
</template>
