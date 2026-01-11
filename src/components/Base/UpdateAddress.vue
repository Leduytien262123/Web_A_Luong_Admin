<script setup>
const props = defineProps({
  addresses: {
    type: Array,
    default: () => [""],
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:addresses", "input-address-change"]);

const $message = useMessage();
const optionAddress = ref([]);
const selectedAddressIndex = ref(0);
const currentInputAddress = ref("");
const originalSelectedAddress = ref("");
const isAddingNewAddress = ref(false);
const isAddAddress = ref(false);

const safeAddresses = computed(() =>
  Array.isArray(props.addresses) ? props.addresses : []
);

const isDisabled = computed(() => props.isDisabled);

watch(
  [() => safeAddresses.value, () => isAddAddress.value],
  ([val, isAdd]) => {
    updateAddressOptions();
    if (val.length > 0) {
      selectedAddressIndex.value = 0;
      currentInputAddress.value = val[0];
      originalSelectedAddress.value = val[0];
      if (isAdd) {
        currentInputAddress.value = "";
        originalSelectedAddress.value = "";
        emit("input-address-change", "");
        return;
      } else {
        emit("input-address-change", val[0]);
      }
    }
  },
  { immediate: true }
);

watch(optionAddress, (newOptions) => {
  if (newOptions.length === 0) {
    isAddingNewAddress.value = true;
    currentInputAddress.value = "";
    originalSelectedAddress.value = "";
    emit("input-address-change", "");
  }
});

function updateAddressOptions() {
  optionAddress.value = safeAddresses.value
    .filter((addr) => addr.trim() !== "")
    .map((item, idx) => ({ label: item, value: idx }));
}

function handleAddressSelect(val) {
  selectedAddressIndex.value = val;
  currentInputAddress.value = safeAddresses.value[val];
  originalSelectedAddress.value = safeAddresses.value[val];
  isAddingNewAddress.value = false;
  emit("input-address-change", safeAddresses.value[val]);
}

function handleInputAddressChange(val) {
  currentInputAddress.value = val;
  emit("input-address-change", val);
}

function startAddingNewAddress() {
  isAddAddress.value = true;
  isAddingNewAddress.value = true;
  currentInputAddress.value = "";
  originalSelectedAddress.value = "";
  emit("input-address-change", "");
}

function addNewAddress() {
  const trimmedAddress = currentInputAddress.value.trim();
  if (safeAddresses.value.includes(trimmedAddress)) {
    $message.error("Địa chỉ này đã tồn tại");
    return;
  }
  // Thêm địa chỉ mới lên đầu danh sách
  const newAddresses = [trimmedAddress, ...safeAddresses.value];
  selectedAddressIndex.value = 0; // Tự động chọn địa chỉ mới vừa thêm
  originalSelectedAddress.value = trimmedAddress;
  isAddingNewAddress.value = false;
  $message.success("Thêm địa chỉ thành công");
  isAddAddress.value = false;
  emit("update:addresses", newAddresses);
  updateAddressOptions();
}

function updateAddress() {
  const trimmedAddress = currentInputAddress.value.trim();
  const currentIndex = selectedAddressIndex.value;
  const isDuplicate = safeAddresses.value.some(
    (addr, idx) => idx !== currentIndex && addr === trimmedAddress
  );
  if (isDuplicate) {
    $message.error("Địa chỉ này đã tồn tại");
    return;
  }
  const newAddresses = [...safeAddresses.value];
  newAddresses[currentIndex] = trimmedAddress;
  originalSelectedAddress.value = trimmedAddress;
  $message.success("Cập nhật địa chỉ thành công");
  emit("update:addresses", newAddresses);
  updateAddressOptions();
}

function removeAddress() {
  if (safeAddresses.value.length <= 1) {
    $message.error("Phải có ít nhất một địa chỉ");
    return;
  }
  const currentIndex = selectedAddressIndex.value;
  const newAddresses = [...safeAddresses.value];
  newAddresses.splice(currentIndex, 1);
  selectedAddressIndex.value = 0;
  currentInputAddress.value = newAddresses[0] || "";
  originalSelectedAddress.value = newAddresses[0] || "";
  $message.success("Xoá địa chỉ thành công");
  emit("update:addresses", newAddresses);
  updateAddressOptions();
}

const canUpdate = computed(() => {
  return (
    !isAddingNewAddress.value &&
    currentInputAddress.value.trim() !== "" &&
    currentInputAddress.value.trim() !== originalSelectedAddress.value
  );
});

function cancelAddAddress() {
  isAddingNewAddress.value = false;
  isAddAddress.value = false;
  currentInputAddress.value =
    safeAddresses.value[selectedAddressIndex.value] || "";
  originalSelectedAddress.value =
    safeAddresses.value[selectedAddressIndex.value] || "";
}

function handleSaveRequest() {
  if (isAddingNewAddress.value) {
    if (
      !currentInputAddress.value ||
      currentInputAddress.value.trim().length < 20
    ) {
      emit("input-address-change", currentInputAddress.value);
      return false;
    }
    $message.error(
      "Vui lòng nhấn 'Thêm địa chỉ' để xác nhận địa chỉ mới trước khi lưu"
    );
    return false;
  }
  if (canUpdate.value) {
    $message.error("Vui lòng xác nhận cập nhật địa chỉ trước khi lưu");
    return false;
  }
  return true;
}

// Expose method cho component cha có thể gọi
defineExpose({
  handleSaveRequest,
});

watch(
  () => optionAddress.value,
  (newAddresses) => {
    if (newAddresses.length === 0) {
      selectedAddressIndex.value = null;
    }
  }
);
</script>

<template>
  <div class="flex flex-col w-full gap-16">
    <div v-if="!isAddingNewAddress" class="flex gap-16">
      <NaiveSelect
        :value="optionAddress.length === 0 ? null : selectedAddressIndex"
        :options="optionAddress"
        placeholder="Chọn địa chỉ"
        @update:value="handleAddressSelect"
        :disabled="isDisabled"
      />
      <n-button type="primary" @click="startAddingNewAddress"
        >Thêm mới</n-button
      >
    </div>
    <div class="flex gap-16">
      <NaiveInput
        v-model:value="currentInputAddress"
        @update:value="handleInputAddressChange"
        placeholder="Nhập địa chỉ"
        clearable
        :disabled="isDisabled"
      />
      <n-button
        v-if="isAddingNewAddress"
        type="primary"
        @click="addNewAddress"
        :disabled="currentInputAddress.length < 20 || isDisabled"
        >Thêm địa chỉ</n-button
      >
      <n-button
        v-if="!isAddingNewAddress"
        type="primary"
        @click="updateAddress"
        :disabled="!canUpdate || isDisabled"
        >Cập nhật địa chỉ</n-button
      >
      <n-button
        v-if="!isAddingNewAddress"
        type="error"
        @click="removeAddress"
        :disabled="safeAddresses.length <= 1 || isDisabled"
        >Xoá địa chỉ</n-button
      >
      <n-button v-if="isAddingNewAddress" @click="cancelAddAddress"
        >Hủy</n-button
      >
    </div>
  </div>
</template>
