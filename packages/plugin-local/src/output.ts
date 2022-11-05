import { AsyncArray } from '@liuli-util/async'
import { mkdirp, readFile, remove, writeFile } from '@liuli-util/fs-extra'
import path from 'path'
import type { Note, OutputPlugin } from '@mami/cli'
import { fromMarkdown, Link, Root, setYamlMeta, toMarkdown, visit, Image } from '@liuli-util/markdown-util'
import filenamify from 'filenamify'
import { keyBy } from 'lodash-es'
import { ValuesType } from 'utility-types'
import { BiMultiMap } from '@mami/utils'

function formatRelative(s: string): string {
  const prefix = ['./', '../']
  const r = s.replaceAll('\\', '/')
  return encodeURI(prefix.some((i) => r.startsWith(i)) ? r : './' + r)
}

export function convertLinks({
  root,
  note,
  noteMap,
  resourceMap,
  fsPath,
}: {
  root: Root
  note: { resources: Pick<ValuesType<Note['resources']>, 'id' | 'title'>[] }
  noteMap: BiMultiMap<string, string>
  resourceMap: BiMultiMap<string, string>
  fsPath: string
}) {
  const urls: (Image | Link)[] = []
  visit(root, (node) => {
    if (['image', 'link'].includes(node.type) && (node as Link).url.startsWith(':/')) {
      urls.push(node as Link)
    }
  })
  const map = keyBy(note.resources, (item) => item.id)
  let isAfter = false
  const dirPath = path.dirname(fsPath)
  urls.forEach((item) => {
    const id = item.url.slice(2)
    const resource = map[id]
    if (resource) {
      item.url = formatRelative(path.relative(dirPath, resourceMap.get(id)!))
    } else {
      if (!noteMap.has(id)) {
        isAfter = true
        return
      }
      item.url = formatRelative(path.relative(dirPath, noteMap.get(id)!))
    }
  })
  return isAfter
}

export interface LocalNoteMeta extends Pick<Note, 'title' | 'createAt' | 'updateAt'> {
  tags: string[]
}

export function calcMeta(note: Note): LocalNoteMeta {
  return {
    title: note.title,
    tags: note.tags.map((item) => item.title),
    createAt: note.createAt,
    updateAt: note.updateAt,
  }
}

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
      await Promise.all([remove(options.noteRootPath), remove(options.resourceRootPath)])
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
