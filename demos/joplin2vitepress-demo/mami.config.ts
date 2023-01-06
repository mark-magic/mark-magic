import { defineConfig } from '@mami/cli'
import * as joplin from '@mami/plugin-joplin'
import * as vitepress from '@mami/plugin-vitepress'
import path from 'path'

export default defineConfig({
  input: [
    joplin.input({
      baseUrl: 'http://127.0.0.1:27583',
      token:
        '5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31',
      tag: 'wiki',
    }),
  ],
  output: [
    vitepress.output({
      root: path.resolve(__dirname, './docs'),
    }),
  ],
})
