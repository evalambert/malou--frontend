import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';
import tailwindcss from "@tailwindcss/vite";

import react from '@astrojs/react';

export default defineConfig({
  // Changez 'server' en 'static'
  output: 'static',

  adapter: vercel({
    imageService: true,
    webAnalytics: {
      enabled: true
    }
  }),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
}); 