import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact({
      // prerender: {
      //   enabled: true,
      //   renderTarget: '#app',
      // },
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss() as any],
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
