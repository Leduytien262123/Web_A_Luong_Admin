module.exports = [
  {
    // root config
    ignores: ["dist/**", "node_modules/**", "build/**"],

    languageOptions: {
      env: {
        browser: true,
        es2021: true,
        node: true,
      },

      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },

      // Project-wide globals (kept readonly to avoid accidental overwrites)
      globals: {
        // Vue 3 Composition API globals
        h: "readonly",
        unref: "readonly",
        provide: "readonly",
        inject: "readonly",
        markRaw: "readonly",
        defineAsyncComponent: "readonly",
        nextTick: "readonly",
        useRoute: "readonly",
        useRouter: "readonly",
        ref: "readonly",
        reactive: "readonly",
        watch: "readonly",
        watchEffect: "readonly",
        onMounted: "readonly",
        onUnmounted: "readonly",
        shallowRef: "readonly",

        // Naive UI globals
        Message: "readonly",
        $loadingBar: "readonly",
        $message: "readonly",
        $dialog: "readonly",
        $notification: "readonly",
        $modal: "readonly",
        useMessage: "readonly",
        message: "readonly",
        NSwitch: "readonly",
        NButton: "readonly",

        // Pinia/Store globals
        useUserStore: "readonly",

        // Library globals
        dayjs: "readonly",

        // Application specific globals
        api: "readonly",
        useCrud: "readonly",

        // Browser globals
        window: "readonly",
        document: "readonly",
        console: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        navigator: "readonly",
        location: "readonly",
        history: "readonly",
        fetch: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        FormData: "readonly",
        Blob: "readonly",
        File: "readonly",
        FileReader: "readonly",
        Image: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        MouseEvent: "readonly",
        KeyboardEvent: "readonly",
        InputEvent: "readonly",
        Element: "readonly",
        HTMLElement: "readonly",
        SVGElement: "readonly",
        MathMLElement: "readonly",
        DOMMatrix: "readonly",
        WebKitCSSMatrix: "readonly",
        MutationObserver: "readonly",
        ResizeObserver: "readonly",
        IntersectionObserver: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        setImmediate: "readonly",
        queueMicrotask: "readonly",
        getComputedStyle: "readonly",
        performance: "readonly",
        devicePixelRatio: "readonly",
        atob: "readonly",
        btoa: "readonly",
        CSS: "readonly",
        Storage: "readonly",
        StorageEvent: "readonly",
        XMLHttpRequest: "readonly",
        AbortController: "readonly",
        ReadableStream: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        Buffer: "readonly",

        // Node.js/Build globals
        process: "readonly",
        global: "readonly",
        self: "readonly",
        exports: "readonly",
        module: "readonly",
        require: "readonly",

        // Framework/Library specific
        wx: "readonly",
        chrome: "readonly",
        saveAs: "readonly",
        IE_SaveFile: "readonly",
        Deno: "readonly",
        encrypt_agile: "readonly",
        WorkerGlobalScope: "readonly",

        // Application specific
        handleSave: "readonly",
        code: "readonly",
      },
    },

    // Provide plugin mapping for the flat config format
    plugins: {
      vue: require("eslint-plugin-vue"),
    },

    // Base extends and rules
    extends: ["eslint:recommended"],

    rules: {
      // project-specific rules
      "n/prefer-global/process": "off",
      "no-undef": "error",
      "no-fallthrough": "off",
      "vue/block-order": "off",
      "@typescript-eslint/no-this-alias": "off",
      "prefer-promise-reject-errors": "off",

      // stylistic rules (intentionally relaxed for this project)
      "no-trailing-spaces": "off",
      "no-multiple-empty-lines": "off",
      "eol-last": "off",
      semi: "off",
      quotes: "off",
      indent: "off",
      "space-before-function-paren": "off",
      "comma-dangle": "off",
    },
  },

  // Vue-specific configuration applied only to .vue files
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: require.resolve("vue-eslint-parser"),
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        // Let vue-eslint-parser delegate script parsing to the default parser (espree)
      },
    },
    plugins: {
      vue: require("eslint-plugin-vue"),
    },
    extends: ["plugin:vue/vue3-recommended"],
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      "vue/require-default-prop": "off",
      "vue/require-explicit-emits": "off",
      "vue/component-definition-name-casing": ["error", "PascalCase"],
      // Enforce consistent self-closing style for HTML and Vue components
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "never",
            normal: "always",
            component: "always",
          },
        },
      ],
    },
  },
];
