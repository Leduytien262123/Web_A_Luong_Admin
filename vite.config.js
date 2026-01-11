import path from "node:path";
import Vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
import Unocss from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig, loadEnv } from "vite";
import removeNoMatch from "vite-plugin-router-warn";
import VueDevTools from "vite-plugin-vue-devtools";
import { pluginIcons, pluginPagePathes } from "./build/plugin-isme";

export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd());
  const { VITE_PUBLIC_PATH, VITE_PROXY_TARGET } = viteEnv;

  return {
    base: VITE_PUBLIC_PATH || "/",
    plugins: [
      Vue(),
      VueJsx(),
      VueDevTools(),
      Unocss(),
      AutoImport({
        imports: [
          "vue",
          "vue-router",
          {
            dayjs: [["default", "dayjs"]],
            "@/utils": ["api"],
            "@/store": [
              "useAppStore",
              "useAuthStore",
              "useTabStore",
              "useUserStore",
              "usePermissionStore",
              "useRouterStore",
            ],
            "naive-ui": [
              "useDialog",
              "useMessage",
              "useNotification",
              "useLoadingBar",
            ],
          },
        ],
        dts: false,
        eslintrc: {
          enabled: true,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true,
        },
      }),
      Components({
        resolvers: [NaiveUiResolver()],
        dts: false,
      }),
      // Custom plugin to generate page file paths and add to virtual module
      pluginPagePathes(),
      // Custom plugin to generate custom icons and add to virtual module
      pluginIcons(),
      // Remove unnecessary vue-router dynamic route warning: No match found for location with path
      removeNoMatch(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
        "~": path.resolve(process.cwd()),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 3200,
      open: false,
      proxy: {
        "/api": {
          target: VITE_PROXY_TARGET,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          secure: false,
          configure: (proxy, options) => {
            // Configure this to see the real request address in the response header
            proxy.on("proxyRes", (proxyRes, req) => {
              proxyRes.headers["x-real-url"] =
                new URL(req.url || "", options.target)?.href || "";
            });
          },
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1024, // chunk size warning limit (in kb)
    },
  };
});
