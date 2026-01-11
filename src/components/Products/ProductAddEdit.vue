<script setup>
defineOptions({ name: "ProductAddEdit" });

const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
});

const router = useRouter();

const formValue = ref({
  name: "",
  slug: "",
  sku: "",
  category_id: null,
  description: "",
  price: null,
  discount_price: null,
  is_active: true, // default value, will be overwritten when loading product
  metadata: {
    meta_title: "",
    meta_keywords: "",
    meta_description: "",
    meta_image: [], // Đổi từ null thành []
  },
  content: {
    cover_photo: [],
    images: [],
    description: "",
    content: "",
  },
});

const isEdit = computed(() => !!props.id);
const categories = ref([]);
const loading = ref(false);

const rules = {
  name: [
    {
      required: true,
      message: "Vui lòng nhập tên sản phẩm",
      trigger: ["blur", "input"],
    },
  ],
  slug: [
    {
      required: true,
      message: "Vui lòng nhập đường dẫn",
      trigger: ["blur", "input"],
    },
  ],
  sku: [
    {
      required: true,
      message: "Vui lòng nhập SKU",
      trigger: ["blur", "input"],
    },
  ],
  // category_id: [
  //   {
  //     required: true,
  //     message: "Vui lòng chọn danh mục",
  //     trigger: ["blur", "change"],
  //   },
  // ],
  price: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        if (!value) return new Error("Vui lòng nhập giá sản phẩm");
        return true;
      },
    },
  ],
  discount_price: [
    {
      required: false,
      trigger: ["blur", "input"],
      validator(rule, value) {
        if (value !== null && value !== undefined && value !== "") {
          if (Number(value) > Number(formValue.value?.price)) {
            return new Error("Giá sale không được lớn hơn giá bán");
          } else if (Number(value) === Number(formValue.value?.price)) {
            return new Error("Giá sale không được bằng giá bán");
          }
        }
        return true;
      },
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
  () => formValue.value.name,
  (newName) => {
    if (newName) {
      formValue.value.slug = generateSlug(newName);
    }
  }
);

const formRef = ref(null);

async function loadCategories() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    const response = await api.getCategories(params);
    categories.value =
      response.data?.data?.categories?.map((e) => ({
        label: e.name,
        value: e.id,
      })) || [];
  } catch (error) {
    $message.error("Không thể tải danh sách danh mục");
  } finally {
    loading.value = false;
  }
}

async function loadProduct() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getProductById(props.id);
    if (response.data.success) {
      const data = response.data.data;

      // Xử lý cover_photo
      let coverPhoto = [];
      if (data.cover_photo) {
        if (Array.isArray(data.cover_photo)) {
          coverPhoto = data.cover_photo;
        } else if (typeof data.cover_photo === "string") {
          coverPhoto = [{ url: data.cover_photo, alt: data.alt || "" }];
        } else if (data.cover_photo.url) {
          coverPhoto = [
            { url: data.cover_photo.url, alt: data.cover_photo.alt || "" },
          ];
        }
      }

      // Xử lý images
      let images = [];
      if (data.images) {
        if (Array.isArray(data.images)) {
          images = data.images.map((img) => {
            if (typeof img === "string") {
              return { url: img, alt: "" };
            }
            return { url: img.url || img.url_file || "", alt: img.alt || "" };
          });
        } else if (typeof data.images === "string") {
          images = [{ url: data.images, alt: "" }];
        }
      }

      formValue.value = {
        name: data.name || "",
        description: data.description || "",
        slug: data.slug || "",
        is_active: data.is_active,
        category_id: data.category_id || null,
        sku: data.sku || "",
        price: data.price || null,
        discount_price: data.discount_price || null,
        show_menu: data.show_menu,
        show_home: data.show_home,
        show_footer: data.show_footer,
        metadata: {
          meta_title: data.metadata?.meta_title || "",
          meta_keywords: data.metadata?.meta_keywords || "",
          meta_description: data.metadata?.meta_description || "",
          meta_image: Array.isArray(data.metadata?.meta_image)
            ? data.metadata.meta_image
            : [],
        },
        content: {
          cover_photo: coverPhoto,
          images: images,
          description: data.content?.description || "",
          content: data.content?.content || "",
        },
      };
    }
  } catch (error) {
    $message.error("Không thể tải thông tin sản phẩm");
    console.error("Load product error:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadCategories();
  if (isEdit.value) {
    loadProduct();
  }
});

function handleBack() {
  router.push("/product");
}

async function handleSave() {
  try {
    await formRef.value?.validate();

    loading.value = true;

    if (isEdit.value) {
      await api.updateProduct(props.id, formValue.value);
      $message.success("Cập nhật sản phẩm thành công!");
    } else {
      await api.createProduct(formValue.value);
      $message.success("Thêm sản phẩm thành công!");
    }

    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }

    const errorMessage = isEdit.value
      ? "Cập nhật sản phẩm thất bại"
      : "Thêm sản phẩm thất bại";
    $message.error(errorMessage);
    console.error("Save category error:", error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handleBack />
    </template>

    <n-card :title="isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'">
      <n-form :model="formValue" :rules="rules" ref="formRef">
        <n-grid cols="3" x-gap="16" y-gap="16">
          <n-grid-item span="3">
            <n-form-item label="Tên sản phẩm" path="name">
              <NaiveInput
                v-model:value="formValue.name"
                placeholder="Nhập tên sản phẩm"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="2">
            <n-form-item label="Đường dẫn" path="slug">
              <NaiveInput
                v-model:value="formValue.slug"
                placeholder="Nhập đường dẫn"
                :slug="formValue.name"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Danh mục" path="category_id">
              <NaiveSelect
                v-model:value="formValue.category_id"
                :options="categories"
                filterable
                placeholder="Chọn danh mục"
                clearable
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="SKU" path="sku">
              <NaiveInput
                v-model:value="formValue.sku"
                placeholder="Nhập sku"
                :sku="true"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Giá" path="price">
              <NaiveInputNumber
                v-model:value="formValue.price"
                :show-button="false"
                :money="true"
                placeholder="Nhập giá sản phẩm"
                class="w-full"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Giá sale" path="discount_price">
              <NaiveInputNumber
                v-model:value="formValue.discount_price"
                :show-button="false"
                :money="true"
                placeholder="Nhập giá khuyến mãi"
                class="w-full"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="3">
            <n-form-item label="Mô tả" path="description">
              <NaiveInput
                v-model:value="formValue.description"
                type="textarea"
                placeholder="Nhập mô tả sản phẩm"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="3">
            <n-form-item label="Trạng thái" path="is_active">
              <n-switch v-model:value="formValue.is_active">
                <template #checked> Hoạt động </template>
                <template #unchecked> Không hoạt động </template>
              </n-switch>
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
              :title="'Nội dung sản phẩm'"
              v-model:coverPhoto="formValue.content.cover_photo"
              v-model:images="formValue.content.images"
              v-model:description="formValue.content.description"
              v-model:content="formValue.content.content"
            />
          </n-grid-item>
        </n-grid>
      </n-form>

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
