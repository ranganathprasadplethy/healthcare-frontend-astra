import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// /api calls are proxied to the Express backend, so no CORS or URL config is needed in dev
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { '/api': 'http://localhost:5000' } },
});
