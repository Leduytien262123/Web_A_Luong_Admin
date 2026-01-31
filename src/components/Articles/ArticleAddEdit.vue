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
  tag_ids: null,
  status: "draft",
  published_at: null,
  is_hot: false,
  metadata: {
    meta_title: "",
    meta_keywords: "",
    meta_description: "",
    meta_image: [],
  },
  content: {
    cover_photo: [],
    list_file: [],
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

async function loadArticles() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getArticleById(props.id);
    if (response?.data?.success) {
      const data = response?.data?.data;

      formValue.value = {
        title: data?.title || "",
        slug: data?.slug || "",
        is_active: data?.is_active || false,
        is_hot: data?.is_hot || false,
        category_id: data?.category_id || null,
        tag_ids: data?.tag_ids || null,
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
          list_file: data.content?.list_file || [],
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
  router.push("/articles");
}

async function handleSave() {
  try {
    await formRef.value?.validate();

    loading.value = true;

    const dataToSend = JSON.parse(JSON.stringify(formValue.value || {}));
    if (dataToSend.published_at) {
      dataToSend.published_at = new Date(dataToSend.published_at).toISOString();
    }

    dataToSend.content = dataToSend.content || {};
    dataToSend.content.list_file = formValue.value.content.list_file || [];

    if (isEdit.value) {
      await api.updateArticle(props.id, dataToSend);
      $message.success("Cập nhật bài viết thành công!");
    } else {
      await api.createArticle(dataToSend);
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
  loadTags();
  if (isEdit.value) {
    loadArticles();
  }
});
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handle-back />
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
              <n-form-item label="Thẻ tag" path="tag_ids">
                <NaiveSelect
                  v-model:value="formValue.tag_ids"
                  :options="tags"
                  clearable
                  multiple
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
                  type="date"
                  class="w-full"
                  @update:value="
                    (val) =>
                      (formValue.published_at = val
                        ? new Date(val).toISOString()
                        : null)
                  "
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

            <n-grid-item span="2">
              <n-form-item label="Nổi bật" path="is_hot">
                <n-switch v-model:value="formValue.is_hot">
                  <template #checked> Nổi bật </template>
                  <template #unchecked> Bình thường </template>
                </n-switch>
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="4">
              <FormMeta
                v-model:meta-title="formValue.metadata.meta_title"
                v-model:meta-keywords="formValue.metadata.meta_keywords"
                v-model:meta-description="formValue.metadata.meta_description"
                v-model:meta-image="formValue.metadata.meta_image"
              />
            </n-grid-item>

            <n-grid-item span="4">
              <ContentBlog
                v-model:cover-photo="formValue.content.cover_photo"
                v-model:files="formValue.content.list_file"
                v-model:description="formValue.content.description"
                v-model:content="formValue.content.content"
                :title="'Nội dung bài viết'"
              />
            </n-grid-item>
          </n-grid>
        </n-form>
      </n-spin>

      <template #action>
        <ButtonSave
          :is-edit="isEdit"
          :handle-back="handleBack"
          :handle-save="handleSave"
        />
      </template>
    </n-card>
  </CommonPage>
</template>
