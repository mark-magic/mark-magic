import { AsyncArray } from '@liuli-util/async'
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
import { dropRight, keyBy } from 'lodash-es'
import { Required } from 'utility-types'
import { BiMultiMap } from '@mark-magic/utils'
import { parse } from 'node-html-parser'
import { formatRelative } from './utils'
import { mkdirp, remove } from 'fs-extra/esm'
import { readFile, writeFile } from 'fs/promises'
import { LocalOutputConfig } from './config.schema'
import path from 'pathe'

const ResourceDirName = 'resources'

export function defaultOptions(options: Required<Partial<OutputOptions>, 'path'>): OutputOptions {
  return {
    contentPath: (content) =>
      pathe.resolve(options.path, dropRight(content.path, 1).join('/'), filenamify(content.name) + '.md'),
    resourcePath: (resource) => pathe.resolve(options.path, ResourceDirName, filenamify(resource.name)),
    contentLink: ({ contentPath: contentPath, linkContentPath: linkContentPath }) =>
      formatRelative(pathe.relative(pathe.dirname(contentPath), linkContentPath)),
    resourceLink: ({ contentPath: contentPath, resourcePath }) =>
      formatRelative(pathe.relative(pathe.dirname(contentPath), resourcePath)),
    ...options,
  }
}

export function convertLinks(
  {
    root,
    content,
    contentMap,
    resourceMap,
    fsPath,
    contentLink,
    resourceLink,
  }: {
    root: Root
    content: Content
    contentMap: BiMultiMap<string, string>
    resourceMap: BiMultiMap<string, string>
    fsPath: string
  } & Pick<OutputOptions, 'contentLink' | 'resourceLink'>,
  after?: boolean,
) {
  const urls = (selectAll('image,link', root) as (Image | Link)[]).filter(
    (it) => isContentLink(it.url) || isResourceLink(it.url),
  )
  const map = keyBy(content.resources, (item) => item.id)
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
          contentPath: fsPath,
          resourcePath: resourceMap.get(id)!,
        })!,
      )
    } else {
      const href = extractContentId(src)
      const [id, hash] = href.split('#')
      if (!after && !contentMap.has(id)) {
        isAfter = true
        return
      }
      // item.url = formatRelative(path.relative(dirPath, contentMap.get(id)!))
      dom.setAttribute(
        'src',
        contentLink({
          content: content,
          contentPath: fsPath,
          linkContentPath: contentMap.get(id)!,
          linkContentId: id,
          linkContentHash: hash,
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
        contentPath: fsPath,
        resourcePath: resourceMap.get(id)!,
      })!
    } else {
      const href = extractContentId(item.url)
      const [id, hash] = href.split('#')
      if (!after && !contentMap.has(id)) {
        isAfter = true
        return
      }
      // item.url = formatRelative(path.relative(dirPath, contentMap.get(id)!))
      item.url = contentLink({
        content: content,
        contentPath: fsPath,
        linkContentPath: contentMap.get(id)!,
        linkContentId: id,
        linkContentHash: hash,
      })!
    }
  })
  return isAfter
}

export interface LocalContentMeta extends Pick<Content, 'name' | 'created' | 'updated'> {
  // tags: string[]
}

export interface OutputOptions extends LocalOutputConfig {
  meta?(content: Content): any
  contentPath(content: Content): string
  resourcePath(resource: Resource): string
  contentLink(o: {
    content: Content
    contentPath: string
    linkContentPath: string
    linkContentId: string
    linkContentHash?: string
  }): string | undefined
  resourceLink(o: { resource: Resource; contentPath: string; resourcePath: string }): string | undefined
}

export function output(options: Required<Partial<OutputOptions>, 'path'>): OutputPlugin {
  const _options = defaultOptions(options)
  const resourceMap = new BiMultiMap<string, string>(),
    contentMap = new BiMultiMap<string, string>(),
    afterList: { fsPath: string; content: Content }[] = []
  return {
    name: 'local',
    async start() {
      const rootResourcePath = path.resolve(_options.path, ResourceDirName)
      await Promise.all([remove(_options.path), remove(rootResourcePath)])
      await Promise.all([mkdirp(_options.path), mkdirp(rootResourcePath)])
    },
    async handle(content) {
      await AsyncArray.forEach(content.resources, async (it) => {
        // Check if the resource has been processed
        if (resourceMap.has(it.id)) {
          return
        }
        let fsPath = _options.resourcePath(it)
        if (resourceMap.has(fsPath)) {
          const ext = pathe.extname(it.name)
          fsPath = pathe.resolve(pathe.dirname(fsPath), pathe.basename(filenamify(it.name), ext) + '_' + it.id + ext)
        }
        resourceMap.set(it.id, fsPath)
        await mkdirp(pathe.dirname(fsPath))
        await writeFile(fsPath, it.raw)
      })

      // let fsPath = path.resolve(options.path, content.path.join('/'), filenamify(content.name) + '.md')
      let fsPath = _options.contentPath(content)
      if (contentMap.has(fsPath)) {
        fsPath = pathe.resolve(
          _options.path,
          content.path.join('/'),
          filenamify(content.name) + '_' + content.id + '.md',
        )
      }
      contentMap.set(content.id, fsPath)
      const root = fromMarkdown(content.content)
      if (_options.meta) {
        setYamlMeta(root, _options.meta(content))
      }
      const isAfter = convertLinks({ root, content, fsPath, contentMap: contentMap, resourceMap, ..._options })
      if (isAfter) {
        afterList.push({ fsPath, content: content })
      }
      await mkdirp(pathe.dirname(fsPath))
      await writeFile(fsPath, toMarkdown(root))
    },
    async end() {
      await AsyncArray.forEach(afterList, async (item) => {
        const root = fromMarkdown(await readFile(item.fsPath, 'utf-8'))
        convertLinks({ ...item, root, contentMap: contentMap, resourceMap, ..._options }, true)
        await writeFile(item.fsPath, toMarkdown(root))
      })
    },
  }
}
