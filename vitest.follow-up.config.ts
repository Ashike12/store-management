import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// Isolated mocked suite: never import vite.config.ts or load .env files.
export default defineConfig({
  envDir: false,
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    include: ['__tests__/OrderFollowUp.test.tsx'],
    maxWorkers: 1,
    minWorkers: 1,
  },
});
