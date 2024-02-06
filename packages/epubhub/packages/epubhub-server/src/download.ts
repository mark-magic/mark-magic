import { convert } from '@mark-magic/core'
import * as ao3 from '@mark-magic/plugin-ao3'
import * as epub from '@mark-magic/plugin-epub'
import * as local from '@mark-magic/plugin-local'
import * as imageFetcher from '@mark-magic/plugin-image-fetcher'
import path from 'pathe'
import { nanoid } from 'nanoid'
import { pathExists, remove } from 'fs-extra/esm'
import { LRUCache } from 'lru-cache'
import { readFile } from 'fs/promises'
import JSZip from 'jszip'
import { readdir, stat } from 'fs/promises'

const cache = new LRUCache<string, string>({
  max: 100,
  ttl: 1000 * 60 * 10,
})

export async function generate(url: string): Promise<string> {
  const id = nanoid()
  const input = ao3.input({ url })
  if (!input.match()) {
    throw new Error('Invalid url ')
  }
  const meta = await input.getMeta?.()
  const tempDir = path.resolve(__dirname, `../.temp/${id}`)
  await convert({
    input,
    transforms: [imageFetcher.transform()],
    output: local.output({
      path: tempDir,
    }),
  }).on('generate', (it) => {
    console.log('fetch', it.content.name)
  })
  const fsPath = tempDir + '.epub'
  await convert({
    input: local.input({ path: tempDir }),
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

export async function downloadMarkdownZip(id: string) {
  const dirPath = path.resolve(__dirname, `../.temp/${id}`)
  if (!(await pathExists(dirPath))) {
    throw new Error('File not found')
  }
  const zip = new JSZip()

  async function addFilesToZip(folderPath: string, zip: JSZip) {
    const files = await readdir(folderPath)
    for (const file of files) {
      const filePath = path.join(folderPath, file)
      const fileStats = await stat(filePath)
      if (fileStats.isDirectory()) {
        await addFilesToZip(filePath, zip.folder(file)!)
      } else {
        const fileData = await readFile(filePath)
        zip.file(file, fileData)
      }
    }
  }

  await addFilesToZip(dirPath, zip)

  const zipData = await zip.generateAsync({ type: 'nodebuffer' })

  return {
    name: encodeURIComponent(cache.get(id) ?? id),
    data: zipData,
  }
}
