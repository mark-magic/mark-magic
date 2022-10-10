import { defineConfig } from '@mami/cli'
import { joplinInput } from '@mami/plugin-joplin-input'
import { hexoOutput } from '@mami/plugin-hexo-output'

export default defineConfig({
  plugins: [
    joplinInput({
      baseUrl: 'http://localhost:27583',
      token:
        '5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31',
      tag: '',
    }),
    hexoOutput(),
  ],
})
