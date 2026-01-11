import { createApp } from "vue";
import App from "./App.vue";
import { setupDirectives } from "./directives";
import { setupNaiveUI } from "./plugins/naive-ui";
import { setupGlobalComponents } from "./plugins/global-components";

import { setupRouter } from "./router";
import { setupStore } from "./store";
import { setupNaiveDiscreteApi } from "./utils";
import "@/styles/reset.css";
import "@/styles/global.css";
import "uno.css";

(function applyDefaultPassiveEvents() {
  try {
    let supportsPassive = false;
    const opts = Object.defineProperty({}, "passive", {
      get() {
        supportsPassive = true;
      },
    });
    window.addEventListener("testPassive", null, opts);
    window.removeEventListener("testPassive", null, opts);

    if (!supportsPassive) return;

    const nativeAddEventListener =
      window.EventTarget.prototype.addEventListener;
    window.EventTarget.prototype.addEventListener = function (
      type,
      listener,
      options
    ) {
      const passiveEvents = [
        "touchstart",
        "touchmove",
        "wheel",
        "mousewheel",
        "scroll",
      ];
      if (
        passiveEvents.indexOf(type) !== -1 &&
        (options === undefined ||
          typeof options === "boolean" ||
          (typeof options === "object" && options.passive === undefined))
      ) {
        let newOptions;
        if (typeof options === "boolean") {
          newOptions = { capture: options, passive: true };
        } else if (options === undefined) {
          newOptions = { passive: true };
        } else {
          newOptions = Object.assign({}, options, { passive: true });
        }
        return nativeAddEventListener.call(this, type, listener, newOptions);
      }
      return nativeAddEventListener.call(this, type, listener, options);
    };
  } catch (e) {}
})();

async function bootstrap() {
  const app = createApp(App);
  setupStore(app);

  // Setup Naive UI components toàn cục
  setupNaiveUI(app);

  // Đăng ký các component toàn cục
  setupGlobalComponents(app);

  // Load token từ cookie ngay sau khi setup store
  const { useAuthStore } = await import("./store");
  const authStore = useAuthStore();

  // Tự động load token từ cookie và kiểm tra tính hợp lệ
  const tokenLoaded = authStore.loadTokenFromCookie();

  setupDirectives(app);
  await setupRouter(app);
  app.mount("#app");
  setupNaiveDiscreteApi();
}

bootstrap();
