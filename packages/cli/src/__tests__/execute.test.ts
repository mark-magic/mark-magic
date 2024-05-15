import { initTempPath } from '@liuli-util/test'
import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'pathe'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { stringify } from 'yaml'
import { ConfigSchema } from '../config.schema'
import { execute } from '../execute'
import { pathExists } from 'fs-extra/esm'
import { isCI } from 'ci-info'

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
              path: path.resolve(tempPath, 'books'),
            },
          },
          output: {
            name: '@mark-magic/plugin-docs',
            config: {
              name: 'My Book',
              path: path.resolve(tempPath, 'dist/docs/'),
            },
          },
        },
      ],
    } as ConfigSchema),
  )
  await mkdir(path.resolve(tempPath, 'books'), { recursive: true })
  await writeFile(path.resolve(tempPath, 'books', 'readme.md'), '# Hello World')
  await execute({ root: tempPath })
  expect(await pathExists(path.resolve(tempPath, 'dist/docs/index.html'))).true
}, 10_000)

it.skip('transform', async () => {
  await writeFile(
    path.resolve(tempPath, 'mark-magic.config.yaml'),
    stringify({
      tasks: [
        {
          name: 'docs',
          input: {
            name: '@mark-magic/plugin-local',
            config: {
              path: path.resolve(tempPath, 'books'),
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
              path: path.resolve(tempPath, 'dist/docs/'),
            },
          },
        },
      ],
    } as ConfigSchema),
  )
  await mkdir(path.resolve(tempPath, 'books'), { recursive: true })
  await writeFile(path.resolve(tempPath, 'books', 'readme.md'), '# Hello World')
  await execute({ root: tempPath })
  const indexPath = path.resolve(tempPath, 'dist/docs/index.html')
  expect(await pathExists(indexPath)).true
  expect(await readFile(indexPath, 'utf-8')).include('你好世界')
})

it('ci mode', async () => {
  if (!isCI) {
    return
  }
  const log = vi.spyOn(console, 'log')
  await writeFile(
    path.resolve(tempPath, 'mark-magic.config.yaml'),
    stringify({
      tasks: [
        {
          name: 'docs',
          input: {
            name: '@mark-magic/plugin-local',
            config: {
              path: path.resolve(tempPath, 'books'),
            },
          },
          output: {
            name: '@mark-magic/plugin-local',
            config: {
              path: path.resolve(tempPath, 'dist/zh-CN/'),
            },
          },
        },
      ],
    } as ConfigSchema),
  )
  await mkdir(path.resolve(tempPath, 'books'), { recursive: true })
  await writeFile(path.resolve(tempPath, 'books', 'readme.md'), '# Hello World')
  await execute({ root: tempPath })
  expect(JSON.stringify(log.mock.calls)).includes('Processing content 1: readme')
})
