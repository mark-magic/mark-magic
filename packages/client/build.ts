import { build } from 'esbuild'

await build({
  entryPoints: ['src/main.ts'],
  platform: 'node',
  outfile: 'dist/main.cjs',
  bundle: true,
  external: ['electron'],
})
