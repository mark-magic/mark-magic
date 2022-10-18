import { pathExists } from '@liuli-util/fs-extra'
import { InputPlugin, Resource, Tag, Note, convert } from '@mami/cli'
import { readFile } from 'fs/promises'
import path from 'path'
import { expect, it } from 'vitest'
import { input, output } from '..'
import { initTestDir } from '../utils/initTestDir'

const tempPath = path.resolve(__dirname, '.temp', path.basename(__filename))
initTestDir(tempPath)

function mockInput(): InputPlugin {
  return {
    name: 'generateVirtual',
    async *generate() {
      yield {
        id: 'test1',
        title: 'test1',
        content: `
  # test1
  
  [test2](:/test2)
        `.trim(),
        resources: [] as Resource[],
        tags: [{ id: 'test', title: 'test' }] as Tag[],
        path: ['a', 'b'],
      } as Note
      yield {
        id: 'test2',
        title: 'test2',
        content: `
  # test2
  
  [test1](:/test1)
  [localDirOutput.test.ts](:/test)
                `.trim(),
        resources: [
          {
            id: 'test',
            title: path.basename(__filename),
            raw: await readFile(__filename),
          },
        ] as Resource[],
        tags: [{ id: 'test', title: 'test' }] as Tag[],
        path: ['c'],
      } as Note
    },
  }
}

it('add', async () => {
  const zipPath = path.resolve(tempPath, 'test.zip')
  const e: Note[] = []
  await convert({
    input: [mockInput()],
    output: [
      output({ path: zipPath }),
      {
        name: 'test',
        async handle(note) {
          e.push(note)
        },
      },
    ],
  })
  expect(await pathExists(zipPath)).true
  const r: Note[] = []
  await convert({
    input: [input({ path: zipPath })],
    output: [
      {
        name: 'test',
        async handle(note) {
          r.push(note)
        },
      },
    ],
  })
  expect(e).deep.eq(r)
})
