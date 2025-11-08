import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Use happy-dom (faster, avoids jsdom/parse5 ESM issues on Node 20+)
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['**/*.test.ts'],
  },
})
