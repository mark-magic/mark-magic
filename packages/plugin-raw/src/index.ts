import { AsyncArray } from '@liuli-util/async'
import { InputPlugin, Note, OutputPlugin } from '@mami/cli'
import { readFile, writeFile } from 'fs/promises'
import JSZip from 'jszip'
import { omit } from 'lodash-es'
import path from 'path'

export function input(options: { path: string }): InputPlugin {
  return {
    name: 'raw',
    async *generate() {
      const zip = new JSZip()
      await zip.loadAsync(await readFile(options.path))
      for (const item of zip.filter((rel, item) => rel.startsWith('/note/') && !item.dir)) {
        const note = JSON.parse(await item.async('text')!) as Note
        yield {
          ...note,
          resources: await AsyncArray.map(note.resources, async (r) => {
            r.raw = await zip.file(`/resources/${r.id}`)!.async('nodebuffer')
            return r
          }),
        } as Note
      }
    },
  }
}

export function output(options: { path: string }): OutputPlugin {
  let zip: JSZip
  return {
    name: 'raw',
    async start() {
      zip = new JSZip()
    },
    async handle(note) {
      note.resources.forEach((res) => {
        zip.file(`/resources/${res.id}`, res.raw)
      })
      zip.file(
        `/note/${note.id}`,
        JSON.stringify({
          ...note,
          resources: note.resources.map((item) => omit(item, 'raw')),
        } as Note),
      )
    },
    async end() {
      await writeFile(path.resolve(options.path), await zip.generateAsync({ type: 'nodebuffer' }))
    },
  }
}
