import { defineConfig } from '@mark-magic/cli'
import * as local from '@mark-magic/plugin-local'
import * as doctran from '@mark-magic/plugin-doctran'
import { config } from 'dotenv'

config({ path: './env/.env.local' })

export default defineConfig({
  tasks: [
    {
      name: 'translate',
      input: local.input({
        path: './docs',
        ignore: ['./docs/en-US/**'],
      }),
      transforms: [
        doctran.transform({
          engine: 'openai',
          to: 'en',
          apiKey: process.env.OPENAI_API_KEY!,
        }),
      ],
      output: local.output({
        rootContentPath: './docs/en-US',
        rootResourcePath: './docs/en-US/resources',
        meta: () => null,
      }),
    },
  ],
})
