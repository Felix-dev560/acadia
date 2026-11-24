import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Optional: proxy during local dev if backend is on same machine
      // '/api': 'http://127.0.0.1:8000',
      // '/sanctum': 'http://127.0.0.1:8000',
    }
  }
})
