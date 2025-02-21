import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: 'server',  // Changez 'server' en 'static'
  adapter: vercel({
    imageService: true,
    webAnalytics: {
      enabled: true
    }
  }),
  vite: {
    plugins: [tailwindcss()]
  }
});