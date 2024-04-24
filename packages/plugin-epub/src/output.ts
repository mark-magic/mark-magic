import { OutputPlugin, extractResourceId, isContentLink, isResourceLink } from '@mark-magic/core'
import { EpubBuilder, GenerateOptions, Toc, Chapter, MetaData } from '@mark-magic/epub'
import {
  Heading,
  Image,
  Link,
  fromMarkdown,
  selectAll,
  toString,
  mdToHast,
  hastToHtml,
  getYamlMeta,
  breaksFromMarkdown,
} from '@liuli-util/markdown-util'
import { v4 } from 'uuid'
import { readFile, writeFile } from 'fs/promises'
import { mkdirp, pathExists } from 'fs-extra/esm'
import pathe from 'pathe'
import { keyBy, pick } from 'lodash-es'
import path from 'path'
import { EpubOutputConfig } from './config.schema'
import { ISidebar, sortChapter, treeSidebarByPath } from '@mark-magic/utils'
import { cjk } from 'mdast-util-cjk-space-clean'

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
    metadata: {
      language: 'en-US',
      publisher: 'mark-magic',
      ...options,
    } as MetaData,
    media: [],
    text: [],
    toc: [],
  }

  const sidebars: Sidebar[] = []
  return {
    name: 'epub',
    async start() {},
    async handle(content) {
      const root = fromMarkdown(content.content, {
        mdastExtensions: [breaksFromMarkdown(), cjk()],
      })
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
      if (content.path.length === 1 && content.path[0].toLowerCase() === 'readme.md') {
        const meta = getYamlMeta(root)
        if (meta && typeof meta === 'object' && 'book' in meta && typeof meta.book === 'object') {
          _options.metadata = {
            ..._options.metadata,
            ...pick(meta.book, ['id', 'title', 'creator', 'publisher', 'language', 'cover']),
          }
        }
      }
    },
    async end() {
      _options.metadata.id = _options.metadata.id ?? v4()
      if (_options.metadata.cover) {
        if (!path.isAbsolute(_options.metadata.cover)) {
          _options.metadata.cover = path.resolve(options.root || process.cwd(), _options.metadata.cover)
          if (!(await pathExists(_options.metadata.cover))) {
            throw new Error(`cover don't resolve ${options.cover}`)
          }
        }
        const id = v4() + pathe.extname(_options.metadata.cover)
        _options.media.push({
          id,
          buffer: await readFile(_options.metadata.cover),
        })
        _options.metadata.cover = id
        _options.text.unshift({
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
      }

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
