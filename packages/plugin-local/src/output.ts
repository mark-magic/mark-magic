import { AsyncArray } from '@liuli-util/async'
import { mkdirp, readFile, remove, writeFile } from '@liuli-util/fs-extra'
import pathe from 'pathe'
import {
  extractContentId,
  extractResourceId,
  isContentLink,
  isResourceLink,
  type Content,
  type OutputPlugin,
  type Resource,
} from '@mark-magic/core'
import { fromMarkdown, Link, Root, setYamlMeta, toMarkdown, Image, selectAll, HTML } from '@liuli-util/markdown-util'
import filenamify from 'filenamify'
import { keyBy } from 'lodash-es'
import { Required, ValuesType } from 'utility-types'
import { BiMultiMap } from '@mark-magic/utils'
import { parse } from 'node-html-parser'
import { formatRelative } from './utils'

export function defaultOptions(
  options: Required<Partial<OutputOptions>, 'rootNotePath' | 'rootResourcePath'>,
): OutputOptions {
  return {
    meta: calcMeta,
    notePath: (note) => pathe.resolve(options.rootNotePath, note.path.join('/'), filenamify(note.name) + '.md'),
    resourcePath: (resource) => pathe.resolve(options.rootResourcePath, filenamify(resource.name)),
    noteLink: ({ notePath, linkNotePath }) => formatRelative(pathe.relative(pathe.dirname(notePath), linkNotePath)),
    resourceLink: ({ notePath, resourcePath }) => formatRelative(pathe.relative(pathe.dirname(notePath), resourcePath)),
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
  note: Content
  noteMap: BiMultiMap<string, string>
  resourceMap: BiMultiMap<string, string>
  fsPath: string
} & Pick<OutputOptions, 'noteLink' | 'resourceLink'>) {
  const urls = (selectAll('image,link', root) as (Image | Link)[]).filter(
    (it) => isContentLink(it.url) || isResourceLink(it.url),
  )
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
    .filter((it) => isContentLink(it.dom.attrs.src) || isResourceLink(it.dom.attrs.src))
  htmls.forEach((it) => {
    const dom = it.dom
    const src = dom.getAttribute('src')!
    if (isResourceLink(src)) {
      const id = extractResourceId(src)
      const resource = map[id]
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
      const id = extractContentId(src)
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
    if (isResourceLink(item.url)) {
      const id = extractResourceId(item.url)
      const resource = map[id]
      // item.url = formatRelative(path.relative(dirPath, resourceMap.get(id)!))
      item.url = resourceLink({
        resource,
        notePath: fsPath,
        resourcePath: resourceMap.get(id)!,
      })!
    } else {
      const id = extractContentId(item.url)
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

export interface LocalNoteMeta extends Pick<Content, 'name' | 'created' | 'updated'> {
  // tags: string[]
}

export function calcMeta(note: Content): LocalNoteMeta {
  return {
    name: note.name,
    // tags: note.tags.map((item) => item.title),
    created: note.created,
    updated: note.updated,
  }
}

export interface OutputOptions {
  rootNotePath: string
  rootResourcePath: string
  meta(note: Content): any
  notePath(note: Content): string
  resourcePath(note: Resource): string
  noteLink(o: { note: Content; notePath: string; linkNotePath: string; linkNoteId: string }): string | undefined
  resourceLink(o: { resource: Resource; notePath: string; resourcePath: string }): string | undefined
}

export function output(options: OutputOptions): OutputPlugin {
  const _options = defaultOptions(options)
  const resourceMap = new BiMultiMap<string, string>(),
    noteMap = new BiMultiMap<string, string>(),
    afterList: { fsPath: string; note: Content }[] = []
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
          const ext = pathe.extname(item.name)
          fsPath = pathe.resolve(
            pathe.dirname(fsPath),
            pathe.basename(filenamify(item.name), ext) + '_' + item.id + ext,
          )
        }
        resourceMap.set(item.id, fsPath)
        await writeFile(fsPath, item.raw)
      })

      // let fsPath = path.resolve(options.rootNotePath, note.path.join('/'), filenamify(note.name) + '.md')
      let fsPath = _options.notePath(note)
      if (noteMap.has(fsPath)) {
        fsPath = pathe.resolve(
          _options.rootNotePath,
          note.path.join('/'),
          filenamify(note.name) + '_' + note.id + '.md',
        )
      }
      noteMap.set(note.id, fsPath)
      const root = fromMarkdown(note.content)
      setYamlMeta(root, _options.meta(note))
      const isAfter = convertLinks({ root, note, fsPath, noteMap, resourceMap, ..._options })
      if (isAfter) {
        afterList.push({ fsPath, note })
      }
      await mkdirp(pathe.dirname(fsPath))
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
