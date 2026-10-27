import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Tests live outside tsconfig's `include`, so enable legacy decorators explicitly.
  oxc: {
    decorator: { legacy: true, emitDecoratorMetadata: true },
  },
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'html', 'lcov'],
    },
  },
});
