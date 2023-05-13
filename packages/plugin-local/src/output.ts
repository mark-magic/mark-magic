import { AsyncArray } from '@liuli-util/async'
import { mkdirp, readFile, remove, writeFile } from '@liuli-util/fs-extra'
import path from 'path'
import type { Note, OutputPlugin, Resource } from '@mami/cli'
import { fromMarkdown, Link, Root, setYamlMeta, toMarkdown, Image, selectAll, HTML } from '@liuli-util/markdown-util'
import filenamify from 'filenamify'
import { keyBy } from 'lodash-es'
import { Required, ValuesType } from 'utility-types'
import { BiMultiMap } from '@mami/utils'
import { formatRelative } from './utils'
import { parse } from 'node-html-parser'

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
  const htmls = (selectAll('html', root) as HTML[])
    .filter((it) => ['<audio', '<video', '<img'].some((p) => it.value.startsWith(p)))
    .map((it) => {
      const htmlType = ['<audio', '<video', '<img'].find((p) => it.value.startsWith(p))!.slice(1)
      // console.log(it.value, htmlType)
      const dom = parse(it.value).querySelector(htmlType)!
      return {
        md: it,
        dom,
      }
      // dom.setAttribute('src', 'test')
      // console.log(dom.attributes.src)
      // console.log(dom.toString())
    })
    .filter((it) => it.dom.attrs.src.startsWith(':/'))
  htmls.forEach((it) => {
    const dom = it.dom
    const src = dom.getAttribute('src')!
    const id = src.slice(2)
    const resource = map[id]
    if (resource) {
      // item.url = formatRelative(path.relative(dirPath, resourceMap.get(id)!))
      dom.setAttribute(
        'src',
        resourceLink({
          resource,
          notePath: fsPath,
          resourcePath: resourceMap.get(id)!,
        })!,
      )
    } else {
      if (!noteMap.has(id)) {
        isAfter = true
        return
      }
      // item.url = formatRelative(path.relative(dirPath, noteMap.get(id)!))
      dom.setAttribute(
        'src',
        noteLink({
          note,
          notePath: fsPath,
          linkNotePath: noteMap.get(id)!,
          linkNoteId: id,
        })!,
      )
    }
    it.md.value = dom.toString()
  })
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
  const _options = defaultOptions(options)
  const resourceMap = new BiMultiMap<string, string>(),
    noteMap = new BiMultiMap<string, string>(),
    afterList: { fsPath: string; note: Note }[] = []
  return {
    name: 'local',
    async start() {
      await Promise.all([remove(_options.rootNotePath), remove(_options.rootResourcePath)])
      await mkdirp(_options.rootNotePath)
      await mkdirp(_options.rootResourcePath)
    },
    async handle(note) {
      await AsyncArray.forEach(note.resources, async (item) => {
        // let fsPath = path.resolve(options.rootResourcePath, filenamify(item.title))
        let fsPath = _options.resourcePath(item)
        if (resourceMap.has(fsPath)) {
          const ext = path.extname(item.title)
          fsPath = path.resolve(path.dirname(fsPath), path.basename(filenamify(item.title), ext) + '_' + item.id + ext)
        }
        resourceMap.set(item.id, fsPath)
        await writeFile(fsPath, item.raw)
      })

      // let fsPath = path.resolve(options.rootNotePath, note.path.join('/'), filenamify(note.title) + '.md')
      let fsPath = _options.notePath(note)
      if (noteMap.has(fsPath)) {
        fsPath = path.resolve(
          _options.rootNotePath,
          note.path.join('/'),
          filenamify(note.title) + '_' + note.id + '.md',
        )
      }
      noteMap.set(note.id, fsPath)
      const root = fromMarkdown(note.content)
      setYamlMeta(root, _options.meta(note))
      const isAfter = convertLinks({ root, note, fsPath, noteMap, resourceMap, ..._options })
      if (isAfter) {
        afterList.push({ fsPath, note })
      }
      await mkdirp(path.dirname(fsPath))
      await writeFile(fsPath, toMarkdown(root))
    },
    async end() {
      await AsyncArray.forEach(afterList, async (item) => {
        const root = fromMarkdown(await readFile(item.fsPath, 'utf-8'))
        convertLinks({ ...item, root, noteMap, resourceMap, ..._options })
        await writeFile(item.fsPath, toMarkdown(root))
      })
    },
  }
}
