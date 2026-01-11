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

const categoryForm = ref({
  name: "",
  description: "",
  slug: "",
  is_active: true,
  show_menu: false,
  show_home: false,
  show_footer: false,
  position_menu: null,
  position_footer: null,
  metadata: {
    meta_title: "",
    meta_keywords: "",
    meta_description: "",
    meta_image: [],
  },
});

const rules = {
  name: [
    {
      required: true,
      message: "Tên danh mục không được để trống",
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

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim("-");
}

watch(
  () => categoryForm.value.name,
  (newName) => {
    if (newName) {
      categoryForm.value.slug = generateSlug(newName);
    }
  }
);

async function loadCategory() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getCategoryById(props.id);
    if (response.data.success) {
      const data = response.data.data;
      categoryForm.value = {
        name: data.name || "",
        description: data.description || "",
        slug: data.slug || "",
        is_active: data.is_active,
        show_menu: data.show_menu,
        show_home: data.show_home,
        show_footer: data.show_footer,
        position_menu: data.position_menu,
        position_footer: data.position_footer,
        metadata: {
          meta_title: data.metadata?.meta_title || "",
          meta_keywords: data.metadata?.meta_keywords || "",
          meta_description: data.metadata?.meta_description || "",
          meta_image: data.metadata?.meta_image || [],
        },
        parent_category: data.parent_category?.id || null,
      };
    }
  } catch (error) {
    $message.error("Không thể tải thông tin danh mục");
    console.error("Load category error:", error);
  } finally {
    loading.value = false;
  }
}

function handleBack() {
  router.push("/category");
}

async function handleSave() {
  try {
    await formRef.value?.validate();

    loading.value = true;

    if (isEdit.value) {
      await api.updateCategory(props.id, categoryForm.value);
      $message.success("Cập nhật danh mục thành công!");
    } else {
      await api.createCategory(categoryForm.value);
      $message.success("Thêm danh mục thành công!");
    }

    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }

    const errorMessage = isEdit.value
      ? "Cập nhật danh mục thất bại"
      : "Thêm danh mục thất bại";
    $message.error(errorMessage);
    console.error("Save category error:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (isEdit.value) {
    loadCategory();
  }
});
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handleBack />
    </template>

    <n-card :title="isEdit ? 'Sửa danh mục' : 'Thêm danh mục'">
      <n-spin :show="loading">
        <n-form
          ref="formRef"
          :model="categoryForm"
          :rules="rules"
          label-placement="top"
        >
          <n-form-item label="Tên danh mục" path="name">
            <NaiveInput
              v-model:value="categoryForm.name"
              placeholder="Nhập tên danh mục"
              :disabled="loading"
            />
          </n-form-item>

          <n-form-item label="Đường dẫn" path="slug">
            <NaiveInput
              v-model:value="categoryForm.slug"
              placeholder="Nhập đường dẫn"
              :slug="categoryForm.name"
            />
          </n-form-item>

          <n-form-item label="Danh mục cha" path="parent_category">
            <TreeSelectCategories
              v-model:value="categoryForm.parent_category"
              :placeholder="'Chọn danh mục cha'"
            />
          </n-form-item>

          <n-form-item label="Mô tả">
            <NaiveInput
              v-model:value="categoryForm.description"
              type="textarea"
              placeholder="Nhập mô tả danh mục"
              :autosize="{ minRows: 3, maxRows: 6 }"
              :disabled="loading"
            />
          </n-form-item>

          <n-form-item label="Trạng thái">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  margin-bottom: 8px;
                "
              >
                <n-switch
                  v-model:value="categoryForm.is_active"
                  :disabled="loading"
                />
                <span>Hoạt động</span>
              </div>
              <n-checkbox
                v-model:checked="categoryForm.show_menu"
                :disabled="loading"
              >
                Hiển thị trên menu
              </n-checkbox>
              <n-checkbox
                v-model:checked="categoryForm.show_footer"
                :disabled="loading"
              >
                Hiển thị trên footer
              </n-checkbox>
              <!-- <n-checkbox
                v-model:checked="categoryForm.show_home"
                :disabled="loading"
              >
                Hiển thị trên trang chủ
              </n-checkbox> -->
            </div>
          </n-form-item>

          <div class="flex gap-16">
            <n-form-item
              v-if="categoryForm.show_menu"
              label="Thứ tự hiển thị trên menu"
              path="position"
              class="w-1/2"
            >
              <NaiveInputNumber
                v-model:value="categoryForm.position_menu"
                placeholder="Nhập thứ tự hiển thị"
              />
            </n-form-item>

            <n-form-item
              v-if="categoryForm.show_footer"
              label="Thứ tự hiển thị trên footer"
              path="position"
              class="w-1/2"
            >
              <NaiveInputNumber
                v-model:value="categoryForm.position_footer"
                placeholder="Nhập thứ tự hiển thị"
              />
            </n-form-item>
          </div>

          <FormMeta
            v-model:metaTitle="categoryForm.metadata.meta_title"
            v-model:metaKeywords="categoryForm.metadata.meta_keywords"
            v-model:metaDescription="categoryForm.metadata.meta_description"
            v-model:metaImage="categoryForm.metadata.meta_image"
          />
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
