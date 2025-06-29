import { resolve } from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/motion/nuxt',
    'pinia-plugin-persistedstate',
  ],
  ssr: true,
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
  runtimeConfig: {
    public: {
      siteUrl: import.meta.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },
  alias: {
    '#': resolve(__dirname, './server'),
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-05-15',
  nitro: {
    preset: 'node-server',
    storage: {
      db: {
        driver: 'fs',
        base: './.data/db',
      },
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
