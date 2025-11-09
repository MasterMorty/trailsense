// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {enabled: true},
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    'nuxt-maplibre',
    'nitro-cloudflare-dev'
  ],
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
})