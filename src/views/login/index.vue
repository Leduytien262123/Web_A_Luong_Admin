<template>
  <div
    class="wh-full flex-col bg-[url(@/assets/images/login_bg.webp)] bg-cover"
  >
    <div
      class="m-auto max-w-700 min-w-345 f-c-c rounded-8 auto-bg bg-opacity-20 bg-cover p-12 card-shadow"
    >
      <div class="hidden w-380 px-20 py-35 md:block">
        <img
          src="@/assets/images/login_banner.webp"
          class="w-full"
          alt="login_banner"
        >
      </div>

      <div class="w-320 flex-col px-20 py-32">
        <h2 class="f-c-c text-24 text-#6a6a6a font-normal">
          <img
            src="@/assets/images/logo.png"
            class="mr-12 h-50"
          >
          {{ title }}
        </h2>
        <n-input
          v-model:value="loginInfo.username"
          autofocus
          class="mt-32 h-40 items-center"
          placeholder="Vui lòng nhập tên người dùng"
          :maxlength="20"
        >
          <template #prefix>
            <i class="i-fe:user mr-12 opacity-20" />
          </template>
        </n-input>
        <n-input
          v-model:value="loginInfo.password"
          class="mt-20 h-40 items-center"
          type="password"
          show-password-on="mousedown"
          placeholder="Vui lòng nhập mật khẩu"
          :maxlength="20"
          @keydown.enter="handleLogin()"
        >
          <template #prefix>
            <i class="i-fe:lock mr-12 opacity-20" />
          </template>
        </n-input>

        <div class="mt-20 flex items-center">
          <n-input
            v-model:value="loginInfo.captcha"
            class="h-40 items-center"
            placeholder="Vui lòng nhập mã xác thực"
            :maxlength="4"
            @keydown.enter="handleLogin()"
          >
            <template #prefix>
              <i class="i-fe:key mr-12 opacity-20" />
            </template>
          </n-input>
          <img
            v-if="captchaUrl"
            :src="captchaUrl"
            alt="Mã xác thực"
            height="40"
            class="ml-12 w-80 cursor-pointer"
            @click="initCaptcha"
          >
        </div>

        <n-checkbox
          class="mt-20"
          :checked="isRemember"
          label="Ghi nhớ đăng nhập"
          :on-update:checked="(val) => (isRemember = val)"
        />

        <div class="mt-20 flex items-center">
          <n-button
            class="h-40 flex-1 rounded-5 text-16"
            type="primary"
            ghost
            @click="quickLogin()"
          >
            Trải nghiệm nhanh
          </n-button>

          <n-button
            class="ml-32 h-40 flex-1 rounded-5 text-16"
            type="primary"
            :loading="loading"
            @click="handleLogin()"
          >
            Đăng nhập
          </n-button>
        </div>
      </div>
    </div>

    <TheFooter class="py-12" />
  </div>
</template>

<script setup>
import { useStorage } from "@vueuse/core";
import { useAuthStore } from "@/store";
import { lStorage, throttle } from "@/utils";
import api from "./api";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const title = import.meta.env.VITE_TITLE;

const loginInfo = ref({
  username: "",
  password: "",
});

const captchaUrl = ref("");

const initCaptcha = throttle(() => {
  const timestamp = Date.now();
  const randomParam = Math.random().toString(36).substring(2, 15);

  captchaUrl.value = `https://mock.apipark.cn/m1/3776410-0-default/auth/captcha?_t=${timestamp}&_r=${randomParam}`;
}, 500);

const localLoginInfo = lStorage.get("loginInfo");
if (localLoginInfo) {
  loginInfo.value.username = localLoginInfo.username || "";
  loginInfo.value.password = localLoginInfo.password || "";
}
initCaptcha();

function quickLogin() {
  loginInfo.value.username = "superadmin";
  loginInfo.value.password = "password";
  handleLogin(true);
}

const isRemember = useStorage("isRemember", true);
const loading = ref(false);
async function handleLogin(isQuick) {
  const { username, password, captcha } = loginInfo.value;
  if (!username || !password)
    return $message.warning("Vui lòng nhập tên người dùng và mật khẩu");
  if (!isQuick && !captcha)
    return $message.warning("Vui lòng nhập mã xác thực");

  try {
    loading.value = true;
    $message.loading("Đang xác thực, vui lòng đợi...", { key: "login" });

    const response = await api.login({
      username,
      password: password.toString(),
    });

    let loginData = null;

    if (response?.data?.success) {
      loginData = response?.data;
    }

    if (loginData && loginData.success) {
      if (isRemember.value) {
        lStorage.set("loginInfo", { username, password });
      } else {
        lStorage.remove("loginInfo");
      }
      onLoginSuccess(loginData);
    } else {
      throw new Error(
        "Không thể xử lý response từ server. Vui lòng kiểm tra console để biết chi tiết."
      );
    }
  } catch (error) {
    initCaptcha();
    loginInfo.value.captcha = "";

    $message.destroy("login");

    let errorMessage = "Đăng nhập thất bại";
    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.statusText ||
        errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    $message.error(errorMessage);
  }
  loading.value = false;
}

async function onLoginSuccess(data = {}) {
  const tokenSaved = authStore.setToken(data);

  if (!tokenSaved) {
    $message.error("Lỗi khi lưu token đăng nhập");
    return;
  }

  $message.loading("Đang đăng nhập...", { key: "login" });
  try {
    $message.success("Đăng nhập thành công", { key: "login" });

    const redirectPath = route.query.redirect || "/";
    delete route.query.redirect;

    if (redirectPath && redirectPath !== "/login") {
      router.push(redirectPath);
    } else {
      router.push("/");
    }
  } catch (error) {
    console.error(error);
    $message.destroy("login");
  }
}
</script>
