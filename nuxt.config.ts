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
      htmlAttrs: {
        style: 'background-color: #ffffff;'
      },
      bodyAttrs: {
        style: 'background-color: #ffffff; margin: 0;'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
      ],
      style: [
        {
          innerHTML: `
            /* CRITICAL: Hide everything until app is ready */
            html, body {
              background-color: #ffffff !important;
              margin: 0;
              padding: 0;
            }
            
            /* Hide Nuxt app content until hydrated */
            #__nuxt:not(.app-ready) > *:not(#app-loading) {
              visibility: hidden !important;
            }
            
            /* Loading Screen Styles - Critical */
            #app-loading {
              position: fixed;
              inset: 0;
              z-index: 99999;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: #ffffff;
              transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            #app-loading.hide {
              opacity: 0;
              visibility: hidden;
              pointer-events: none;
            }
            .loading-spinner {
              width: 40px;
              height: 40px;
              border: 3px solid #e4e4e7;
              border-top-color: #f59e0b;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
            }
            .loading-text {
              margin-top: 16px;
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              font-size: 14px;
              color: #71717a;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `,
          tagPosition: 'head'
        }
      ],
      script: [
        {
          innerHTML: `(function(){
            // Set background immediately
            document.documentElement.style.backgroundColor = '#ffffff';
            document.body.style.backgroundColor = '#ffffff';
            
            // Create loading screen immediately before anything else renders
            if(!document.getElementById('app-loading')){
              var loader = document.createElement('div');
              loader.id = 'app-loading';
              loader.innerHTML = '<div class="loading-spinner"></div><div class="loading-text">Loading...</div>';
              if(document.body.firstChild){
                document.body.insertBefore(loader, document.body.firstChild);
              } else {
                document.body.appendChild(loader);
              }
            }
            
            document.documentElement.classList.remove('dark');
            localStorage.removeItem('theme');
            
            // Auth redirect - runs IMMEDIATELY before Vue hydrates
            // Always redirect to login first unless already on login page
            var path = window.location.pathname;
            if(path !== '/login'){
              var isAuth = localStorage.getItem('isAuthenticated');
              var expiry = localStorage.getItem('tokenExpiry');
              var shouldRedirect = false;
              
              if(!isAuth){
                shouldRedirect = true;
              } else if(expiry){
                if(Date.now() > parseInt(expiry)){
                  localStorage.removeItem('isAuthenticated');
                  localStorage.removeItem('tokenExpiry');
                  shouldRedirect = true;
                }
              } else {
                localStorage.removeItem('isAuthenticated');
                shouldRedirect = true;
              }
              
              if(shouldRedirect){
                window.location.replace('/login');
              }
            }
          })();`,
          type: 'text/javascript',
          tagPosition: 'bodyOpen'
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
  
  // Runtime configuration for environment variables
  runtimeConfig: {
    // Server-side only
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_KEY || '',
    // Public (available on client)
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
    }
  },
  
  // Vite configuration to suppress warnings and optimize build
  vite: {
    build: {
      // Suppress chunk size warnings
      chunkSizeWarningLimit: 1000,
      // Disable sourcemaps in production
      sourcemap: false,
    },
    // Suppress Tailwind sourcemap warnings
    css: {
      devSourcemap: false
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
