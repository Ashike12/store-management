import {defineConfig} from 'vitest/config'; // ✅ Import from vitest/config
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';
import tsconfigPaths from 'vite-tsconfig-paths'; // only if you installed the plugin

dotenv.config(); // load env vars from .env

// https://vite.dev/config/
export default defineConfig({
  base: "/store-management/",
  plugins: [
    react(),
    tsconfigPaths(), // only if you installed the plugin
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  resolve: {
    alias: {
      '@app': '/src/app',
      '@features': '/src//features',
      '@common': '/src/components/common',
      '@layout': '/src/layout',
      '@components': '/src/components',
      '@asset': '/src/assets',
      '@core': '/src/core',
    },
  },
  define: {
    'process.env': process.env, // Make process.env available
  },
});
