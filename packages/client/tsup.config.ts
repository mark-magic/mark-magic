import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/bin.ts'],
  format: ['esm'],
  target: 'esnext',
  shims: true,
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
})
