export const basicRoutes = [
  {
    name: "Login",
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "Trang đăng nhập",
      layout: "empty",
    },
  },

  {
    name: "Home",
    path: "/",
    component: () => import("@/views/home/index.vue"),
    meta: {
      title: "Trang chủ",
    },
  },

  {
    name: "category",
    path: "/category",
    component: () => import("@/views/category/index.vue"),
    meta: {
      title: "Quản lý danh mục",
    },
  },

  {
    name: "category_add",
    path: "/category/add",
    component: () => import("@/views/category/add.vue"),
    meta: {
      title: "Thêm danh mục",
    },
  },

  {
    name: "category_edit",
    path: "/category/edit/:id",
    component: () => import("@/views/category/edit/[id].vue"),
    meta: {
      title: "Sửa danh mục",
    },
  },

  {
    name: "articles",
    path: "/articles",
    component: () => import("@/views/articles/index.vue"),
    meta: {
      title: "Quản lý bài viết",
    },
  },

  {
    name: "articles_add",
    path: "/articles/add",
    component: () => import("@/views/articles/add.vue"),
    meta: {
      title: "Thêm bài viết",
    },
  },

  {
    name: "articles_edit",
    path: "/articles/edit/:id",
    component: () => import("@/views/articles/edit/[id].vue"),
    meta: {
      title: "Sửa bài viết",
    },
  },

  {
    name: "tag",
    path: "/tag",
    component: () => import("@/views/tag/index.vue"),
    meta: {
      title: "Quản lý thẻ Tag",
    },
  },

  {
    name: "tag_add",
    path: "/tag/add",
    component: () => import("@/views/tag/add.vue"),
    meta: {
      title: "Thêm thẻ Tag",
    },
  },

  {
    name: "tag_edit",
    path: "/tag/edit/:id",
    component: () => import("@/views/tag/edit/[id].vue"),
    meta: {
      title: "Sửa thẻ Tag",
    },
  },

  {
    name: "user",
    path: "/user",
    component: () => import("@/views/user/index.vue"),
    meta: {
      title: "Quản lý người dùng",
    },
  },

  {
    name: "user_add",
    path: "/user/add",
    component: () => import("@/views/user/add.vue"),
    meta: {
      title: "Thêm người dùng",
    },
  },

  {
    name: "user_edit",
    path: "/user/edit/:id",
    component: () => import("@/views/user/edit/[id].vue"),
    meta: {
      title: "Sửa người dùng",
    },
  },

  {
    name: "profile",
    path: "/profile",
    component: () => import("@/views/profile/index.vue"),
    meta: {
      title: "Hồ sơ cá nhân",
    },
  },

  {
    name: "operation-log",
    path: "/configs/operation-log",
    component: () => import("@/views/configs/operation-log/index.vue"),
    meta: {
      title: "Nhật ký hoạt động",
    },
  },

  {
    name: "home-configuration",
    path: "/configs/home-configuration",
    component: () => import("@/views/configs/home-configuration/index.vue"),
    meta: {
      title: "Cấu hình trang chủ",
    },
  },

  {
    name: "edit-home-configuration",
    path: "/configs/home-configuration/edit/:id",
    component: () => import("@/views/configs/home-configuration/edit/[id].vue"),
    meta: {
      title: "Chỉnh sửa cấu hình",
    },
  },

  {
    name: "test-upload",
    path: "/demo/upload",
    component: () => import("@/views/demo/upload/index.vue"),
    meta: {
      title: "Demo upload",
    },
  },

  {
    name: "404",
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      title: "Trang không tồn tại",
      layout: "empty",
    },
  },

  {
    name: "403",
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      title: "Không có quyền truy cập",
      layout: "empty",
    },
  },
];
