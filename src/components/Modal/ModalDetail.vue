<template>
    <n-modal v-model:show="localShow">
      <div class="p-[24px] w-[500px] rounded-xl bg-white">
        <div class="flex items-center justify-between">
          <h1 class="text-[18px] text-primary font-semibold">{{ title }}</h1>
          <button class="bg-white" @click="onClose">
            <X />
          </button>
        </div>
        <div class="mt-16">
          <div ref="modalContent">
            <div v-if="data" class="text-14 text-gray-700 space-y-4xl">
              <div class=""><b>Tên:</b> {{ data?.name }}</div>
              <hr >
              <div class=""><b>Slug:</b> {{ data?.slug }}</div>
              <hr >
              <div class=""><b>Mô tả:</b> {{ data?.description }}</div>
              <hr >
              <div class=""><b>Trạng thái:</b> {{ data?.is_active ? 'Hoạt động' : 'Dừng hoạt động' }}</div>
              <hr >
              <div class=""><b>Ngày tạo:</b> {{ formatDate(data?.created_at) }}</div>
              <hr >
              <div class=""><b>Ngày cập nhật:</b> {{ formatDate(data?.updated_at) }}</div>
              <hr >
              <div class=""><b>Meta Title:</b> {{ data?.metadata?.meta_title }}</div>
              <hr >
              <div class=""><b>Meta Keywords:</b> {{ data?.metadata?.meta_keywords }}</div>
              <hr >
              <div class=""><b>Meta Description:</b> {{ data?.metadata?.meta_description }}</div>
              <hr >
              <div class="flex flex-col">
                <b>Meta Image:</b>
                  <img v-if="data?.metadata?.meta_image" :src="data?.metadata?.meta_image || ''" class="w-100 h-auto rounded-lg" >
              </div>
            </div>
            <div v-else>Không có dữ liệu</div>
            <div class="flex justify-end mt-20">
              <button class="w-80 h-32 bg-primary text-white rounded-lg" @click="onClose">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    </n-modal>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import dayjs from 'dayjs'
  import X from '@/components/icon/X.vue'
  
  const props = defineProps({
    show: Boolean,
    data: {type: [Object], default: null},
    title: {type: String, default: ''}
  })
  
  const emit = defineEmits(['update:show'])
  
  const data = computed(() => props.data)
  
  const localShow = ref(props.show)
  
  const title = computed(() => props.title)
  
  watch(() => props.show, (val) => {
    localShow.value = val
  })
  
  watch(localShow, (val) => {
    emit('update:show', val)
  })
  
  function onClose() {
    localShow.value = false
  }
  
  function formatDate(date) {
    return date ? dayjs(date).format('DD/MM/YYYY') : ''
  }
  
  const modalContent = ref(null)
  </script>
