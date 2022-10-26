import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePluginFonts } from 'vite-plugin-fonts';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/wordshop',
  plugins: [
    react(),
    VitePluginFonts({
      custom: {
        families: [
          {
            name: 'Obviously',
            src: './src/assets/fonts/*.otf',
          },
        ],

        display: 'auto',
        preload: true,
        injectTo: 'head-prepend',
      },
    }),
  ],
});
