// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {enabled: true},
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    'nuxt-maplibre',
    '@sidebase/nuxt-auth',
    'nitro-cloudflare-dev'
  ],
  runtimeConfig: {
    auth: {
      secret: process.env.AUTH_SECRET
    },
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  vite: {
    optimizeDeps: {
      include: ["maplibre-gl"],
    },
  },
  ssr: true,
  auth: {
    globalAppMiddleware: false,
    baseURL: process.env.AUTH_ORIGIN
  }
})