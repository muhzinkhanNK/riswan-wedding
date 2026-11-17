import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    watch: {
      // Exclude large media folders from file watching to avoid EBUSY crashes
      ignored: ['**/public/videos/**', '**/public/images/**'],
    },
  },
})
