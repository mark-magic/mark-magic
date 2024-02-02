import { Content } from '@mark-magic/core'
import { InputConfig, NovelInputPlugin, NovelMeta, renderReadme } from './utils'
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
  name: string
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
    name: title,
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

async function fetchPage(origin: string, threadId: string, page: number): Promise<string> {
  const url = `${origin}/threads/${threadId}/reader/page-${page}`
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

function extractReadmeFromHTML(
  html: string,
): Pick<ChapterData, 'content' | 'created' | 'updated'> & Omit<NovelMeta, 'id'> {
  const $dom = parse(html)
  const title = $dom.querySelector('.p-title-value')?.textContent.trim()
  if (!title) {
    throw new Error('无法提取标题')
  }
  const content = $dom.querySelector('.threadmarkListingHeader-content .bbWrapper')?.textContent.trim()
  if (!content) {
    throw new Error('无法提取简介')
  }
  const createdStr = $dom.querySelector('.threadmarkListingHeader-content .u-dt')?.getAttribute('data-time')
  if (!createdStr) {
    throw new Error('无法提取创建时间')
  }
  let updatedStr = $dom
    .querySelector('.threadmarkListingHeader-content .u-dt[itemprop="dateModified"]')
    ?.getAttribute('data-time')
  if (!updatedStr) {
    updatedStr = createdStr
  }
  const $creator = $dom.querySelector('.p-description .username')
  if (!$creator) {
    throw new Error('无法提取作者')
  }
  const creatorName = $creator.textContent?.trim()
  if (!creatorName) {
    throw new Error('无法提取作者')
  }
  const creatorLink = $creator.getAttribute('href')
  if (!creatorLink) {
    throw new Error('无法提取作者链接')
  }
  const originUrl = $dom.querySelector('meta[property="og:url"]')?.getAttribute('content')
  if (!originUrl) {
    throw new Error('无法提取原始链接')
  }
  return {
    name: title,
    content,
    creator: { name: creatorName, url: path.join(new URL(originUrl).origin, creatorLink) },
    created: new Date(createdStr).getTime(),
    updated: new Date(updatedStr).getTime(),
  }
}

export function sufficientvelocity(
  options: Pick<InputConfig, 'url'> & {
    cached?: boolean
  },
): NovelInputPlugin {
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
      const u = new URL(options.url)
      async function fetchPageOfCache(id: string, page: number): Promise<string> {
        if (!options.cached) {
          return await fetchPage(u.origin, id, page)
        }
        const key = `thread-${id}-page-${page}`
        if (!map[key]) {
          map[key] = await fetchPage(u.origin, id, page)
        }
        return map[key]
      }
      try {
        // 提取 id
        const id = extractId(options.url)
        // 根据 id 提取第一页的数据，并获取总页数
        const firstHtml = await fetchPageOfCache(id, 1)
        const pages = extractPagesFromHTML(firstHtml)
        const readme = extractReadmeFromHTML(firstHtml)
        yield {
          id: `${id}_readme`,
          name: 'readme',
          content: renderReadme({ ...readme, url: options.url }),
          path: ['readme.md'],
          created: readme.created,
          updated: readme.updated,
          resources: [],
        }
        const len = ((pages - 1) * 10).toString().length
        for (let i = 1, k = 1; i <= pages; i++) {
          const html = await fetchPageOfCache(id, i)
          // 读取和提取一页的内容
          const chapters = extractFromHTML(html)
          if (chapters.length === 0) {
            const key = `thread-${id}-page-${i}`
            delete map[key]
            if (html.includes('Rating limit Exceeded')) {
              throw new Error(`无法提取第 ${i} 页，因为超过了论坛的访问速率限制，请稍后再试，所有已下载的内容已缓存`)
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
              content: '# ' + it.name + '\n\n' + it.content,
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
    match() {
      const list = ['https://forums.sufficientvelocity.com/threads', 'https://forums.spacebattles.com/threads']
      return list.some((it) => options.url.startsWith(it))
    },
    async getMeta() {
      const id = extractId(options.url)
      const u = new URL(options.url)
      const firstHtml = await fetchPage(u.origin, id, 1)
      const readme = extractReadmeFromHTML(firstHtml)
      return { ...readme, id }
    },
  }
}
