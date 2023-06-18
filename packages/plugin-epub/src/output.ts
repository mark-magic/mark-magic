import { OutputPlugin } from '@mark-magic/core'
import { EpubBuilder, GenerateOptions, MetaData, Toc, Chapter } from '@mark-magic/epub'
import { Image, Link, fromMarkdown, selectAll, toHtml } from '@liuli-util/markdown-util'
import { v4 } from 'uuid'
import { treeMap } from '@liuli-util/tree'
import { readFile, writeFile } from 'fs/promises'
import pathe from 'pathe'
import { extractZipToFolder } from '@mark-magic/utils'
import { keyBy } from 'lodash-es'
import path from 'path'
import { extractResourceId, isContentLink, isResourceLink } from './utils'

interface RenderNavToc extends Omit<Toc, 'id' | 'chapterId' | 'children'> {
  /** 标题 */
  title: string
  /** 路径 */
  path: string
  /** 子目录，注意，它会被扁平化生成 spine */
  children?: RenderNavToc[]
}

export function sortChapter<T extends Pick<RenderNavToc, 'path'>>(chapters: T[]): T[] {
  return chapters.sort((a, b) => {
    const aPath = a.path
    const bPath = b.path

    // Rule 1: 'cover' should be at the first
    if (aPath === 'cover') return -1
    if (bPath === 'cover') return 1

    // Rule 2: 'readme.md' or 'index.md' should be at the first in its directory
    const aDir = pathe.dirname(aPath)
    const bDir = pathe.dirname(bPath)

    const aFileName = pathe.basename(aPath)
    const bFileName = pathe.basename(bPath)

    if (aDir === bDir) {
      if (['readme.md', 'index.md'].includes(aFileName!)) return -1
      if (['readme.md', 'index.md'].includes(bFileName!)) return 1
    }

    // Default: natural sort
    return aPath.localeCompare(bPath)
  })
}

export function output(options: { metadata: MetaData; toc: RenderNavToc[]; output: string }): OutputPlugin {
  const _options: Omit<GenerateOptions, 'text'> & {
    text: (Chapter & {
      path: string
    })[]
  } = {
    metadata: options.metadata,
    media: [],
    text: [],
    toc: [],
  }
  const map = new Map<string, string>()
  return {
    name: 'epub',
    async start() {
      const id = v4() + pathe.extname(options.metadata.cover)
      _options.media.push({
        id: id,
        buffer: await readFile(options.metadata.cover),
      })
      _options.metadata.cover = id
      _options.text.push({
        id: 'cover',
        title: 'cover',
        path: 'cover',
        content: `<svg
          xmlns="http://www.w3.org/2000/svg"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          version="1.1"
          viewBox="0 0 1352 2000"
          width="100%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <image width="1352" height="2000" xlink:href="../Media/${id}" />
        </svg>`,
      })
    },
    async handle(content) {
      const root = fromMarkdown(content.content)
      const resourceMap = keyBy(content.resources, (it) => it.id)
      ;(selectAll('image', root) as Image[])
        .filter((it) => isResourceLink(it.url))
        .forEach((it) => {
          const id = extractResourceId(it.url)
          it.url = '../Media/' + extractResourceId(it.url) + pathe.extname(resourceMap[id].name)
        })
      ;(selectAll('link', root) as Link[])
        .filter((it) => isContentLink(it.url))
        .forEach((it) => {
          it.url = './' + extractResourceId(it.url) + '.xhtml'
        })
      const c: Chapter & {
        path: string
      } = {
        id: content.id,
        title: content.name,
        content: toHtml(root),
        path: pathe.join(...content.path),
      }
      _options.text.push(c)
      content.resources.forEach((it) => {
        _options.media.push({
          id: it.id + path.extname(it.name),
          buffer: it.raw,
        })
      })
      map.set(pathe.join(...content.path), content.id)
    },
    async end() {
      _options.toc = treeMap(
        options.toc,
        (it) => {
          return {
            id: v4(),
            title: it.title,
            chapterId: map.get(it.path)!,
            children: it.children,
          } as Toc
        },
        {
          id: 'path',
          children: 'children',
        },
      )
      _options.text = sortChapter(_options.text)
      const zip = new EpubBuilder().gen(_options)
      const debugDirPath = pathe.join(pathe.dirname(options.output), pathe.basename(options.output, '.epub'))
      await extractZipToFolder(zip, debugDirPath)
      await writeFile(pathe.resolve(options.output), await zip.generateAsync({ type: 'nodebuffer' }))
    },
  }
}
