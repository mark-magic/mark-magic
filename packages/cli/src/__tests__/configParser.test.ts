import { it, expect, describe } from 'vitest'
import { loadConfig, parseConfig } from '../configParser'
import pathe from 'pathe'
import { writeFile } from 'fs/promises'
import { initTempPath } from '@liuli-util/test'
import path from 'pathe'
import { stringify } from 'yaml'
import { ConfigSchema } from '../config.schema'
import configRaw from './assets/config.ts?raw'

const tempPath = initTempPath(__filename)

describe('parseConfig', () => {
  it('parse yaml config', async () => {
    await writeFile(
      path.resolve(tempPath, 'mark-magic.config.yaml'),
      stringify({
        tasks: [
          {
            name: 'epub',
            input: {
              name: '@mark-magic/plugin-local',
              config: {
                path: './books',
              },
            },
            output: {
              name: '@mark-magic/plugin-epub',
              config: {
                path: './dist/my-book.epub',
                metadata: {
                  id: 'books',
                  title: '书籍',
                  creator: 'liuli',
                },
              },
            },
          },
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
    const configPath = await loadConfig(tempPath)
    expect(configPath).eq(path.resolve(tempPath, 'mark-magic.config.yaml'))
    const r = await parseConfig(configPath)
    expect(r.tasks).length(2)
    expect(r.tasks[0].input.name).eq('local')
    expect(r.tasks[0].output.name).eq('epub')
    expect(r.tasks[1].input.name).eq('local')
    expect(r.tasks[1].output.name).eq('docs')
  })

  it('parse js config', async () => {
    const expectConfigPath = path.resolve(tempPath, 'mark-magic.config.ts')
    const relativePath = pathe.relative(path.dirname(expectConfigPath), path.resolve(__dirname, '..'))
    await writeFile(expectConfigPath, configRaw.replace('../..', relativePath))
    const configPath = await loadConfig(tempPath)
    expect(configPath).eq(expectConfigPath)
    const r = await parseConfig(configPath)
    expect(r.tasks).length(2)
    expect(r.tasks[0].input.name).eq('local')
    expect(r.tasks[0].output.name).eq('epub')
    expect(r.tasks[1].input.name).eq('local')
    expect(r.tasks[1].output.name).eq('docs')
  })
})
