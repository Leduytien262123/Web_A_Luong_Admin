<script setup>
defineOptions({ name: "BlogAddEdit" });

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
const blogCategories = ref([]);
const tags = ref([]);

const optionsStatus = [
  { label: "Nháp", value: "draft" },
  { label: "Bài đăng", value: "post" },
];

const formValue = ref({
  title: "",
  description: "",
  slug: "",
  category_id: null,
  tag_id: null,
  status: "draft",
  published_at: null,
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
  title: [
    {
      required: true,
      message: "Tên bài viết không được để trống",
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

async function loadBlogCategories() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    const response = await api.getCategories(params);
    blogCategories.value =
      response.data?.data?.categories?.map((e) => ({
        label: e.name,
        value: e.id,
      })) || [];
  } catch (error) {
    $message.error("Không thể tải danh mục bài viết");
  } finally {
    loading.value = false;
  }
}

async function loadTags() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    const response = await api.getTags(params);
    tags.value =
      response.data?.data?.tags?.map((e) => ({
        label: e.name,
        value: e.id,
      })) || [];
  } catch (error) {
    $message.error("Không thể tải danh sách thẻ Tag");
  } finally {
    loading.value = false;
  }
}

async function loadBlog() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getBlogById(props.id);
    if (response?.data?.success) {
      const data = response?.data?.data;

      formValue.value = {
        title: data?.title || "",
        slug: data?.slug || "",
        is_active: data?.is_active || false,
        category_id: data?.category_id || null,
        tag_id: data?.tag_id || null,
        status: data?.status || "draft",
        published_at: data?.published_at || null,
        description: data?.description || "",
        metadata: {
          meta_title: data.metadata?.meta_title || "",
          meta_keywords: data.metadata?.meta_keywords || "",
          meta_description: data.metadata?.meta_description || "",
          meta_image: data.metadata?.meta_image || [],
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
    $message.error("Không thể tải thông tin bài viết");
    console.error("Load blog error:", error);
  } finally {
    loading.value = false;
  }
}

function handleBack() {
  router.push("/blog");
}

async function handleSave() {
  try {
    await formRef.value?.validate();

    loading.value = true;

    const dataToSend = { ...formValue.value };
    if (dataToSend.published_at) {
      dataToSend.published_at = new Date(dataToSend.published_at).toISOString();
    }

    if (isEdit.value) {
      await api.updateBlog(props.id, dataToSend);
      $message.success("Cập nhật bài viết thành công!");
    } else {
      await api.createBlog(dataToSend);
      $message.success("Thêm bài viết thành công!");
    }

    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }

    const errorMessage = isEdit.value
      ? "Cập nhật bài viết thất bại"
      : "Thêm bài viết thất bại";
    $message.error(errorMessage);
    console.error("Save category error:", error);
  } finally {
    loading.value = false;
  }
}

function isValidDate(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d);
}

onMounted(() => {
  loadBlogCategories();
  loadTags();
  if (isEdit.value) {
    loadBlog();
  }
});
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handleBack />
    </template>

    <n-card :title="isEdit ? 'Sửa bài viết' : 'Thêm bài viết'">
      <n-spin :show="loading">
        <n-form
          ref="formRef"
          :model="formValue"
          :rules="rules"
          label-placement="top"
        >
          <n-grid cols="4" x-gap="16" y-gap="16">
            <n-grid-item span="2">
              <n-form-item label="Tên bài viết" path="title">
                <NaiveInput
                  v-model:value="formValue.title"
                  placeholder="Nhập tên bài viết"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2">
              <n-form-item label="Đường dẫn" path="slug">
                <NaiveInput
                  v-model:value="formValue.slug"
                  placeholder="Nhập đường dẫn"
                  :slug="formValue.title"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2">
              <n-form-item label="Danh mục bài viết" path="category_id">
                <TreeSelectCategories
                  v-model:value="formValue.category_id"
                  :placeholder="'Chọn danh mục cha'"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2">
              <n-form-item label="Thẻ tag" path="tag_id">
                <NaiveSelect
                  v-model:value="formValue.tag_id"
                  :options="tags"
                  clearable
                  placeholder="Chọn thẻ tag"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2">
              <n-form-item label="Trạng thái" path="status">
                <NaiveSelect
                  v-model:value="formValue.status"
                  :options="optionsStatus"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2">
              <n-form-item label="Ngày đăng" path="published_at">
                <NaiveDatePicker
                  :value="
                    isValidDate(formValue.published_at)
                      ? Date.parse(formValue.published_at)
                      : null
                  "
                  @update:value="
                    (val) =>
                      (formValue.published_at = val
                        ? new Date(val).toISOString()
                        : null)
                  "
                  type="date"
                  class="w-full"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="4">
              <n-form-item label="Mô tả">
                <NaiveInput
                  v-model:value="formValue.description"
                  type="textarea"
                  placeholder="Nhập mô tả bài viết"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  :disabled="loading"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="4">
              <FormMeta
                v-model:metaTitle="formValue.metadata.meta_title"
                v-model:metaKeywords="formValue.metadata.meta_keywords"
                v-model:metaDescription="formValue.metadata.meta_description"
                v-model:metaImage="formValue.metadata.meta_image"
              />
            </n-grid-item>

            <n-grid-item span="4">
              <ContentBlog
                :title="'Nội dung bài viết'"
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
        />
      </template>
    </n-card>
  </CommonPage>
</template>
