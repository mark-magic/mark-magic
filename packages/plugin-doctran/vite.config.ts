/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { node } from '@liuli-util/vite-plugin-node'

export default defineConfig({
  plugins: [node({ dts: true })],
  test: {
    setupFiles: ['./src/setupTest.ts'],
  },
})
