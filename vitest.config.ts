import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // importing vitest in a test breaks on Windows when the shell sits on a lowercase `c:`
    globals: true,
  },
});
