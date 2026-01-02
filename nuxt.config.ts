// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  //   plugins: [
  //     tailwindcss({
  //       config: {
  //         content: [
  //           "./app/components/**/*.{js,vue,ts}",
  //           "./app/layouts/**/*.vue",
  //           "./app/pages/**/*.vue",
  //           "./app/plugins/**/*.{js,ts}",
  //           "./app/app.vue",
  //           "./app/error.vue",
  //         ],
  //         darkMode: 'class',
  //         theme: {
  //           extend: {
  //             colors: {
  //               primary: {
  //                 50: '#fffbeb',
  //                 100: '#fef3c7',
  //                 200: '#fde68a',
  //                 300: '#fcd34d',
  //                 400: '#fbbf24',
  //                 500: '#f59e0b',
  //                 600: '#d97706',
  //                 700: '#b45309',
  //                 800: '#92400e',
  //                 900: '#78350f',
  //               },
  //             },
  //             animation: {
  //               'fade-in': 'fadeIn 0.3s ease-in',
  //             },
  //             keyframes: {
  //               fadeIn: {
  //                 '0%': { opacity: '0', transform: 'translateY(10px)' },
  //                 '100%': { opacity: '1', transform: 'translateY(0)' },
  //               },
  //             },
  //           },
  //         },
  //         plugins: [],
  //       },
  //     }),
  //   ],
  // },
  alias: {
    "~": fileURLToPath(new URL("./", import.meta.url)),
    "@": fileURLToPath(new URL("./", import.meta.url)),
  },
  app: {
    head: {
      script: [
        {
          innerHTML: `(function(){document.documentElement.classList.remove('dark');localStorage.removeItem('theme');})();`,
          type: 'text/javascript',
        }
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
        }
      ]
    }
  },
  
  modules: [
    "@nuxt/ui",
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/hints",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
  ],
});
