import { defineConfig } from '../..'
import * as local from '@mark-magic/plugin-local'
import * as epub from '@mark-magic/plugin-epub'
import * as docs from '@mark-magic/plugin-docs'

export default defineConfig({
  tasks: [
    {
      name: 'epub',
      input: local.input({
        path: './books',
      }),
      output: epub.output({
        path: './dist/my-book.epub',
        metadata: {
          id: 'books',
          title: '书籍',
          creator: 'liuli',
        },
      }),
    },
    {
      name: 'docs',
      input: local.input({
        path: './books',
      }),
      output: docs.output({
        name: 'My Book',
        path: './dist/docs/',
      }),
    },
  ],
})
