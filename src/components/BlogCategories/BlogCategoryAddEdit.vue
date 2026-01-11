<script setup>
defineOptions({ name: "BlogCategoriesAddEdit" });

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

const blogCategoryForm = ref({
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
      message: "Tên danh mục bài viết không được để trống",
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

async function loadBlogCategory() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getBlogCategoryById(props.id);
    if (response.data.success) {
      const data = response.data.data;

      blogCategoryForm.value = {
        name: data.name || "",
        slug: data.slug || "",
        display_order: data.display_order || null,
        is_active: data.is_active,
        metadata: {
          meta_title: data.metadata?.meta_title || "",
          meta_keywords: data.metadata?.meta_keywords || "",
          meta_description: data.metadata?.meta_description || "",
          meta_image: data.metadata?.meta_image || [],
        },
        content: {
          cover_photo: data.content?.cover_photo,
          images: data.content?.images,
          description: data.content?.description || "",
          content: data.content?.content || "",
        },
      };
    }
  } catch (error) {
    $message.error("Không thể tải thông tin danh mục bài viết");
    console.error("Load blog category error:", error);
  } finally {
    loading.value = false;
  }
}

function normalizeImageField(field) {
  if (!Array.isArray(field)) return [];
  return field.map((img) => {
    if (typeof img === "string") {
      return { url: img, alt: "" };
    }
    return {
      url: img.url || img.url_file || "",
      alt: img.alt || "",
    };
  });
}

const handleBack = () => {
  router.push("/blog-category");
};

async function handleSave() {
  try {
    await formRef.value?.validate();
    loading.value = true;
    const body = {
      ...blogCategoryForm.value,
    };
    if (isEdit.value) {
      await api.updateBlogCategory(props.id, body);
      $message.success("Cập nhật danh mục bài viết thành công!");
    } else {
      await api.createBlogCategory(body);
      $message.success("Thêm danh mục bài viết thành công!");
    }
    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }
    const errorMessage = isEdit.value
      ? "Cập nhật danh mục bài viết thất bại"
      : "Thêm danh mục bài viết thất bại";
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
    loadBlogCategory();
  }
});
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handleBack />
    </template>

    <n-card
      :title="isEdit ? 'Sửa danh mục bài viết' : 'Thêm danh mục bài viết'"
    >
      <n-spin :show="loading">
        <n-form
          ref="formRef"
          :model="blogCategoryForm"
          :rules="rules"
          label-placement="top"
        >
          <n-grid cols="3" x-gap="16" y-gap="16">
            <n-grid-item span="1">
              <n-form-item label="Tên danh mục bài viết" path="name">
                <NaiveInput
                  v-model:value="blogCategoryForm.name"
                  placeholder="Nhập tên danh mục"
                  :disabled="loading"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="1">
              <n-form-item label="Đường dẫn" path="slug">
                <NaiveInput
                  v-model:value="blogCategoryForm.slug"
                  placeholder="Nhập đường dẫn"
                  :slug="blogCategoryForm.name"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="1">
              <n-form-item label="Số thứ tự hiển thị">
                <NaiveInputNumber
                  v-model:value="blogCategoryForm.display_order"
                  placeholder="Nhập số thứ tự hiển thị"
                  class="w-full"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="3">
              <FormMeta
                v-model:metaTitle="blogCategoryForm.metadata.meta_title"
                v-model:metaKeywords="blogCategoryForm.metadata.meta_keywords"
                v-model:metaDescription="
                  blogCategoryForm.metadata.meta_description
                "
                v-model:metaImage="blogCategoryForm.metadata.meta_image"
              />
            </n-grid-item>

            <n-grid-item span="3">
              <ContentBlog
                :title="'Nội dung danh mục bài viết'"
                v-model:coverPhoto="blogCategoryForm.content.cover_photo"
                v-model:images="blogCategoryForm.content.images"
                v-model:description="blogCategoryForm.content.description"
                v-model:content="blogCategoryForm.content.content"
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
