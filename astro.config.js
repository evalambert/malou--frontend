import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel/static'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Changez 'server' en 'static'
  output: 'static',
  adapter: vercel({
    imageService: true,
    webAnalytics: {
      enabled: true
    }
  }),
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr'
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react()]
})
