import { OutputPlugin, extractResourceId, isContentLink, isResourceLink } from '@mark-magic/core'
import { EpubBuilder, GenerateOptions, Toc, Chapter } from '@mark-magic/epub'
import {
  Heading,
  Image,
  Link,
  fromMarkdown,
  selectAll,
  toString,
  mdToHast,
  hastToHtml,
} from '@liuli-util/markdown-util'
import { v4 } from 'uuid'
import { readFile, writeFile } from 'fs/promises'
import { mkdirp, pathExists } from 'fs-extra/esm'
import pathe from 'pathe'
import { keyBy } from 'lodash-es'
import path from 'path'
import { EpubOutputConfig } from './config.schema'
import { ISidebar, sortChapter, treeSidebarByPath } from '@mark-magic/utils'

export interface Sidebar extends Omit<Toc, 'children'>, ISidebar {
  /** 章节对应的内容路径，方便将其转换为 tree */
  path: string
  children?: Sidebar[]
}

export function output(
  options: EpubOutputConfig & {
    root?: string
  },
): OutputPlugin {
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

  const sidebars: Sidebar[] = []
  return {
    name: 'epub',
    async start() {
      if (!options.metadata.cover) {
        return
      }
      if (!path.isAbsolute(options.metadata.cover)) {
        options.metadata.cover = path.resolve(options.root || process.cwd(), options.metadata.cover)
        if (!(await pathExists(options.metadata.cover))) {
          throw new Error(`cover don't resolve ${options.metadata.cover}`)
        }
      }
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
      const findHeader = (selectAll('heading', root) as Heading[]).find((it) => it.depth === 1)
      if (findHeader?.children[0]) {
        content.name = toString(findHeader.children[0])
      }
      const sidebar: Sidebar = {
        id: content.id,
        title: content.name,
        path: pathe.join(...content.path),
        chapterId: content.id,
      }
      sidebars.push(sidebar)
      const c: Chapter & {
        path: string
      } = {
        id: content.id,
        title: content.name,
        content: hastToHtml(mdToHast(root)!, {
          closeSelfClosing: true,
        }),
        path: pathe.join(...content.path),
      }
      _options.text.push(c)
      content.resources.forEach((it) => {
        _options.media.push({
          id: it.id + path.extname(it.name),
          buffer: it.raw,
        })
      })
    },
    async end() {
      _options.toc = treeSidebarByPath(sidebars)
      _options.text = sortChapter(_options.text)
      const zip = new EpubBuilder().gen(_options)
      // const debugDirPath = pathe.join(pathe.dirname(options.path), pathe.basename(options.path, '.epub'))
      // await extractZipToFolder(zip, debugDirPath)
      await mkdirp(pathe.dirname(options.path))
      await writeFile(pathe.resolve(options.path), await zip.generateAsync({ type: 'nodebuffer' }))
    },
  }
}
