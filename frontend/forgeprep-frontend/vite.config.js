import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    plugins: [react()],
    host: '0.0.0.0',
    port: 5173,
    cors: true,
    hmr:{
      clientPort: 5173,
    }
  }
})
