declare global {
  // Vue composition API
  const ref: (typeof import("vue"))["ref"];
  const reactive: (typeof import("vue"))["reactive"];
  const computed: (typeof import("vue"))["computed"];
  const watch: (typeof import("vue"))["watch"];
  const watchEffect: (typeof import("vue"))["watchEffect"];
  const onMounted: (typeof import("vue"))["onMounted"];
  const onUnmounted: (typeof import("vue"))["onUnmounted"];
  const onBeforeMount: (typeof import("vue"))["onBeforeMount"];
  const onBeforeUnmount: (typeof import("vue"))["onBeforeUnmount"];
  const onUpdated: (typeof import("vue"))["onUpdated"];
  const onBeforeUpdate: (typeof import("vue"))["onBeforeUpdate"];
  const nextTick: (typeof import("vue"))["nextTick"];
  const h: (typeof import("vue"))["h"];
  const defineProps: (typeof import("vue"))["defineProps"];
  const defineEmits: (typeof import("vue"))["defineEmits"];
  const defineExpose: (typeof import("vue"))["defineExpose"];
  const withDefaults: (typeof import("vue"))["withDefaults"];
  const toRef: (typeof import("vue"))["toRef"];
  const toRefs: (typeof import("vue"))["toRefs"];
  const unref: (typeof import("vue"))["unref"];
  const provide: (typeof import("vue"))["provide"];
  const inject: (typeof import("vue"))["inject"];

  // Vue Router
  const useRouter: (typeof import("vue-router"))["useRouter"];
  const useRoute: (typeof import("vue-router"))["useRoute"];

  // Utils
  const api: (typeof import("@/utils"))["api"];
  const dayjs: typeof import("dayjs");

  // Store
  const useAppStore: (typeof import("@/store"))["useAppStore"];
  const useAuthStore: (typeof import("@/store"))["useAuthStore"];
  const useTabStore: (typeof import("@/store"))["useTabStore"];
  const useUserStore: (typeof import("@/store"))["useUserStore"];
  const usePermissionStore: (typeof import("@/store"))["usePermissionStore"];
  const useRouterStore: (typeof import("@/store"))["useRouterStore"];

  // Naive UI composables
  const useDialog: (typeof import("naive-ui"))["useDialog"];
  const useMessage: (typeof import("naive-ui"))["useMessage"];
  const useNotification: (typeof import("naive-ui"))["useNotification"];
  const useLoadingBar: (typeof import("naive-ui"))["useLoadingBar"];

  // Global naive discrete APIs
  const $message: any;
  const $dialog: any;
  const $notification: any;
  const $loadingBar: any;
}

export {};
