import { AsyncArray } from '@liuli-util/async'
import { mkdirp, readFile, writeFile } from '@liuli-util/fs-extra'
import path from 'path'
import type { Note, OutputPlugin } from '@mami/cli'
import { fromMarkdown, setYamlMeta, toMarkdown } from '@liuli-util/markdown-util'
import { calcMeta } from './utils/calcMeta'
import { convertLinks } from './utils/convertLinks'
import { BiMultiMap } from './utils/BiMultiMap'
import filenamify from 'filenamify'

export function output(options: {
  noteRootPath: string
  resourceRootPath: string
  meta?(note: Note): any
}): OutputPlugin {
  const resourceMap = new BiMultiMap<string, string>(),
    noteMap = new BiMultiMap<string, string>(),
    afterList: { fsPath: string; note: Note }[] = []
  return {
    name: 'local',
    async start() {
      await mkdirp(options.noteRootPath)
      await mkdirp(options.resourceRootPath)
    },
    async handle(note) {
      await AsyncArray.forEach(note.resources, async (item) => {
        let fsPath = path.resolve(options.resourceRootPath, filenamify(item.title))
        if (resourceMap.has(fsPath)) {
          const ext = path.extname(item.title)
          fsPath = path.basename(filenamify(item.title), ext) + '_' + item.id + ext
        }
        await writeFile(fsPath, item.raw)
        resourceMap.set(item.id, fsPath)
      })

      let fsPath = path.resolve(options.noteRootPath, note.path.join('/'), filenamify(note.title) + '.md')
      if (noteMap.has(fsPath)) {
        fsPath = path.resolve(options.noteRootPath, note.path.join('/'), filenamify(note.title) + '_' + note.id + '.md')
      }
      noteMap.set(note.id, fsPath)
      const root = fromMarkdown(note.content)
      setYamlMeta(root, (options.meta ?? calcMeta)(note))
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
