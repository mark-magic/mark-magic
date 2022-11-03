import { defineConfig } from '@mami/cli'
import * as joplin from '@mami/plugin-joplin'
import * as obsidian from '@mami/plugin-obsidian'
import * as raw from '@mami/plugin-raw'
import path from 'path'

const zipPath = path.resolve(__dirname, 'dist/temp-obsidian.zip')
const config: Parameters<typeof joplin.input>[0] = {
  baseUrl: 'http://127.0.0.1:27583',
  token:
    '5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31',
  tag: '',
}

export default defineConfig({
  input: [
    raw.input({ path: zipPath }),
    // joplin.input(config),
    // obsidian.input({ root: path.resolve(__dirname, '.temp') }),
  ],
  output: [
    // raw.output({ path: zipPath }),
    joplin.output(config),
    // obsidian.output({ root: path.resolve(__dirname, '.temp') }),
  ],
})
