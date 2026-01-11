<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div id="user-dropdown" class="flex cursor-pointer items-center">
      <n-avatar
        round
        :size="36"
        :src="userStore.avatar?.[0]?.url || userEmpty"
      />
      <div
        v-if="userStore.userInfo"
        class="ml-12 flex-col flex-shrink-0 items-center"
      >
        <span class="text-14">{{
          userStore.nickName ?? userStore.username
        }}</span>
        <span class="text-12 opacity-50"
          >[{{ userStore.currentRole?.name }}]</span
        >
      </div>
    </div>
  </n-dropdown>

  <RoleSelect ref="roleSelectRef" />
</template>

<script setup>
import userEmpty from "@/public/img/user_empty.jpg";
import { RoleSelect } from "@/layouts/components";
import { useAuthStore, usePermissionStore, useUserStore } from "@/store";

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const permissionStore = usePermissionStore();

const options = reactive([
  {
    label: "Thông tin cá nhân",
    key: "profile",
    icon: () => h("i", { class: "i-material-symbols:person-outline text-14" }),
    // show: computed(() => permissionStore.accessRoutes?.some(item => item.path === '/profile')),
  },
  // {
  // label: 'Chuyển vai trò',
  // key: 'toggleRole',
  // icon: () => h('i', { class: 'i-basil:exchange-solid text-14' }),
  // show: computed(() => userStore.roles.length > 1),
  // },
  {
    label: "Đăng xuất",
    key: "logout",
    icon: () => h("i", { class: "i-mdi:exit-to-app text-14" }),
  },
]);

const roleSelectRef = ref(null);
function handleSelect(key) {
  switch (key) {
    case "profile":
      router.push("/profile");
      break;
    case "toggleRole":
      roleSelectRef.value?.open({
        onOk() {
          location.reload();
        },
      });
      break;
    case "logout":
      $dialog.confirm({
        title: "Thông báo",
        type: "info",
        content: "Xác nhận đăng xuất?",
        async confirm() {
          authStore.logout();
          $message.success("Đã đăng xuất");
        },
      });
      break;
  }
}
</script>
