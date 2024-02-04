import { it, expect, describe, inject } from 'vitest'
import { injectEnv, loadConfig, loadEnv, parseConfig } from '../configParser'
import pathe from 'pathe'
import { readFile, writeFile } from 'fs/promises'
import { initTempPath } from '@liuli-util/test'
import path from 'pathe'
import { stringify } from 'yaml'
import { ConfigSchema } from '../config.schema'
import configRaw from './assets/config.ts?raw'
import * as yaml from 'yaml'

const tempPath = initTempPath(__filename)

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

it('parse yaml config with transform', async () => {
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
          transforms: [
            {
              name: '@mark-magic/plugin-doctran',
              config: {
                engine: 'google',
                to: 'zh-CN',
              },
            },
          ],
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
  console.log(r.tasks)
  expect(r.tasks[0].transforms).length(1)
  expect(r.tasks[0].transforms![0].name).eq('doctran')
})

it('parse yaml config with env', async () => {
  await writeFile(
    path.resolve(tempPath, 'mark-magic.config.yaml'),
    stringify({
      tasks: [
        {
          name: 'joplin',
          input: {
            name: '@mark-magic/plugin-joplin',
            config: {
              baseUrl: '${JOP_BASE_URL}',
              token: '${JOP_TOKEN}',
              tag: 'blog',
            },
          },
          output: {
            name: '@mark-magic/plugin-hexo',
            config: {
              path: './dist/my-book.epub',
            },
          },
        },
      ],
    }),
  )
  await writeFile(path.resolve(tempPath, '.env.local'), `JOP_BASE_URL=http://localhost:41184\nJOP_TOKEN=token`)
  await loadEnv(tempPath)
  console.log(injectEnv(await readFile(path.resolve(tempPath, 'mark-magic.config.yaml'), 'utf-8')))
  const options = yaml.parse(
    injectEnv(await readFile(path.resolve(tempPath, 'mark-magic.config.yaml'), 'utf-8')),
  ) as ConfigSchema
  expect(options.tasks[0].input.config).deep.eq({
    baseUrl: 'http://localhost:41184',
    token: 'token',
    tag: 'blog',
  })
})
