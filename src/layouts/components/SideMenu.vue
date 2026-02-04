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
import { useAppStore, useUserStore } from "@/store";
import { isExternal } from "@/utils";
import { h } from "vue";

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();

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

// Raw menu definition (keeps labels/keys/paths)
const userStore = useUserStore();

const rawMenu = computed(() => {
  const items = [
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
      ],
    },
  ];

  // Only include user management menu for super_admin role
  if (userStore.role === "super_admin") {
    items.push({
      label: "Quản lý người dùng",
      key: "user-management",
      children: [
        {
          label: "Quản lý người dùng",
          key: "user",
          path: "/user",
        },
      ],
    });
  }

  items.push({
    label: "Quản lý hệ thống",
    key: "system-management",
    children: [
      // {
      //   label: "Nhật ký hoạt động",
      //   key: "operation-log",
      //   path: "/configs/operation-log",
      // },
      {
        label: "Cấu hình trang chủ",
        key: "home-configuration",
        path: "/configs/home-configuration",
      },
    ],
  });

  return items;
});

// Mapping từ key/label sang Uno icon class (bằng Iconify / UnoCSS syntax)
function getUnoIconClass(nameOrKey) {
  if (!nameOrKey) return "i-ic:baseline-label";
  const key = String(nameOrKey).toLowerCase();
  const map = {
    dashboard: "i-ic:baseline-dashboard",
    "post-management": "i-ic:baseline-description",
    "quản lý bài viết": "i-ic:baseline-description",
    category: "i-ic:baseline-folder",
    "danh mục": "i-ic:baseline-folder",
    articles: "i-ic:baseline-article",
    "bài viết": "i-ic:baseline-article",
    tag: "i-ic:baseline-label",
    user: "i-ic:baseline-person",
    "user-management": "i-ic:baseline-people",
    "quản lý người dùng": "i-ic:baseline-people",
    "system-management": "i-ic:baseline-settings",
    "quản lý hệ thống": "i-ic:baseline-settings",
    "operation-log": "i-ic:baseline-history",
    "nhật ký hoạt động": "i-ic:baseline-history",
    "home-configuration": "i-ic:baseline-settings",
    "cấu hình trang chủ": "i-ic:baseline-settings",
  };
  return map[key] || `i-ic:baseline-label`;
}

// Build options for Naive UI, injecting an <i> element with Uno icon class
function buildOptions(items) {
  return items.map((it) => {
    const iconClass = getUnoIconClass(it.key || it.label);
    const option = {
      ...it,
      icon: () => h("i", { class: iconClass }),
    };
    if (it.children) option.children = buildOptions(it.children);
    return option;
  });
}

// Cấu trúc menu đúng format cho Naive UI (với Uno icons)
const menuOptions = computed(() => buildOptions(rawMenu.value));

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
  { immediate: true },
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

.side-menu i {
  display: inline-block;
  width: 18px;
  text-align: center;
  margin-right: 8px;
  line-height: 1;
}

/* Ensure Naive UI menu icons get 32x32 — target container and inner icon */
.side-menu .n-menu-item-content__icon,
.side-menu .n-menu-item-content__icon > * {
  width: 24px !important;
  height: 24px !important;
  display: inline-block !important;
  line-height: 24px !important;
}

/* Fallback for different Naive UI class names */
.side-menu .n-menu-item__icon,
.side-menu .n-menu-item__icon > * {
  width: 24px !important;
  height: 24px !important;
  display: inline-block !important;
  line-height: 24px !important;
}
</style>
