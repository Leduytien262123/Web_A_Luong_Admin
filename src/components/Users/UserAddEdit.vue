<script setup>
defineOptions({ name: "UserAddEdit" });

const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
});

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const context = computed(() => {
  if (route.path.includes("staff")) return "nhân sự";
  if (route.path.includes("user")) return "người dùng";
});
const isEdit = computed(() => !!props.id);
const loading = ref(false);
const fileList = ref([]);

const emit = defineEmits(["update:avatar"]);

const formValue = ref({
  role: null,
  creator_id: userStore.userId,
  creator_name: userStore.username,
  username: "",
  full_name: "",
  phone: "",
  email: "",
  password: "Admin123456a@",
  is_active: true,
  address: "",
  addresses: [""],
});

const rules = {
  creator_name: [
    {
      required: true,
      message: "Không xác định người tạo",
      trigger: ["blur", "input"],
    },
  ],
  full_name: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const name = String(value || "").trim();
        if (!name) return new Error(`Vui lòng nhập tên ${context.value}`);
        if (name.length < 10)
          return new Error(`Tên ${context.value} phải có ít nhất 10 ký tự`);
        if (name.length > 100)
          return new Error(`Tên ${context.value} không được quá 100 ký tự`);
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

        // Đầu số hợp lệ của nhà mạng Việt Nam (kiểm tra khi dùng định dạng 0xxxxxxxxx)
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

        // Cho phép 2 dạng: bắt đầu bằng 0 (10 chữ số) hoặc bắt đầu bằng +84 (theo sau là 9 chữ số)
        if (!/^0\d{9}$/.test(phone) && !/^\+84\d{9}$/.test(phone)) {
          return new Error(
            "Số điện thoại định dạng không chính xác (ví dụ: 0912345678 hoặc +84912345678)",
          );
        }

        // Nếu dùng định dạng 0XXXXXXXXX thì kiểm tra đầu số
        if (phone.startsWith("0")) {
          const prefix = phone.substring(0, 3);
          if (!validPrefixes.includes(prefix)) {
            return new Error(
              "Số điện thoại định dạng không chính xác (đầu số không hợp lệ)",
            );
          }
        }

        return true;
      },
    },
  ],
  username: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const v = String(value || "").trim();
        if (!v) return new Error("Vui lòng nhập tên đăng nhập");
        if (v.length < 3)
          return new Error("Tên đăng nhập phải có ít nhất 3 ký tự");
        if (v.length > 30)
          return new Error("Tên đăng nhập không được quá 30 ký tự");
        if (!/^[a-zA-Z0-9._-]+$/.test(v))
          return new Error(
            "Tên đăng nhập chỉ chứa chữ, số, dấu chấm, gạch dưới hoặc gạch ngang",
          );
        return true;
      },
    },
  ],
  password: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const pw = String(value || "");
        if (!pw) return new Error("Vui lòng nhập mật khẩu");
        if (pw.length < 8) return new Error("Mật khẩu phải có ít nhất 8 ký tự");
        // Ít nhất một chữ cái và một chữ số
        if (!/(?=.*[A-Za-z])(?=.*\d)/.test(pw))
          return new Error(
            "Mật khẩu phải chứa ít nhất một chữ cái và một chữ số",
          );
        return true;
      },
    },
  ],
  confirm_password: [
    {
      required: isEdit.value,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const pw = formValue.value.password || "";
        const cpw = String(value || "");
        if (isEdit.value && !cpw) {
          return new Error("Vui lòng nhập lại mật khẩu");
        }
        if (pw !== cpw) {
          return new Error("Mật khẩu nhập lại không khớp");
        }
        return true;
      },
    },
  ],
  role: [
    {
      required: true,
      trigger: ["blur", "change"],
      message: "Vui lòng chọn phân quyền",
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
        const address = formValue.value.address;
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
  },
);

const formRef = ref(null);
const updateAddressRef = ref(null);
const showChangePassword = ref(false);
const cpFormRef = ref(null);
const changePassword = ref({ password: "", confirm_password: "" });

const cpRules = {
  password: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const pw = String(value || "");
        if (!pw) return new Error("Vui lòng nhập mật khẩu mới");
        if (pw.length < 8) return new Error("Mật khẩu phải có ít nhất 8 ký tự");
        if (!/(?=.*[A-Za-z])(?=.*\d)/.test(pw))
          return new Error(
            "Mật khẩu phải chứa ít nhất một chữ cái và một chữ số",
          );
        return true;
      },
    },
  ],
  confirm_password: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const pw = changePassword.value.password || "";
        const cpw = String(value || "");
        if (!cpw) return new Error("Vui lòng nhập lại mật khẩu");
        if (pw !== cpw) return new Error("Mật khẩu nhập lại không khớp");
        return true;
      },
    },
  ],
};

async function loadUser() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getUserById(props.id);
    if (response.data.success) {
      const d = response.data.data;
      formValue.value = {
        role: d.role || null,
        username: d.username || "",
        creator_id: d.creator_id,
        creator_name: d.creator_name,
        full_name: d.full_name || "",
        phone: d.phone || "",
        email: d.email || "",
        is_active: d.is_active !== undefined ? d.is_active : true,
        addresses: d.addresses?.map((a) => a.address) || [""],
      };

      if (d?.avatar && Array.isArray(d.avatar) && d.avatar.length > 0) {
        fileList.value = d.avatar.map((img, idx) => ({
          url: img.url || "",
          alt: img.alt || "",
          uid: `init-${idx}`,
          name: img.alt || "avatar",
          status: "finished",
        }));
      } else {
        fileList.value = [];
      }
    }
  } catch (error) {
    $message.error(`Không thể tải thông tin ${context.value}`);
    console.error("Load order error:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  // Gán người tạo khi tạo mới
  if (!isEdit.value) {
    formValue.value.creator_id = userStore.userId;
    formValue.value.creator_name = userStore.username;
  }
  if (isEdit.value) {
    loadUser();
  }
});

function handleBack() {
  if (route.path.includes("staff")) {
    return router.push("/staff");
  } else return router.push("/user");
}

async function handleSave() {
  try {
    await formRef.value?.validate();

    // if (
    //   userStore.role !== "owner" &&
    //   updateAddressRef.value &&
    //   !updateAddressRef.value.handleSaveRequest()
    // ) {
    //   return;
    // }

    // if (
    //   userStore.role !== "owner" &&
    //   (formValue.value.addresses.length === 0 ||
    //     !formValue.value.addresses[0].trim())
    // ) {
    //   $message.error("Vui lòng nhập địa chỉ");
    //   return;
    // }

    loading.value = true;

    const body = {
      username: formValue.value.username,
      email: formValue.value.email,
      password: formValue.value.password,
      role: formValue.value.role,
      full_name: formValue.value.full_name,
      phone: formValue.value.phone,
      avatar: fileList.value.map((file) => ({
        url: file.url || "",
        alt: file.alt || "",
      })),
      is_active: !!formValue.value.is_active,
    };

    if (isEdit.value) {
      await api.updateUser(props.id, body);
      $message.success(`Cập nhật ${context.value} thành công!`);
    } else {
      await api.createUser(body);
      $message.success(`Thêm ${context.value} thành công!`);
    }

    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }

    const errorMessage = isEdit.value
      ? `Cập nhật ${context.value} thất bại`
      : `Thêm ${context.value} thất bại`;
    $message.error(errorMessage);
    console.error("Save order error:", error);
  } finally {
    loading.value = false;
  }
}

function handleInput() {
  if (formValue.value.full_name) {
    formValue.value.full_name = formValue.value.full_name
      .trim()
      .replace(/\s+/g, " ");
  }
}

function handleAddressChange(val) {
  formValue.value.address = val;
}

function handleUploadSuccess(file) {
  const imageObj = {
    url: file.url || "",
    alt: file.alt || file.name || "",
    uid: file.uid,
    name: file.name || file.alt || "",
    status: "finished",
  };
  emit("update:avatar", [imageObj]);
  fileList.value = [imageObj];
}

// Xử lý khi xóa file
function handleRemove() {
  emit("update:avatar", []);
  fileList.value = [];
  formValue.value.avatar = null;
}

function handleUpdateFileList(newFileList) {
  fileList.value = newFileList;
  if (newFileList.length === 0) {
    emit("update:avatar", []);
  } else {
    emit("update:avatar", newFileList);
  }
}

async function submitChangePassword() {
  try {
    await cpFormRef.value?.validate();
    loading.value = true;
    const payload = { password: changePassword.value.password };
    if (isEdit.value && props.id) {
      await api.resetUserPassword(props.id, payload);
    } else {
      await api.changePassword(payload);
    }
    $message.success("Đổi mật khẩu thành công");
    showChangePassword.value = false;
    changePassword.value.password = "";
    changePassword.value.confirm_password = "";
  } catch (err) {
    if (err?.errors) return;
    $message.error("Đổi mật khẩu thất bại");
    console.error("Change password error:", err);
  } finally {
    loading.value = false;
  }
}

function cancelChangePassword() {
  showChangePassword.value = false;
  changePassword.value.password = "";
  changePassword.value.confirm_password = "";
}
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handle-back />
    </template>

    <n-card :title="isEdit ? `Sửa ${context}` : `Thêm ${context}`">
      <n-form ref="formRef" :model="formValue" :rules="rules">
        <n-grid cols="3" x-gap="16" y-gap="16">
          <n-grid-item span="1">
            <n-form-item label="Tên đăng nhập" path="username">
              <NaiveInput
                v-model:value="formValue.username"
                placeholder="Nhập tên đăng nhập"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item :label="`Tên ${context}`" path="full_name">
              <NaiveInput
                v-model:value="formValue.full_name"
                :placeholder="`Nhập tên ${context}`"
                @blur="handleInput"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Số điện thoại" path="phone">
              <NaiveInput
                v-model:value="formValue.phone"
                placeholder="Nhập số điện thoại (ví dụ: +84123456789)"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Email" path="email">
              <NaiveInput
                v-model:value="formValue.email"
                placeholder="Nhập email"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Phân quyền" path="role">
              <NaiveSelect
                v-model:value="formValue.role"
                :options="[{ label: 'Admin', value: 'admin' }]"
                placeholder="Chọn phân quyền"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item v-if="!isEdit" span="1">
            <n-form-item label="Mật khẩu" path="password">
              <NaiveInput
                v-model:value="formValue.password"
                placeholder="Nhập mật khẩu"
                type="password"
                show-password-on="mousedown"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Hoạt động" path="is_active">
              <n-switch v-model:value="formValue.is_active" />
            </n-form-item>
          </n-grid-item>

          <n-grid-item v-if="isEdit" span="3">
            <n-button type="primary" @click="showChangePassword = true"
              >Đổi mật khẩu</n-button
            >
          </n-grid-item>

          <!-- <n-grid-item v-if="isEdit" span="1">
            <n-form-item label="Mật khẩu" path="password">
              <NaiveInput
                v-model:value="formValue.password"
                placeholder="Nhập mật khẩu"
                type="password"
                show-password-on="mousedown"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item v-if="isEdit" span="1">
            <n-form-item label="Nhập lại mật khẩu" path="confirm_password">
              <NaiveInput
                v-model:value="formValue.confirm_password"
                placeholder="Nhập lại mật khẩu"
                type="password"
                show-password-on="mousedown"
              />
            </n-form-item>
          </n-grid-item> -->

          <!-- <n-grid-item span="3">
            <n-form-item
              label="Địa chỉ"
              :path="formValue.role === 'owner' ? '' : 'address'"
            >
              <UpdateAddress
                ref="updateAddressRef"
                :addresses="formValue.addresses"
                @update:addresses="formValue.addresses = $event"
                @input-address-change="handleAddressChange"
              />
            </n-form-item>
          </n-grid-item> -->

          <n-grid-item span="3">
            <n-form-item label="Chọn ảnh đại diện" path="avatar">
              <!-- <NaiveUpload
                :file-list="avatar"
                @update:file-list="emit('update:avatar', $event)"
                :max="1"
                list-type="image-card"
              /> -->
              <NaiveUpload
                :file-list="fileList"
                :max="1"
                list-type="image-card"
                @update:file-list="handleUpdateFileList"
                @upload-success="handleUploadSuccess"
                @remove="handleRemove"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
      </n-form>

      <n-modal v-model:show="showChangePassword">
        <div class="p-[24px] w-[480px] rounded-xl bg-white">
          <h3 class="text-[16px] mb-4">Đổi mật khẩu</h3>
          <n-form ref="cpFormRef" :model="changePassword" :rules="cpRules">
            <n-form-item label="Mật khẩu mới" path="password">
              <NaiveInput
                v-model:value="changePassword.password"
                type="password"
                placeholder="Nhập mật khẩu mới"
                show-password-on="mousedown"
              />
            </n-form-item>
            <n-form-item label="Nhập lại mật khẩu" path="confirm_password">
              <NaiveInput
                v-model:value="changePassword.confirm_password"
                type="password"
                placeholder="Nhập lại mật khẩu"
                show-password-on="mousedown"
              />
            </n-form-item>
          </n-form>
          <div class="flex justify-end gap-3 mt-4">
            <n-button @click="cancelChangePassword">Hủy</n-button>
            <n-button type="primary" @click="submitChangePassword"
              >Cập nhật</n-button
            >
          </div>
        </div>
      </n-modal>

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
