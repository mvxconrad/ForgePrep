import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // allow access from external IPs (useful on EC2)
    port: 5173,
    cors: true,
    hmr: {
      clientPort: 5173,
    },
  },
});
