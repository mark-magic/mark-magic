import { convert } from '@mark-magic/core'
import * as ao3 from '@mark-magic/plugin-ao3'
import * as epub from '@mark-magic/plugin-epub'
import path from 'pathe'
import { nanoid } from 'nanoid'
import { pathExists, remove } from 'fs-extra/esm'
import { readFile } from 'fs/promises'

export async function generate(url: string): Promise<string> {
  const id = nanoid()
  const u = new URL(url)
  const site =
    u.hostname === 'archiveofourown.org'
      ? ('ao3' as const)
      : u.hostname === 'forums.sufficientvelocity.com'
      ? ('sufficientvelocity' as const)
      : null
  if (site === null) {
    throw new Error('Invalid url')
  }
  const fsPath = path.resolve(__dirname, `../.temp/${id}.epub`)
  await convert({
    input: ao3.input({ url, site }),
    output: epub.output({
      path: fsPath,
      creator: 'mark-magic',
      id: 'mark-magic',
      title: 'test',
    }),
  }).on('generate', (it) => {
    console.log('generate', it.content.name)
  })
  setTimeout(async () => {
    if (await pathExists(fsPath)) {
      await remove(fsPath)
    }
  }, 1000 * 60 * 10)
  return `/api/download/${id}`
}

export async function download(id: string) {
  const fsPath = path.resolve(__dirname, `../.temp/${id}.epub`)
  if (!(await pathExists(fsPath))) {
    throw new Error('File not found')
  }
  return await readFile(fsPath)
}
