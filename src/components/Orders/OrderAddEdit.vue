<script setup>
defineOptions({ name: "OrderAddEdit" });

const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
});

const router = useRouter();
const userStore = useUserStore();

const isEdit = computed(() => !!props.id);
const products = ref([]);
const loading = ref(false);
const loadingDiscount = ref(false);
const discounts = ref([]);

// New: store selected product ids from the select component
const selectedProductIds = ref([]);
// New: map of product info by id (name, price)
const productsMap = ref({});

const productForm = ref({
  creator_id: userStore.userId,
  creator_name: userStore.username,
  name: "",
  phone: "",
  email: "",
  address: "",
  addresses: [],
  note: "",
  discount_code: null,
  shipping_fee: null,
  status: "new",
  payment_method: "unpaid",
  order_type: "retail",
  product_ids: [],
});

const status = [
  { label: "Đơn hàng mới", value: "new" },
  { label: "Chờ xử lý", value: "pending" },
  { label: "Đang xử lý", value: "processing" },
  { label: "Hoàn thành", value: "completed" },
  { label: "Hủy", value: "canceled" },
];

const statusLabel = computed(() => {
  const s = status.find((o) => o.value === productForm.value.status);
  return s ? s.label : productForm.value.status || "";
});

const paymentsMethod = [
  { label: "Chưa thanh toán", value: "unpaid" },
  { label: "Đã thanh toán", value: "paid" },
];

const rules = {
  creator_name: [
    {
      required: true,
      message: "Không xác định người tạo",
      trigger: ["blur", "input"],
    },
  ],
  name: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const name = String(value || "").trim();
        if (!name) return new Error("Vui lòng nhập tên khách hàng");
        if (name.length < 2)
          return new Error("Tên khách hàng phải có ít nhất 2 ký tự");
        if (name.length > 100)
          return new Error("Tên khách hàng không được quá 100 ký tự");
        return true;
      },
      trigger: ["blur", "input"],
    },
  ],
  phone: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const phone = String(value || "").trim();

        // Kiểm tra nếu trống
        if (!phone) {
          return new Error("Vui lòng nhập số điện thoại");
        }

        // Đầu số hợp lệ của nhà mạng Việt Nam
        const validPrefixes = [
          "032",
          "033",
          "034",
          "035",
          "036",
          "037",
          "038",
          "039", // Viettel
          "070",
          "076",
          "077",
          "078",
          "079", // Mobifone
          "081",
          "082",
          "083",
          "084",
          "085",
          "086", // Vinaphone
          "056",
          "058", // Vietnamobile
          "059", // Gmobile
          "090",
          "093",
          "089",
          "092",
          "094",
          "099",
          "098",
          "097",
          "096",
          "091",
          "095", // các đầu số cũ
        ];

        // Kiểm tra định dạng cơ bản (10 số, bắt đầu bằng 0)
        if (!/^0\d{9}$/.test(phone)) {
          return new Error(
            "Số điện thoại định dạng không chính xác (phải gồm 10 số và bắt đầu bằng 0)"
          );
        }

        // Kiểm tra đầu số hợp lệ
        const prefix = phone.substring(0, 3);
        if (!validPrefixes.includes(prefix)) {
          return new Error(
            "Số điện thoại định dạng không chính xác (đầu số không hợp lệ)"
          );
        }

        return true;
      },
    },
  ],
  email: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const email = String(value || "").trim();

        // Kiểm tra nếu trống
        if (!email) {
          return new Error("Vui lòng nhập email");
        }

        // Kiểm tra định dạng email cơ bản (không chỉ giới hạn @gmail.com)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
          return new Error("Email không đúng định dạng");
        }

        return true;
      },
    },
  ],
  address: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const address = productForm.value.address;
        if (!address) {
          return new Error("Vui lòng nhập địa chỉ");
        }
        if (address.length < 20) {
          return new Error("Địa chỉ phải có ít nhất 20 ký tự");
        }
        if (address.length > 255) {
          return new Error("Địa chỉ không được quá 255 ký tự");
        }
        return true;
      },
    },
  ],
  product_ids: [
    {
      required: true,
      type: "array",
      min: 1,
      trigger: ["blur", "change"],
      validator(rule, value) {
        if (!Array.isArray(value) || value.length === 0) {
          return new Error("Vui lòng chọn ít nhất 1 sản phẩm");
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
  () => productForm.value.name,
  (newName) => {
    if (newName) {
      productForm.value.slug = generateSlug(newName);
    }
  }
);

const formRef = ref(null);
const updateAddressRef = ref(null);

async function loadProducts() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 1000,
    };
    const response = await api.getProducts(params);
    const list = response.data?.data?.products || [];
    products.value = list.map((e) => ({ label: e.name, value: e.id }));
    productsMap.value = {};
    list.forEach((e) => {
      productsMap.value[e.id] = {
        id: e.id,
        name: e.name,
        price: e.price ?? e.sale_price ?? e.unit_price ?? 0,
      };
    });
  } catch (error) {
    $message.error("Không thể tải danh sách đơn hàng");
  } finally {
    loading.value = false;
  }
}

async function loadDiscounts() {
  try {
    loadingDiscount.value = true;
    const params = {
      page: 1,
      length: 1000,
      status: "active",
    };
    const response = await api.getDiscounts(params);
    const list = response.data?.data?.discounts || [];
    discounts.value = list.map((e) => ({ label: e.name, value: e.id }));
  } catch (error) {
    $message.error("Không thể tải mã giảm giá");
  } finally {
    loadingDiscount.value = false;
  }
}

async function loadOrder() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getOrderById(props.id);
    if (response.data.success) {
      const d = response.data.data;
      productForm.value = {
        creator_id: d.creator_id || userStore.userId,
        creator_name: d.creator_name || userStore.username,
        name: d.customer?.name || "",
        phone: d.customer?.phone || "",
        email: d.customer?.email || "",
        addresses: d.addresses?.map((a) => a.address) || [""],
        note: d.info_order?.note || "",
        discount_code: d.discount_code || null,
        shipping_fee: d.shipping_fee || null,
        status: d.status || null,
        payment_method: d.payment_method || null,
        order_type: d.order_type || null,
        product_ids:
          (d.products || []).map((p) => ({
            id: p.product_id ?? p.id,
            name: p.name || p.product_name || "",
            price: p.price ?? p.unit_price ?? 0,
            quantity: p.quantity ?? 1,
          })) || [],
      };

      selectedProductIds.value = productForm.value.product_ids.map((p) => p.id);
    }
  } catch (error) {
    $message.error("Không thể tải thông tin đơn hàng");
    console.error("Load order error:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  // Gán người tạo khi tạo mới
  if (!isEdit.value) {
    productForm.value.creator_id = userStore.userId;
    productForm.value.creator_name = userStore.username;
  }
  await loadProducts();
  await loadDiscounts();
  if (isEdit.value) {
    await loadOrder();
  }
});

watch(
  selectedProductIds,
  (newIds, oldIds) => {
    const prev = productForm.value.product_ids || [];
    const prevMap = {};
    prev.forEach((p) => (prevMap[p.id] = p));

    productForm.value.product_ids = (newIds || []).map((id) => {
      const existing = prevMap[id];
      if (existing) return existing;
      const info = productsMap.value[id] || {};
      return {
        id,
        name: info.name || "",
        price: info.price || 0,
        quantity: 1,
      };
    });
  },
  { deep: true }
);

function handleBack() {
  router.push("/order");
}

function removeProduct(index) {
  productForm.value.product_ids.splice(index, 1);
  selectedProductIds.value = productForm.value.product_ids.map((p) => p.id);
}

function handleAddressChange(val) {
  productForm.value.address = val;
}

async function handleSave() {
  try {
    await formRef.value?.validate();

    if (updateAddressRef.value && !updateAddressRef.value.handleSaveRequest()) {
      return;
    }

    if (
      productForm.value.addresses.length === 0 ||
      !productForm.value.addresses[0].trim()
    ) {
      $message.error("Vui lòng nhập địa chỉ");
      return;
    }

    loading.value = true;
    const productsPayload = (productForm.value.product_ids || []).map((p) => ({
      product_id: p.id,
      quantity: p.quantity || 1,
      price: p.price || 0,
    }));

    const { product_ids, ...rest } = productForm.value;
    const body = {
      ...rest,
      products: productsPayload,
    };

    if (isEdit.value) {
      await api.updateOrder(props.id, body);
      $message.success("Cập nhật đơn hàng thành công!");
    } else {
      await api.createOrder(body);
      $message.success("Thêm đơn hàng thành công!");
    }

    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }

    const errorMessage = isEdit.value
      ? "Cập nhật đơn hàng thất bại"
      : "Thêm đơn hàng thất bại";
    $message.error(errorMessage);
    console.error("Save order error:", error);
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

    <n-card :title="isEdit ? 'Sửa đơn hàng' : 'Thêm đơn hàng'">
      <n-form :model="productForm" :rules="rules" ref="formRef">
        <n-grid cols="3" x-gap="16" y-gap="16">
          <n-grid-item span="1">
            <n-form-item label="Trạng thái" path="status">
              <NaiveInput
                :value="statusLabel"
                readonly
                placeholder="Chọn trạng thái"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Thanh toán" path="payment_method">
              <NaiveSelect
                v-model:value="productForm.payment_method"
                :options="paymentsMethod"
                placeholder="Chọn thanh toán"
              />
            </n-form-item>
          </n-grid-item>

          <!-- <n-grid-item span="1">
            <n-form-item label="Loại đơn" path="order_type">
              <NaiveSelect
                v-model:value="productForm.order_type"
                :options="orderTypes"
                :disabled="isEdit"
                placeholder="Chọn loại đơn"
              />
            </n-form-item> -->

          <n-grid-item span="1">
            <n-form-item label="Người tạo" path="creator_name">
              <NaiveInput
                v-model:value="productForm.creator_name"
                placeholder="Nhập tên người tạo"
                readonly
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Tên khách hàng" path="name">
              <NaiveInput
                v-model:value="productForm.name"
                placeholder="Nhập tên khách hàng"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Số điện thoại" path="phone">
              <NaiveInput
                v-model:value="productForm.phone"
                @input="
                  productForm.phone = $event.replace(/[^\d]/g, '').slice(0, 10)
                "
                :input-props="{
                  inputmode: 'numeric',
                  pattern: '[0-9]*',
                  maxlength: 10,
                }"
                placeholder="Nhập số điện thoại"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Email" path="email">
              <NaiveInput
                v-model:value="productForm.email"
                @input="
                  productForm.email = $event
                    .replace(/[^a-zA-Z0-9@._+\-]/g, '')
                    .slice(0, 254)
                "
                placeholder="Nhập email"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="3">
            <n-form-item label="Địa chỉ" path="address">
              <UpdateAddress
                ref="updateAddressRef"
                :isDisabled="productForm.status !== 'pending' && isEdit"
                :addresses="productForm.addresses"
                @update:addresses="productForm.addresses = $event"
                @input-address-change="handleAddressChange"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="3">
            <n-form-item label="Ghi chú" path="note">
              <NaiveInput
                v-model:value="productForm.note"
                placeholder="Ghi chú"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Mã giảm giá" path="discount_code">
              <NaiveSelect
                v-model:value="productForm.discount_code"
                :options="discounts"
                filterable
                placeholder="Chọn mã giảm giá"
                clearable
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Phí ship" path="shipping_fee">
              <NaiveInputNumber
                v-model:value="productForm.shipping_fee"
                :money="true"
                :show-button="false"
                placeholder="Nhập phí ship"
                class="w-full"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="2">
            <n-form-item label="Chọn sản phẩm" path="product_ids">
              <NaiveSelect
                v-model:value="selectedProductIds"
                :options="products"
                filterable
                placeholder="Chọn sản phẩm"
                multiple
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>

        <n-grid cols="5" x-gap="16" y-gap="16">
          <template v-for="(p, idx) in productForm.product_ids" :key="p.id">
            <n-grid-item :span="2">
              <n-form-item label="Sản phẩm">
                <NaiveInput v-model:value="p.name" readonly />
              </n-form-item>
            </n-grid-item>

            <n-grid-item :span="1">
              <n-form-item label="Số lượng">
                <NaiveInputNumber v-model:value="p.quantity" :min="1" />
              </n-form-item>
            </n-grid-item>

            <n-grid-item :span="2">
              <n-form-item label="Đơn giá">
                <NaiveInputNumber
                  v-model:value="p.price"
                  :money="true"
                  :show-button="false"
                  class="mr-16"
                  readonly
                />
                <n-button type="error" @click.prevent="removeProduct(idx)"
                  >Xoá</n-button
                >
              </n-form-item>
            </n-grid-item>
          </template>
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
