import { defineConfig } from 'vite'
import { node } from '@liuli-util/vite-plugin-node'

export default defineConfig({
  plugins: [node({ entry: ['./src/index.ts', './src/utils.ts'], dts: true })],
})
