<script setup>
defineOptions({ name: "DiscountAddEdit" });

const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
});

const router = useRouter();

const discountForm = ref({
  name: "",
  discount_code: "",
  start_at: null,
  end_at: null,
  type: "percentage", // Loại giảm giá
  value_voucher: null, // giá trị giảm giá
  maximum_discount: null, // giảm giá tối đa
  condition: null, // điều kiện áp dụng
  quantity: null, // số lượng mã giảm giá
  usage_limit: 0, // giới hạn sử dụng
  usage_count: 1, // số lần sử dụng
  applied_products: [], // sản phẩm áp dụng
  applied_category_products: [], // danh mục sản phẩm áp dụng
  description: "",
});

const isEdit = computed(() => !!props.id);
const products = ref([]); // sản phẩm áp dụng
const allProducts = ref([]); // lưu trữ toàn bộ sản phẩm gốc
const categories = ref([]); // danh mục sản phẩm áp dụng
const loading = ref(false);
const isDisabled = ref(false);
const disabledActive = ref(false);

const typeDiscount = [
  { label: "Giảm phần trăm", value: "percentage" },
  { label: "Số tiền", value: "fixed" },
];

const usageLimit = [
  { label: "Không giới hạn", value: 0 },
  { label: "Giới hạn", value: 1 },
];

const rules = {
  name: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const name = String(value || "").trim();
        if (!name) return new Error("Vui lòng nhập tên chương trình giảm giá");
        if (name.length < 5)
          return new Error("Tên chương trình giảm giá phải có ít nhất 5 ký tự");
        if (name.length > 100)
          return new Error(
            "Tên chương trình giảm giá không được quá 100 ký tự"
          );
        return true;
      },
      trigger: ["blur", "input"],
    },
  ],
  discount_code: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        if (value === null || value === undefined || value === "")
          return new Error("Vui lòng nhập mã giảm giá");
        if (!/^[A-Z0-9]+$/.test(value))
          return new Error("Chỉ nhập chữ in hoa và số");
        return true;
      },
    },
  ],
  date_range: {
    required: true,
    trigger: ["input", "blur"],
    validator: () => {
      return new Promise((resolve, reject) => {
        if (!discountForm.value?.start_at || !discountForm.value?.end_at) {
          reject(new Error("Thời gian áp dụng không được để trống"));
          return;
        }
        const now = new Date();
        const start = new Date(discountForm.value.start_at);
        const end = new Date(discountForm.value.end_at);
        // Chỉ cho phép ngày bắt đầu là hôm nay (bất kỳ giờ nào trong ngày hôm nay)
        const isSameDay =
          start.getFullYear() === now.getFullYear() &&
          start.getMonth() === now.getMonth() &&
          start.getDate() === now.getDate();
        // Kiểm tra nếu ngày bắt đầu là trong quá khứ (trước ngày hiện tại)
        const isPastDay = start.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0);
        if (isPastDay && !disabledActive.value) {
          reject(new Error("Không thể chọn ngày bắt đầu trước ngày hôm nay"));
          return;
        }
        if (end < start) {
          reject(new Error("Thời gian kết thúc phải sau thời gian bắt đầu"));
          return;
        }
        resolve();
      });
    },
  },
  value_voucher: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(_, value) {
        if (!value) {
          return new Error("Vui lòng nhập giá trị giảm giá");
        }
        return true;
      },
    },
  ],
  quantity: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(_, value) {
        if (!value) {
          return new Error("Vui lòng nhập số lượng mã giảm giá");
        }
        return true;
      },
    },
  ],
  usage_count: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(_, value) {
        if (!value) {
          return new Error("Vui lòng nhập số lần sử dụng");
        }
        if (value > discountForm.value?.quantity) {
          return new Error(
            "Số lần sử dụng phải nhỏ hơn hoặc bằng số lượng mã giảm giá"
          );
        }
        return true;
      },
    },
  ],
};

const startAtTimestamp = computed({
  get() {
    return discountForm.value.start_at
      ? new Date(discountForm.value.start_at).getTime()
      : null;
  },
  set(val) {
    discountForm.value.start_at = val ? new Date(val).toISOString() : null;
  },
});

const endAtTimestamp = computed({
  get() {
    return discountForm.value.end_at
      ? new Date(discountForm.value.end_at).getTime()
      : null;
  },
  set(val) {
    discountForm.value.end_at = val ? new Date(val).toISOString() : null;
  },
});

watch(
  () => discountForm.value.discount_code,
  (newCode) => {
    if (newCode) {
      discountForm.value.discount_code = (newCode || "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
    }
  }
);

watch(
  () => discountForm.value.value_voucher,
  (newCode) => {
    if (discountForm.value.type === 1 && newCode > 100) {
      discountForm.value.value_voucher = 100;
    }
  }
);

const formRef = ref(null);

async function loadCategories() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 100,
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

async function loadProducts() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 1000,
    };
    const response = await api.getProducts(params);
    const productsData =
      response.data?.data?.products.map((e) => ({
        label: e.name,
        value: e.id,
        category_id: e.category_id,
      })) || [];

    // Lưu toàn bộ sản phẩm vào allProducts
    allProducts.value = [...productsData];

    // Hiển thị tất cả sản phẩm
    products.value = [...allProducts.value];
  } catch (error) {
    $message.error("Không thể tải danh sách sản phẩm");
  } finally {
    loading.value = false;
  }
}

// Hàm kiểm tra và cập nhật danh mục dựa trên sản phẩm đã chọn
function updateCategoriesBasedOnSelectedProducts() {
  if (
    !discountForm.value.applied_products ||
    discountForm.value.applied_products.length === 0
  ) {
    // Nếu không có sản phẩm nào được chọn, bỏ chọn tất cả danh mục
    discountForm.value.applied_category_products = [];
    return;
  }

  // Kiểm tra từng danh mục hiện tại
  const updatedCategories = discountForm.value.applied_category_products.filter(
    (categoryId) => {
      // Lấy tất cả sản phẩm thuộc danh mục này
      const productsInCategory = allProducts.value
        .filter((product) => product.category_id === categoryId)
        .map((product) => product.value);

      // Kiểm tra xem có ít nhất 1 sản phẩm thuộc danh mục này được chọn không
      const hasSelectedProductInCategory = productsInCategory.some(
        (productId) => discountForm.value.applied_products.includes(productId)
      );

      return hasSelectedProductInCategory;
    }
  );

  discountForm.value.applied_category_products = updatedCategories;
}

// Watch để theo dõi thay đổi danh mục đã chọn
watch(
  () => discountForm.value.applied_category_products,
  (newCategories, oldCategories) => {
    if (!oldCategories) oldCategories = [];

    // Tìm danh mục mới được thêm
    const addedCategories = newCategories.filter(
      (cat) => !oldCategories.includes(cat)
    );

    // Tìm danh mục bị xóa
    const removedCategories = oldCategories.filter(
      (cat) => !newCategories.includes(cat)
    );

    // Thêm sản phẩm cho danh mục mới
    if (addedCategories.length > 0) {
      const productsToAdd = allProducts.value
        .filter((product) => addedCategories.includes(product.category_id))
        .map((product) => product.value);

      const currentSelectedProducts = discountForm.value.applied_products || [];
      discountForm.value.applied_products = [
        ...new Set([...currentSelectedProducts, ...productsToAdd]),
      ];
    }

    // Xóa sản phẩm cho danh mục bị bỏ chọn
    if (removedCategories.length > 0) {
      const productsToRemove = allProducts.value
        .filter((product) => removedCategories.includes(product.category_id))
        .map((product) => product.value);

      discountForm.value.applied_products = (
        discountForm.value.applied_products || []
      ).filter((productId) => !productsToRemove.includes(productId));
    }
  },
  { deep: true }
);

// Watch để theo dõi thay đổi sản phẩm đã chọn
watch(
  () => discountForm.value.applied_products,
  () => {
    updateCategoriesBasedOnSelectedProducts();
  },
  { deep: true }
);

async function loadDiscount() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getDiscountById(props.id);
    if (response.data.success) {
      discountForm.value = {
        name: response.data.data.name || "",
        discount_code: response.data.data.discount_code || "",
        start_at: response.data.data.start_at || null,
        end_at: response.data.data.end_at || null,
        type: response.data.data.type || null,
        value_voucher: response.data.data.value_voucher || null,
        maximum_discount: response.data.data.maximum_discount || null,
        condition: response.data.data.condition || null,
        quantity: response.data.data.quantity || null,
        usage_limit:
          response.data.data.usage_limit === 0
            ? 0
            : response.data.data.usage_limit || 0,
        usage_count: response.data.data.usage_count || 1,
        applied_products: response.data.data.applied_products || [],
        applied_category_products:
          response.data.data.applied_category_products || [],
        description: response.data.data.description || "",
      };
      isDisabled.value = response.data.data.status === "ended" || false;
      disabledActive.value =
        response.data.data.status === "active" ||
        response.data.data.status === "stopped" ||
        false;
    }
  } catch (error) {
    $message.error("Không thể tải thông tin mã giảm giá");
    console.error("Load discount error:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadCategories();
  loadProducts();
  if (isEdit.value) {
    loadDiscount();
  }
});

function handleBack() {
  router.push("/discount");
}

async function handleSave() {
  try {
    await formRef.value?.validate();

    loading.value = true;

    const body = {
      ...discountForm.value,
      start_at: discountForm.value.start_at
        ? new Date(discountForm.value.start_at).toISOString()
        : null,
      end_at: discountForm.value.end_at
        ? new Date(discountForm.value.end_at).toISOString()
        : null,
      usage_count:
        discountForm.value.usage_limit === 0
          ? null
          : discountForm.value.usage_count,
    };

    if (isEdit.value) {
      await api.updateDiscount(props.id, body);
      $message.success("Cập nhật mã giảm giá thành công!");
    } else {
      await api.createDiscount(body);
      $message.success("Thêm mã giảm giá thành công!");
    }

    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }

    const errorMessage = isEdit.value
      ? "Cập nhật mã giảm giá thất bại"
      : "Thêm mã giảm giá thất bại";
    $message.error(errorMessage);
    console.error("Save discount error:", error);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 2000);
  }
}

const ONE_DAY_IN_MILLISECOND = 86400000;
const disablePreviousDate = (date) =>
  date < Date.now() - ONE_DAY_IN_MILLISECOND;
const disableEndDate = (date) => {
  const now = dayjs();
  const currentDate = dayjs(date);
  const startDate = discountForm.start_at ? dayjs(discountForm.start_at) : null;

  return startDate
    ? currentDate.isBefore(startDate, "days")
    : currentDate.isBefore(now, "seconds");
};
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handleBack />
    </template>

    <n-card :title="isEdit ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'">
      <n-form :model="discountForm" :rules="rules" ref="formRef">
        <n-grid cols="3" x-gap="16" y-gap="16">
          <n-grid-item span="2">
            <n-form-item label="Tên chương trình giảm giá" path="name">
              <NaiveInput
                v-model:value="discountForm.name"
                placeholder="Nhập tên chương trình giảm giá"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Mã giảm giá" path="discount_code">
              <NaiveInput
                v-model:value="discountForm.discount_code"
                placeholder="Nhập mã giảm giá"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="2">
            <n-form-item label="Thời gian áp dụng" path="date_range">
              <div
                class="flex flex-auto items-center justify-between md:gap-16 gap-8"
              >
                <n-date-picker
                  type="datetime"
                  format="dd/MM/yyyy HH:mm:ss"
                  class="w-full lg:max-w-1/2"
                  :is-date-disabled="disablePreviousDate"
                  v-model:value="startAtTimestamp"
                  placeholder="Thời gian bắt đầu"
                  :disabled="disabledActive || isDisabled"
                />

                <n-date-picker
                  type="datetime"
                  format="dd/MM/yyyy HH:mm:ss"
                  class="w-full lg:max-w-1/2"
                  :is-date-disabled="disableEndDate"
                  v-model:value="endAtTimestamp"
                  placeholder="Thời gian kết thúc"
                  :disabled="isDisabled"
                />
              </div>
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Loại giảm giá" path="type">
              <NaiveSelect
                v-model:value="discountForm.type"
                :options="typeDiscount"
                @update:value="(val) => (discountForm.value_voucher = null)"
                placeholder="Chọn loại giảm giá"
                :disabled="disabledActive || isDisabled"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item v-if="discountForm.type === 'percentage'" span="1">
            <n-form-item label="Giá trị giảm giá" path="value_voucher">
              <NaiveInputNumber
                v-model:value="discountForm.value_voucher"
                :show-button="false"
                :percent="true"
                placeholder="Nhập phần trăm giảm"
                class="w-full"
                :disabled="isDisabled"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item v-if="discountForm.type === 'percentage'" span="1">
            <n-form-item label="" path="maximum_discount">
              <template #label>
                <span>Giảm giá tối đa (ví dụ: giảm 20% tối đa 50k)</span>
                <n-tooltip placement="top" trigger="hover">
                  <template #trigger>
                    <i class="i-fe:info text-16 ml-6 -mb-4 cursor-pointer" />
                  </template>
                  <div
                    style="white-space: pre-line"
                    class="max-w-[320px] md:max-w-[500px] xl:max-w-[700px]"
                  >
                    Giảm giá tối đa là giới hạn số tiền giảm giá theo %, nếu
                    không nhập số tiền tối đa mã giảm giá sẽ giảm theo đúng phần
                    trăm đã chọn, có thể dẫn đến việc giảm giá rất lớn.
                  </div>
                </n-tooltip>
              </template>
              <NaiveInputNumber
                v-model:value="discountForm.maximum_discount"
                :show-button="false"
                placeholder="Nhập số tiền giảm tối đa"
                class="w-full"
                :money="true"
                :disabled="isDisabled"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item v-else span="1">
            <n-form-item label="Giá trị giảm giá" path="value_voucher">
              <NaiveInputNumber
                v-model:value="discountForm.value_voucher"
                :show-button="false"
                placeholder="Nhập số tiền giảm"
                :money="true"
                class="w-full"
                :disabled="isDisabled"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="" path="condition">
              <template #label>
                <span>Điều kiện áp dụng (nếu có)</span>
                <n-tooltip placement="top" trigger="hover">
                  <template #trigger>
                    <i class="i-fe:info text-16 ml-6 -mb-4 cursor-pointer" />
                  </template>
                  <div
                    style="white-space: pre-line"
                    class="max-w-[320px] md:max-w-[500px] xl:max-w-[700px]"
                  >
                    Điều kiện này là giá trị đơn hàng phải khoảng bao nhiêu đó
                    thì mới có thể áp dụng được mã giảm giá. Ví dụ (nhập 100k
                    thì đơn phải từ 100k trở lên mới có thể áp dụng được mã).
                  </div>
                </n-tooltip>
              </template>
              <NaiveInputNumber
                v-model:value="discountForm.condition"
                :show-button="false"
                placeholder="Nhập số tiền tối thiểu mã giảm giá áp dụng"
                class="w-full"
                :money="true"
                :disabled="isDisabled"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Số lượng mã giảm giá" path="quantity">
              <NaiveInputNumber
                v-model:value="discountForm.quantity"
                :show-button="false"
                :max="100"
                placeholder="Nhập số lượng mã giảm giá"
                class="w-full"
                :disabled="isDisabled"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Giới hạn sử dụng" path="usage_limit">
              <NaiveSelect
                v-model:value="discountForm.usage_limit"
                :options="usageLimit"
                :disabled="isDisabled"
                @update-value="
                  (val) => {
                    if (val === 0) {
                      discountForm.usage_count = 1;
                    }
                  }
                "
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item v-if="discountForm.usage_limit === 1" span="1">
            <n-form-item
              label="Số lần sử dụng (tính theo số điện thoại đặt hàng)"
              path="usage_count"
            >
              <NaiveInputNumber
                v-model:value="discountForm.usage_count"
                :show-button="false"
                placeholder="Nhập số lần sử dụng"
                class="w-full"
                :min="1"
                :disabled="isDisabled"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="3">
            <n-form-item>
              <template #label>
                <span>Danh mục sản phẩm áp dụng</span>
                <n-tooltip placement="top" trigger="hover">
                  <template #trigger>
                    <i class="i-fe:info text-16 ml-6 -mb-4 cursor-pointer" />
                  </template>
                  <div
                    style="white-space: pre-line"
                    class="max-w-[320px] md:max-w-[500px] xl:max-w-[700px]"
                  >
                    Chọn danh mục, mã giảm giá sẽ áp dụng cho toàn bộ sản phẩm
                    thuộc danh mục đó. Bạn có thể chọn nhiều danh mục cùng lúc.
                    Nếu không chọn, mã giảm giá sẽ không áp dụng cho danh mục
                    nào!
                  </div>
                </n-tooltip>
              </template>
              <NaiveSelect
                v-model:value="discountForm.applied_category_products"
                :options="categories"
                multiple
                placeholder="Chọn danh mục áp dụng"
                :disabled="isDisabled"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="3">
            <n-form-item>
              <template #label>
                <span>Sản phẩm áp dụng</span>
                <n-tooltip placement="top" trigger="hover">
                  <template #trigger>
                    <i class="i-fe:info text-16 ml-6 -mb-4 cursor-pointer" />
                  </template>
                  <div
                    style="white-space: pre-line"
                    class="max-w-[320px] md:max-w-[500px] xl:max-w-[700px]"
                  >
                    Chọn sản phẩm, mã giảm giá sẽ chỉ áp dụng được cho sản phẩm
                    đã chọn. Bạn có thể chọn nhiều sản phẩm cùng lúc. Nếu không
                    chọn, mã giảm giá sẽ áp dụng cho tất cả sản phẩm.
                  </div>
                </n-tooltip>
              </template>
              <n-select
                v-model:value="discountForm.applied_products"
                :options="products"
                multiple
                placeholder="Áp dụng cho tất cả sản phẩm"
                :disabled="isDisabled"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="3">
            <n-form-item label="Ghi chú" path="description">
              <NaiveInput
                v-model:value="discountForm.description"
                type="textarea"
                placeholder="Nhập mô tả mã giảm giá"
                :disabled="isDisabled"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
      </n-form>

      <template v-if="!isDisabled" #action>
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
