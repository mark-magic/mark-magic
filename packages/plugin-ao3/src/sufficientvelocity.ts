import { Content, InputPlugin } from '@mark-magic/core'
import { InputConfig } from './utils'
import { parse, HTMLElement } from 'node-html-parser'
import { fromHtml } from 'hast-util-from-html'
import { toMdast } from 'hast-util-to-mdast'
import { toMarkdown, u } from '@liuli-util/markdown-util'
import findCacheDirectory from 'find-cache-dir'
import path from 'pathe'
import { mkdirp, pathExists, readJson, writeJson } from 'fs-extra/esm'
import { mkdir, writeFile } from 'fs/promises'

/**
 * 提取 sufficientvelocity 的 id
 * @example https://forums.sufficientvelocity.com/threads/2538/
 * @example https://forums.sufficientvelocity.com/threads/puella-magi-adfligo-systema.2538/
 * @example https://forums.sufficientvelocity.com/threads/puella-magi-adfligo-systema.2538/reader/
 * @example https://forums.sufficientvelocity.com/threads/puella-magi-adfligo-systema.2538/reader/page-2
 * @example https://forums.sufficientvelocity.com/threads/puella-magi-adfligo-systema.2538/post-288898
 * @param url
 */
export function extractId(url: string): string {
  const r = /threads\/(?:.*?\.)?(\d+)/.exec(url)
  if (r == null) {
    throw new Error(`无法从 ${url} 中提取 id`)
  }
  return r[1]
}

interface ChapterData {
  id: string
  title: string
  content: string
  created: number
  updated: number
}

function extractChapterFromHTML($it: HTMLElement): ChapterData {
  const id = $it.getAttribute('data-content')?.slice('post-'.length)
  if (!id) {
    throw new Error('无法提取 id')
  }
  const title = $it.querySelector('.threadmarkLabel')?.textContent?.trim()
  if (!title) {
    throw new Error('无法提取标题 ' + id)
  }
  const createdStr = $it.querySelector('time[itemprop="datePublished"]')?.getAttribute('datetime')
  if (!createdStr) {
    throw new Error('无法提取创建时间 ' + id)
  }
  const created = new Date(createdStr).getTime()

  const updatedStr = $it.querySelector('time[itemprop="dateModified"]')?.getAttribute('datetime')
  const updated = updatedStr ? new Date(updatedStr).getTime() : created
  const htmlContent = $it.querySelector('.message-body .bbWrapper')?.innerHTML
  if (!htmlContent) {
    throw new Error('无法提取内容 ' + id)
  }
  const hast = fromHtml(htmlContent, { fragment: true })
  const mdast = toMdast(hast as any, {
    // 转换 <br/> 为 \n，ref: https://github.com/syntax-tree/hast-util-to-mdast/issues/66#issuecomment-941930366
    handlers: {
      br() {
        return u('text', '\n')
      },
    },
  })
  return {
    id,
    title,
    content: toMarkdown(mdast as any),
    created,
    updated,
  } as ChapterData
}

export function extractFromHTML(html: string): ChapterData[] {
  const $dom = parse(html)
  const chapters = Array.from($dom.querySelectorAll('.block-body.js-replyNewMessageContainer > .message')).map(
    extractChapterFromHTML,
  )
  return chapters
}

export function extractPagesFromHTML(html: string): number {
  const $dom = parse(html)
  const pagesStr = $dom.querySelector('input.js-pageJumpPage')?.getAttribute('max')
  if (!pagesStr) {
    return 1
  }
  return Number.parseInt(pagesStr)
}

async function fetchPage(threadId: string, page: number): Promise<string> {
  const url = `https://forums.sufficientvelocity.com/threads/${threadId}/reader/page-${page}`
  const r = await fetch(url)
  if (!r.ok) {
    throw new Error(`无法获取 ${url} 的内容，状态码为 ${r.status}，${r.statusText}`)
  }
  return r.text()
}

export function getCachePath() {
  const dir = findCacheDirectory({ name: '@mark-magic/plugin-ao3' })
  if (!dir) {
    throw new Error('无法找到缓存目录')
  }
  return path.resolve(dir, 'sufficientvelocity.json')
}

export function sufficientvelocity(
  options: Pick<InputConfig, 'url'> & {
    cached?: boolean
  },
): InputPlugin {
  return {
    name: 'sufficientvelocity',
    async *generate() {
      let map: Record<string, string> = {}
      if (options.cached) {
        const cachePath = getCachePath()
        if (await pathExists(cachePath)) {
          Object.assign(map, await readJson(cachePath))
        }
      }
      async function fetchPageOfCache(id: string, page: number): Promise<string> {
        if (!options.cached) {
          return await fetchPage(id, page)
        }
        const key = `thread-${id}-page-${page}`
        if (!map[key]) {
          map[key] = await fetchPage(id, page)
        }
        return map[key]
      }
      try {
        // 提取 id
        const id = extractId(options.url)
        // 根据 id 提取第一页的数据，并获取总页数
        const html = await fetchPageOfCache(id, 1)
        const pages = extractPagesFromHTML(html)
        const len = ((pages - 1) * 10).toString().length
        for (let i = 1, k = 1; i <= pages; i++) {
          const html = await fetchPageOfCache(id, i)
          // 读取和提取一页的内容
          const chapters = extractFromHTML(html)
          if (chapters.length === 0) {
            const key = `thread-${id}-page-${i}`
            delete map[key]
            if (html.includes('Rating limit Exceeded')) {
              throw new Error(`无法提取第 ${i} 页，因为超过了论坛的访问速率限制，请稍后再试`)
            }
            throw new Error('无法提取章节')
          }
          await mkdirp(path.resolve(__dirname, `.temp`))
          await writeFile(path.resolve(__dirname, `.temp/${id}-${i}.html`), html)
          for (const it of chapters) {
            const name = k.toString().padStart(len, '0')
            yield {
              id: it.id,
              name,
              content: '# ' + it.title + '\n\n' + it.content,
              path: [name + '.md'],
              created: it.created,
              updated: it.updated,
              resources: [],
            } as Content
            k++
          }
        }
      } finally {
        if (options.cached) {
          const cachePath = getCachePath()
          await mkdir(path.dirname(cachePath), { recursive: true })
          await writeJson(cachePath, map)
        }
      }
    },
  }
}