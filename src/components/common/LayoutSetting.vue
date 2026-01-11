<template>
  <div>
    <n-tooltip trigger="hover" placement="left">
      <template #trigger>
        <div
          id="layout-setting"
          class="f-c-c rounded-4 bg-primary p-8 cursor-pointer"
          @click="modalRef.open()"
        >
          <i class="i-fe:settings bg-white text-20" />
        </div>
      </template>
      Thiết lập bố cục
    </n-tooltip>

    <MeModal
      ref="modalRef"
      title="Thiết lập bố cục"
      :show-footer="false"
      width="600px"
    >
      <n-space justify="space-between">
        <div
          class="flex-col cursor-pointer justify-center"
          @click="appStore.setLayout('simple')"
        >
          <div class="flex">
            <n-skeleton :width="20" :height="60" />
            <div class="ml-4">
              <n-skeleton :width="80" :height="60" />
            </div>
          </div>
          <n-button
            class="mt-12"
            size="small"
            :type="appStore.layout === 'simple' ? 'primary' : ''"
            ghost
          >
            Tối giản
          </n-button>
        </div>
        <div
          class="flex-col cursor-pointer justify-center"
          @click="appStore.setLayout('normal')"
        >
          <div class="flex">
            <n-skeleton :width="20" :height="60" />
            <div class="ml-4">
              <n-skeleton :width="80" :height="10" />
              <n-skeleton class="mt-4" :width="80" :height="46" />
            </div>
          </div>
          <n-button
            class="mt-12"
            size="small"
            :type="appStore.layout === 'normal' ? 'primary' : ''"
            ghost
          >
            Thông thường
          </n-button>
        </div>
        <div
          class="flex-col cursor-pointer justify-center"
          @click="appStore.setLayout('full')"
        >
          <div class="flex">
            <n-skeleton :width="20" :height="60" />
            <div class="ml-4">
              <n-skeleton :width="80" :height="10" />
              <n-skeleton class="mt-4" :width="80" :height="46" />
            </div>
          </div>
          <n-button
            class="mt-12"
            size="small"
            :type="appStore.layout === 'full' ? 'primary' : ''"
            ghost
          >
            Đầy đủ
          </n-button>
        </div>
        <div
          class="flex-col cursor-pointer justify-center"
          @click="appStore.setLayout('empty')"
        >
          <div class="flex">
            <n-skeleton :width="20" :height="60" />
            <div class="ml-4">
              <n-skeleton :width="80" :height="60" />
            </div>
          </div>
          <n-button
            class="mt-12"
            size="small"
            :type="appStore.layout === 'empty' ? 'primary' : ''"
            ghost
          >
            Trống
          </n-button>
        </div>
      </n-space>
      <p class="mt-16 opacity-50">
        Lưu ý: Thiết lập này chỉ có hiệu lực đối với các trang không thiết lập
        layout hoặc thiết lập theo hệ thống, layout được thiết lập trong menu có
        độ ưu tiên cao nhất
      </p>
    </MeModal>
  </div>
</template>

<script setup>
import { MeModal } from "@/components";
import { useModal } from "@/composables";
import { useAppStore } from "@/store";

const appStore = useAppStore();
const [modalRef] = useModal();
</script>
