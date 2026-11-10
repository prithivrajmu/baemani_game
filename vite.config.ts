import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // relative asset URLs so dist/ works from any subpath (e.g. /baemani/)
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
