import { AsyncArray } from '@liuli-util/async'
import { mkdirp, readFile, writeFile } from '@liuli-util/fs-extra'
import path from 'path'
import type { Note, OutputPlugin } from '@mami/cli'
import { fromMarkdown, toMarkdown } from '@liuli-util/markdown-util'
import { addMeta } from './utils/addMeta'
import { convertLinks } from './utils/convertLinks'
import { BiMultiMap } from './utils/BiMultiMap'

export function localDirOutput(options: { root: string }): OutputPlugin {
  const resourcePath = path.resolve(options.root, '_resources'),
    resourceMap = new BiMultiMap<string, string>(),
    noteMap = new BiMultiMap<string, string>(),
    afterList: { fsPath: string; note: Note }[] = []
  return {
    name: 'hexoOutput',
    async config() {
      await mkdirp(resourcePath)
    },
    async handle(note) {
      await AsyncArray.forEach(note.resources, async (item) => {
        let fsPath = path.resolve(resourcePath, item.title)
        if (resourceMap.has(fsPath)) {
          const ext = path.extname(item.title)
          fsPath = path.basename(item.title, ext) + '_' + item.id + ext
        }
        await writeFile(fsPath, item.raw)
        resourceMap.set(item.id, fsPath)
      })

      let fsPath = path.resolve(options.root, note.path.join('/'), note.title + '.md')
      if (noteMap.has(fsPath)) {
        fsPath = path.resolve(options.root, note.path.join('/'), note.title + '_' + note.id + '.md')
      }
      noteMap.set(note.id, fsPath)
      const root = fromMarkdown(note.content)
      addMeta(root, note)
      const isAfter = convertLinks({ root, note, fsPath, noteMap, resourceMap })
      if (isAfter) {
        afterList.push({ fsPath, note })
      }
      await mkdirp(path.dirname(fsPath))
      await writeFile(fsPath, toMarkdown(root))
    },
    async end() {
      await AsyncArray.forEach(afterList, async (item) => {
        const root = fromMarkdown(await readFile(item.fsPath, 'utf-8'))
        convertLinks({ ...item, root, noteMap, resourceMap })
        await writeFile(item.fsPath, toMarkdown(root))
      })
    },
  }
}
