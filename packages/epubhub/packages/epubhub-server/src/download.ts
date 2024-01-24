import { convert } from '@mark-magic/core'
import * as ao3 from '@mark-magic/plugin-ao3'
import * as epub from '@mark-magic/plugin-epub'
import path from 'pathe'
import { nanoid } from 'nanoid'
import { pathExists, remove } from 'fs-extra/esm'
import { LRUCache } from 'lru-cache'
import { readFile } from 'fs/promises'

const cache = new LRUCache<string, string>({
  max: 100,
  ttl: 1000 * 60 * 10,
})

export async function generate(url: string): Promise<string> {
  const id = nanoid()
  const fsPath = path.resolve(__dirname, `../.temp/${id}.epub`)
  const input = ao3.input({ url })
  if (!input.match()) {
    throw new Error('Invalid url ')
  }
  const meta = await input.getMeta?.()
  await convert({
    input,
    output: epub.output({
      path: fsPath,
      id: meta?.id ?? id,
      title: meta?.name ?? id,
      creator: meta?.creator.name ?? 'mark-magic',
      publisher: 'mark-magic',
    }),
  }).on('generate', (it) => {
    console.log('generate', it.content.name)
  })
  if (meta) {
    cache.set(id, meta?.name ?? id)
  }
  console.log('generated', url, meta.name)
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
  return {
    name: encodeURIComponent(cache.get(id) ?? id),
    data: await readFile(fsPath),
  }
}
