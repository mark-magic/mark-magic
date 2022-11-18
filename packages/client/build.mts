import { build } from 'esbuild'

await build({
  entryPoints: ['src/main.ts'],
  platform: 'node',
  outfile: 'dist/main.js',
  bundle: true,
  sourcemap: true,
  external: ['electron'],
})
