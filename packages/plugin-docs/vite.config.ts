import { defineConfig } from 'vite'
import { node } from '@liuli-util/vite-plugin-node'
import { build } from 'esbuild'

export default defineConfig({
  plugins: [
    node({ dts: true, shims: true }),
    {
      name: 'build-script',
      async buildStart() {
        await build({
          entryPoints: ['./src/assets/config.ts'],
          target: 'esnext',
          format: 'esm',
          outfile: './src/assets/config.js',
        })
      },
    },
  ],
})
