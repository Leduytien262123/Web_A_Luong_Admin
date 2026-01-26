<script setup>
defineOptions({ name: "CategoriesAddEdit" });

const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
});

const router = useRouter();

const formRef = ref(null);
const loading = ref(false);
const isEdit = computed(() => !!props.id);

const formValue = ref({
  title: "",
  description: "",
  show_home: false,
  position: null,
  type_key: "",
  metadata: [],
});

const rules = {
  title: [
    {
      required: true,
      message: "Tên tiêu đề không được để trống",
      trigger: ["blur", "input"],
    },
  ],
};

async function loadDataPageHome() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getDataPageHomeById(props.id);
    if (response.data.success) {
      const data = response.data.data;
      formValue.value = {
        title: data.title || "",
        description: data.description || "",
        show_home: data.show_home,
        position: data.position,
        type_key: data.type_key || "",
        metadata: data?.metadata || [],
      };
    }
  } catch (error) {
    $message.error("Không thể tải thông tin tiêu đề");
    console.error("Load category error:", error);
  } finally {
    loading.value = false;
  }
}

function handleBack() {
  router.push("/configs/home-configuration");
}

async function handleSave() {
  try {
    await formRef.value?.validate();

    loading.value = true;

    if (!formValue.value.show_home) {
      formValue.value.position = 0;
    }

    if (isEdit.value) {
      await api.updateDataPageHome(props.id, formValue.value);
      $message.success("Cập nhật tiêu đề thành công!");
    } else {
      await api.createDataPageHome(formValue.value);
      $message.success("Thêm tiêu đề thành công!");
    }

    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }

    const errorMessage = isEdit.value
      ? "Cập nhật nội dung thất bại"
      : "Thêm nội dung thất bại";
    $message.error(errorMessage);
    console.error("Save category error:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (isEdit.value) {
    loadDataPageHome();
  }
});
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handle-back />
    </template>

    <n-card :title="'Sửa nội dung'">
      <n-spin :show="loading">
        <n-form
          ref="formRef"
          :model="formValue"
          :rules="rules"
          label-placement="top"
        >
          <n-form-item
            label="Tên tiêu đề"
            path="title"
          >
            <NaiveInput
              v-model:value="formValue.title"
              placeholder="Nhập tên tiêu đề"
              :disabled="loading"
            />
          </n-form-item>

          <n-form-item label="Mô tả">
            <NaiveInput
              v-model:value="formValue.description"
              type="textarea"
              placeholder="Nhập mô tả tiêu đề"
              :autosize="{ minRows: 3, maxRows: 6 }"
              :disabled="loading"
            />
          </n-form-item>

          <n-form-item label="Trạng thái">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <n-checkbox
                v-model:checked="formValue.show_home"
                :disabled="loading"
              >
                Hiển thị trên trang chủ
              </n-checkbox>
            </div>
          </n-form-item>

          <n-form-item
            v-if="formValue.show_home"
            label="Số thứ tự hiển thị"
          >
            <NaiveInputNumber
              v-model:value="formValue.position"
              placeholder="Nhập số thứ tự hiển thị"
              class="w-full"
            />
          </n-form-item>

          <n-form-item label="Nội dung">
            <div class="flex flex-row flex-wrap gap-4 w-full">
              <FormMetaContent
                class="w-full"
                :meta-content="formValue.metadata"
              />
            </div>
          </n-form-item>
        </n-form>
      </n-spin>

      <template #action>
        <ButtonSave
          :is-edit="isEdit"
          :handle-back="handleBack"
          :handle-save="handleSave"
          :loading="loading"
          :disabled="loading"
        />
      </template>
    </n-card>
  </CommonPage>
</template>

<style scoped>
:deep(.n-collapse-item__header-main) {
  justify-content: space-between;
  font-size: 18px;
}
</style>
