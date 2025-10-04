// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const useProxy = process.env.VITE_USE_PROXY === 'true';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    ...(useProxy && {
      proxy: {
        '/api': {
          target: 'http://localhost:5174',
          changeOrigin: true,
        },
      },
    }),
  },
})
