<template>
  <n-menu
    ref="menuRef"
    class="side-menu"
    accordion
    :indent="18"
    :collapsed-icon-size="22"
    :collapsed-width="64"
    :collapsed="appStore.collapsed"
    :options="menuOptions"
    :value="activeKey"
    @update:value="handleMenuSelect"
  />
</template>

<script setup>
import { useAppStore, usePermissionStore } from "@/store";
import { isExternal } from "@/utils";

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const permissionStore = usePermissionStore();

const menuRef = ref(null);
const activeKey = computed(() => {
  // Nếu có parentKey trong route meta, sử dụng nó
  if (route.meta?.parentKey) return route.meta.parentKey;

  // Nếu có key trong route meta, sử dụng nó
  if (route.meta?.key) return route.meta.key;

  // Tìm menu phù hợp dựa trên path
  const currentPath = route.path;

  // Kiểm tra từng menu item để tìm menu phù hợp
  function findMatchingMenu(options) {
    for (const item of options) {
      if (item.path) {
        // Kiểm tra exact match hoặc path bắt đầu với menu path
        if (
          currentPath === item.path ||
          currentPath.startsWith(item.path + "/")
        ) {
          return item.key;
        }
      }

      // Kiểm tra trong children
      if (item.children) {
        for (const child of item.children) {
          if (child.path) {
            if (
              currentPath === child.path ||
              currentPath.startsWith(child.path + "/")
            ) {
              return child.key;
            }
          }
        }
      }
    }
    return null;
  }

  const matchedKey = findMatchingMenu(menuOptions.value);
  if (matchedKey) return matchedKey;

  // Fallback về route name
  return route.name;
});

// Cấu trúc menu đúng format cho Naive UI
const menuOptions = computed(() => [
  {
    label: "Dashboard",
    key: "dashboard",
    path: "/",
  },
  {
    label: "Quản lý bài viết",
    key: "post-management",
    children: [
      {
        label: "Danh mục",
        key: "category",
        path: "/category",
      },
      {
        label: "Bài viết",
        key: "articles",
        path: "/articles",
      },
      {
        label: "Tag",
        key: "tag",
        path: "/tag",
      },
      // {
      //   label: "FAQ",
      //   key: "faq",
      //   path: "/faq",
      // },
    ],
  },
  {
    label: "Quản lý người dùng",
    key: "user-management",
    children: [
      {
        label: "Quản lý người dùng",
        key: "user",
        path: "/user",
      },
    ],
  },
  {
    label: "Quản lý hệ thống",
    key: "system-management",
    children: [
      {
        label: "Nhật ký hoạt động",
        key: "operation-log",
        path: "/pms/operation-log",
      },
    ],
  },
]);

// Tìm menu item theo key
function findMenuItem(options, key) {
  for (const item of options) {
    if (item.key === key) {
      return item;
    }
    if (item.children) {
      const found = findMenuItem(item.children, key);
      if (found) return found;
    }
  }
  return null;
}

// Xử lý khi click menu
function handleMenuSelect(key, item) {
  // Nếu không có item, tìm trong menu options
  if (!item) {
    item = findMenuItem(menuOptions.value, key);
  }

  // Kiểm tra item có path không
  if (!item || !item.path) {
    return;
  }

  try {
    if (isExternal(item.originPath || item.path)) {
      $dialog.confirm({
        type: "info",
        title: "Vui lòng chọn cách mở",
        positiveText: "Mở liên kết ngoài",
        negativeText: "Mở nhúng trong trang này",
        onPositiveClick() {
          window.open(item.originPath || item.path);
        },
        onNegativeClick() {
          router.push(item.path);
        },
      });
    } else {
      router.push(item.path);
    }
  } catch (error) {
    console.error("Lỗi khi xử lý menu:", error);
  }
}

// Watch route changes
watch(
  () => route.fullPath,
  () => {
    nextTick(() => {});
  },
  { immediate: true }
);
</script>

<style>
.side-menu:not(.n-menu--collapsed) {
  .n-menu-item-content {
    &::before {
      left: 8px;
      right: 8px;
    }
    &.n-menu-item-content--selected::before {
      border-left: 4px solid rgb(var(--primary-color));
    }
  }
}
</style>
