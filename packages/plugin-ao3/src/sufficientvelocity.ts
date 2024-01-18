import { Content, InputPlugin } from '@mark-magic/core'
import { InputConfig, html2md } from './utils'
import parse, { HTMLElement } from 'node-html-parser'
import { fromHtml } from 'hast-util-from-html'
import { toMdast } from 'hast-util-to-mdast'
import { toMarkdown, u } from '@liuli-util/markdown-util'

/**
 * 提取 sufficientvelocity 的 id
 * @example https://forums.sufficientvelocity.com/threads/puella-magi-adfligo-systema.2538/
 * @example https://forums.sufficientvelocity.com/threads/puella-magi-adfligo-systema.2538/reader/
 * @example https://forums.sufficientvelocity.com/threads/puella-magi-adfligo-systema.2538/reader/page-2
 * @example https://forums.sufficientvelocity.com/threads/puella-magi-adfligo-systema.2538/post-288898
 * @param url
 */
export function extractId(url: string): string {
  const r = url.match(/\/threads\/[^/]+\.(\d+)/)
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

interface ExtractData {
  chapters: ChapterData[]
  pages: number
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

export function extractFromHTML(html: string): ExtractData {
  const $dom = parse(html)
  const chapters = Array.from($dom.querySelectorAll('.block-body.js-replyNewMessageContainer > .message')).map(
    extractChapterFromHTML,
  )
  const pagesStr = $dom.querySelector('input.js-pageJumpPage')?.getAttribute('max')
  if (!pagesStr) {
    throw new Error('无法提取总页数')
  }
  return {
    chapters,
    pages: Number.parseInt(pagesStr),
  }
}

async function fetchPage(threadId: string, page: number): Promise<ExtractData> {
  const url = `https://forums.sufficientvelocity.com/threads/${threadId}/reader/page-${page}`
  const html = await fetch(url).then((r) => r.text())
  try {
    return extractFromHTML(html)
  } catch (e) {
    console.error('fetchPage error: ', url)
    throw e
  }
}

export function sufficientvelocity(options: Pick<InputConfig, 'url'>): InputPlugin {
  return {
    name: 'sufficientvelocity',
    async *generate() {
      // 提取 id
      const id = extractId(options.url)
      // 根据 id 提取第一页的数据，并获取总页数
      const first = await fetchPage(id, 1)
      const len = (first.pages * 10).toString().length
      for (let i = 1, k = 1; i <= first.pages; i++) {
        // 读取和提取一页的内容
        const data = await fetchPage(id, i)
        for (const it of data.chapters) {
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
    },
  }
}
