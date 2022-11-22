import { defineConfig } from '@mami/cli'
import * as obsidian from '@mami/plugin-obsidian'
import * as hexo from '@mami/plugin-hexo'
import path from 'path'

export default defineConfig({
  input: [obsidian.input({ root: path.resolve(__dirname, './obsidian-source') })],
  output: [hexo.output({ root: __dirname, baseUrl: '/demo/obsidian2hexo/' })],
})
