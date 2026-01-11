<template>
  <AppPage show-footer>
    <n-card>
      <n-space align="center">
        <n-avatar
          round
          :size="100"
          :src="userStore?.avatar?.[0]?.url || 'userEmpty'"
        />
        <div class="ml-20">
          <div class="flex items-center text-16">
            <span>Tên người dùng:</span>
            <span class="ml-12 opacity-80">{{ userStore.username }}</span>
            <n-button
              class="ml-32"
              type="primary"
              text
              @click="pwdModalRef.open()"
            >
              <i class="i-fe:edit mr-4" />
              Sửa mật khẩu
            </n-button>
          </div>
          <div class="mt-16 flex items-center">
            <n-button type="primary" ghost @click="avatarModalRef.open()">
              Thay đổi avatar
            </n-button>
            <span class="ml-12 opacity-60">
              Thay đổi avatar chỉ hỗ trợ liên kết trực tuyến, không cung cấp
              chức năng tải lên hình ảnh, nếu cần có thể tự tích hợp!
            </span>
          </div>
        </div>
      </n-space>
    </n-card>

    <n-card class="mt-20" title="Thông tin cá nhân">
      <template #header-extra>
        <n-button type="primary" text @click="profileModalRef.open()">
          <i class="i-fe:edit mr-4" />
          Sửa thông tin
        </n-button>
      </template>

      <n-descriptions
        label-placement="left"
        :label-style="{ width: '200px', textAlign: 'center' }"
        :column="1"
        bordered
      >
        <n-descriptions-item label="Biệt danh">
          {{ userStore.nickName }}
        </n-descriptions-item>
        <n-descriptions-item label="Giới tính">
          {{
            genders.find((item) => item.value === userStore.userInfo?.gender)
              ?.label ?? "Không xác định"
          }}
        </n-descriptions-item>
        <n-descriptions-item label="Địa chỉ">
          {{ userStore.userInfo?.address }}
        </n-descriptions-item>
        <n-descriptions-item label="Email">
          {{ userStore.userInfo?.email }}
        </n-descriptions-item>
      </n-descriptions>
    </n-card>

    <MeModal
      ref="avatarModalRef"
      width="420px"
      title="Thay đổi avatar"
      @ok="handleAvatarSave()"
    >
      <n-input v-model:value="newAvatar" />
    </MeModal>

    <MeModal
      ref="pwdModalRef"
      title="Sửa mật khẩu"
      width="420px"
      @ok="handlePwdSave()"
    >
      <n-form
        ref="pwdFormRef"
        :model="pwdForm"
        label-placement="left"
        require-mark-placement="left"
      >
        <n-form-item label="Mật khẩu cũ" path="oldPassword" :rule="required">
          <n-input
            v-model:value="pwdForm.oldPassword"
            type="password"
            placeholder="Vui lòng nhập mật khẩu cũ"
            show-password-on="mousedown"
          />
        </n-form-item>
        <n-form-item label="Mật khẩu mới" path="newPassword" :rule="required">
          <n-input
            v-model:value="pwdForm.newPassword"
            type="password"
            placeholder="Vui lòng nhập mật khẩu mới"
            show-password-on="mousedown"
          />
        </n-form-item>
      </n-form>
    </MeModal>

    <MeModal
      ref="profileModalRef"
      title="Sửa thông tin"
      width="420px"
      @ok="handleProfileSave()"
    >
      <n-form ref="profileFormRef" :model="profileForm" label-placement="left">
        <n-form-item label="Biệt danh" path="nickName">
          <n-input
            v-model:value="profileForm.nickName"
            placeholder="Vui lòng nhập biệt danh"
          />
        </n-form-item>
        <n-form-item label="Giới tính" path="gender">
          <n-select
            v-model:value="profileForm.gender"
            :options="genders"
            placeholder="Vui lòng chọn giới tính"
          />
        </n-form-item>
        <n-form-item label="Địa chỉ" path="address">
          <n-input
            v-model:value="profileForm.address"
            placeholder="Vui lòng nhập địa chỉ"
          />
        </n-form-item>
        <n-form-item label="Email" path="email">
          <n-input
            v-model:value="profileForm.email"
            placeholder="Vui lòng nhập email"
          />
        </n-form-item>
      </n-form>
    </MeModal>
  </AppPage>
</template>

<script setup>
import userEmpty from "@/public/img/user_empty.jpg";
import { MeModal } from "@/components";
import { useForm, useModal } from "@/composables";
import { useUserStore } from "@/store";
import { getUserInfo } from "@/store/helper";
import api from "./api";

const userStore = useUserStore();
const required = {
  required: true,
  message: "Đây là trường bắt buộc",
  trigger: ["blur", "change"],
};

const [pwdModalRef] = useModal();
const [pwdFormRef, pwdForm, pwdValidation] = useForm();

async function handlePwdSave() {
  await pwdValidation();
  await api.changePassword(pwdForm.value);
  $message.success("Sửa mật khẩu thành công");
  refreshUserInfo();
}

const newAvatar = ref(userStore.avatar);
const [avatarModalRef] = useModal();
async function handleAvatarSave() {
  if (!newAvatar.value) {
    $message.error("Vui lòng nhập địa chỉ avatar");
    return false;
  }
  await api.updateProfile({ id: userStore.userId, avatar: newAvatar.value });
  $message.success("Sửa avatar thành công");
  refreshUserInfo();
}

const genders = [
  { label: "Bí mật", value: 0 },
  { label: "Nam", value: 1 },
  { label: "Nữ", value: 2 },
];
const [profileModalRef] = useModal();
const [profileFormRef, profileForm, profileValidation] = useForm({
  id: userStore.userId,
  nickName: userStore.nickName,
  gender: userStore.userInfo?.gender ?? 0,
  address: userStore.userInfo?.address,
  email: userStore.userInfo?.email,
});
async function handleProfileSave() {
  await profileValidation();
  await api.updateProfile(profileForm.value);
  $message.success("Sửa thông tin thành công");
  refreshUserInfo();
}

async function refreshUserInfo() {
  const user = await getUserInfo();
  userStore.setUser(user);
}
</script>
