import { initTempPath } from '@liuli-util/test'
import { mkdir, writeFile } from 'fs/promises'
import path from 'pathe'
import { it } from 'vitest'
import { stringify } from 'yaml'
import { ConfigSchema } from '../config.schema'
import { execute } from '../execute'

const tempPath = initTempPath(__filename)

it('generate docs', async () => {
  await writeFile(
    path.resolve(tempPath, 'mark-magic.config.yaml'),
    stringify({
      tasks: [
        {
          name: 'docs',
          input: {
            name: '@mark-magic/plugin-local',
            config: {
              path: './books',
            },
          },
          output: {
            name: '@mark-magic/plugin-docs',
            config: {
              name: 'My Book',
              path: './dist/docs/',
            },
          },
        },
      ],
    } as ConfigSchema),
  )
  await mkdir(path.resolve(tempPath, 'books'), { recursive: true })
  await writeFile(path.resolve(tempPath, 'books', 'readme.md'), '# Hello World')
  await execute({ root: tempPath })
})
