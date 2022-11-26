import { AsyncArray } from '@liuli-util/async'
import { mkdirp, readFile, remove, writeFile } from '@liuli-util/fs-extra'
import path from 'path'
import type { Note, OutputPlugin, Resource } from '@mami/cli'
import { fromMarkdown, Link, Root, setYamlMeta, toMarkdown, visit, Image, selectAll } from '@liuli-util/markdown-util'
import filenamify from 'filenamify'
import { keyBy } from 'lodash-es'
import { Required, ValuesType } from 'utility-types'
import { BiMultiMap } from '@mami/utils'
import { formatRelative } from './utils'

export function defaultOptions(
  options: Required<Partial<OutputOptions>, 'rootNotePath' | 'rootResourcePath'>,
): OutputOptions {
  return {
    meta: calcMeta,
    notePath: (note) => path.resolve(options.rootNotePath, note.path.join('/'), filenamify(note.title) + '.md'),
    resourcePath: (resource) => path.resolve(options.rootResourcePath, filenamify(resource.title)),
    noteLink: ({ notePath, linkNotePath }) => formatRelative(path.relative(path.dirname(notePath), linkNotePath)),
    resourceLink: ({ notePath, resourcePath }) => formatRelative(path.relative(path.dirname(notePath), resourcePath)),
    ...options,
  }
}

export function convertLinks({
  root,
  note,
  noteMap,
  resourceMap,
  fsPath,
  noteLink,
  resourceLink,
}: {
  root: Root
  note: Note
  noteMap: BiMultiMap<string, string>
  resourceMap: BiMultiMap<string, string>
  fsPath: string
} & Pick<OutputOptions, 'noteLink' | 'resourceLink'>) {
  const urls = (selectAll('image,link', root) as (Image | Link)[]).filter((item) => item.url.startsWith(':/'))
  const map = keyBy(note.resources, (item) => item.id)
  let isAfter = false
  const dirPath = path.dirname(fsPath)
  urls.forEach((item) => {
    const id = item.url.slice(2)
    const resource = map[id]
    if (resource) {
      // item.url = formatRelative(path.relative(dirPath, resourceMap.get(id)!))
      item.url = resourceLink({
        resource,
        notePath: fsPath,
        resourcePath: resourceMap.get(id)!,
      })!
    } else {
      if (!noteMap.has(id)) {
        isAfter = true
        return
      }
      // item.url = formatRelative(path.relative(dirPath, noteMap.get(id)!))
      item.url = noteLink({
        note,
        notePath: fsPath,
        linkNotePath: noteMap.get(id)!,
        linkNoteId: id,
      })!
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

export interface OutputOptions {
  rootNotePath: string
  rootResourcePath: string
  meta(note: Note): any
  notePath(note: Note): string
  resourcePath(note: Resource): string
  noteLink(o: { note: Note; notePath: string; linkNotePath: string; linkNoteId: string }): string | undefined
  resourceLink(o: { resource: Resource; notePath: string; resourcePath: string }): string | undefined
}

export function output(options: OutputOptions): OutputPlugin {
  const resourceMap = new BiMultiMap<string, string>(),
    noteMap = new BiMultiMap<string, string>(),
    afterList: { fsPath: string; note: Note }[] = []
  return {
    name: 'local',
    async start() {
      await Promise.all([remove(options.rootNotePath), remove(options.rootResourcePath)])
      await mkdirp(options.rootNotePath)
      await mkdirp(options.rootResourcePath)
    },
    async handle(note) {
      await AsyncArray.forEach(note.resources, async (item) => {
        // let fsPath = path.resolve(options.rootResourcePath, filenamify(item.title))
        let fsPath = options.resourcePath(item)
        if (resourceMap.has(fsPath)) {
          const ext = path.extname(item.title)
          fsPath = path.basename(filenamify(item.title), ext) + '_' + item.id + ext
        }
        await writeFile(fsPath, item.raw)
        resourceMap.set(item.id, fsPath)
      })

      // let fsPath = path.resolve(options.rootNotePath, note.path.join('/'), filenamify(note.title) + '.md')
      let fsPath = options.notePath(note)
      if (noteMap.has(fsPath)) {
        fsPath = path.resolve(options.rootNotePath, note.path.join('/'), filenamify(note.title) + '_' + note.id + '.md')
      }
      noteMap.set(note.id, fsPath)
      const root = fromMarkdown(note.content)
      setYamlMeta(root, options.meta(note))
      const isAfter = convertLinks({ root, note, fsPath, noteMap, resourceMap, ...options })
      if (isAfter) {
        afterList.push({ fsPath, note })
      }
      await mkdirp(path.dirname(fsPath))
      await writeFile(fsPath, toMarkdown(root))
    },
    async end() {
      await AsyncArray.forEach(afterList, async (item) => {
        const root = fromMarkdown(await readFile(item.fsPath, 'utf-8'))
        convertLinks({ ...item, root, noteMap, resourceMap, ...options })
        await writeFile(item.fsPath, toMarkdown(root))
      })
    },
  }
}
