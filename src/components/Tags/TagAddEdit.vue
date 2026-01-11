<script setup>
defineOptions({ name: "TagsAddEdit" });

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
  name: "",
  display_order: null,
  slug: "",
  is_active: true,
  metadata: {
    meta_title: "",
    meta_keywords: "",
    meta_description: "",
    meta_image: [],
  },
  content: {
    cover_photo: [],
    images: [],
    description: "",
    content: "",
  },
});

const rules = {
  name: [
    {
      required: true,
      message: "Tên thẻ tag không được để trống",
      trigger: ["blur", "input"],
    },
  ],
  slug: [
    {
      required: true,
      message: "Đường dẫn không được để trống",
      trigger: ["blur", "input"],
    },
  ],
};

async function loadTag() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getTagById(props.id);
    if (response.data.success) {
      const data = response.data.data;

      formValue.value = {
        name: data.name || "",
        slug: data.slug || "",
        display_order: data.display_order || null,
        is_active: data.is_active,
        metadata: {
          meta_title: data.metadata?.meta_title || "",
          meta_keywords: data.metadata?.meta_keywords || "",
          meta_description: data.metadata?.meta_description || "",
          meta_image: data.metadata.meta_image || [],
        },
        content: {
          cover_photo: data.content?.cover_photo || [],
          images: data.content?.images || [],
          description: data.content?.description || "",
          content: data.content?.content || "",
        },
      };
    }
  } catch (error) {
    $message.error("Không thể tải thông tin thẻ tag");
  } finally {
    loading.value = false;
  }
}

const handleBack = () => {
  router.push("/tag");
};

async function handleSave() {
  try {
    await formRef.value?.validate();
    loading.value = true;
    const body = {
      ...formValue.value,
    };
    if (isEdit.value) {
      await api.updateTag(props.id, body);
      $message.success("Cập nhật thành công!");
    } else {
      await api.createTag(body);
      $message.success("Thêm mới thành công!");
    }
    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }
    const errorMessage = isEdit.value
      ? "Cập nhật thẻ thất bại"
      : "Thêm thẻ thất bại";
    $message.error(errorMessage);
    console.error("Save category error:", error);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  }
}

onMounted(() => {
  if (isEdit.value) {
    loadTag();
  }
});
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handleBack />
    </template>

    <n-card :title="isEdit ? 'Sửa thẻ' : 'Thêm thẻ'">
      <n-spin :show="loading">
        <n-form
          ref="formRef"
          :model="formValue"
          :rules="rules"
          label-placement="top"
        >
          <n-grid cols="3" x-gap="16" y-gap="16">
            <n-grid-item span="1">
              <n-form-item label="Tên thẻ tag" path="name">
                <NaiveInput
                  v-model:value="formValue.name"
                  placeholder="Nhập tên thẻ tag"
                  :disabled="loading"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="1">
              <n-form-item label="Đường dẫn" path="slug">
                <NaiveInput
                  v-model:value="formValue.slug"
                  placeholder="Nhập đường dẫn"
                  :slug="formValue.name"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="1">
              <n-form-item label="Số thứ tự hiển thị">
                <NaiveInputNumber
                  v-model:value="formValue.display_order"
                  placeholder="Nhập số thứ tự hiển thị"
                  class="w-full"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="3">
              <FormMeta
                v-model:metaTitle="formValue.metadata.meta_title"
                v-model:metaKeywords="formValue.metadata.meta_keywords"
                v-model:metaDescription="formValue.metadata.meta_description"
                v-model:metaImage="formValue.metadata.meta_image"
              />
            </n-grid-item>

            <n-grid-item span="3">
              <ContentBlog
                :title="'Nội dung thẻ tag'"
                v-model:coverPhoto="formValue.content.cover_photo"
                v-model:images="formValue.content.images"
                v-model:description="formValue.content.description"
                v-model:content="formValue.content.content"
              />
            </n-grid-item>
          </n-grid>
        </n-form>
      </n-spin>

      <template #action>
        <ButtonSave
          :isEdit="isEdit"
          :handleBack="handleBack"
          :handleSave="handleSave"
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
