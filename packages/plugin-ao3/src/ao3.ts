import { Content, InputPlugin } from '@mark-magic/core'
import { parse, HTMLElement } from 'node-html-parser'
import { InputConfig } from './utils'
import { toMarkdown, Root } from '@liuli-util/markdown-util'
import { fromHtml } from 'hast-util-from-html'
import { toMdast } from 'hast-util-to-mdast'

// https://archiveofourown.org/works/29943597/
export function extractId(url: string): string {
  const match = url.match(/\/works\/(\d+)/)
  if (match == null) {
    throw new Error(`无法从 ${url} 中提取 id`)
  }
  return match[1]
}

interface ChapterMeta {
  bookId: string
  id: string
  title: string
  content: string
}

export async function getBook(id: string): Promise<ChapterMeta[]> {
  const res = await fetch(`https://archiveofourown.org/works/${id}?view_full_work=true`).then((r) => r.text())
  return extractFromHTML(res).map((it) => ({ ...it, bookId: id }))
}

function html2md(html: string): string {
  const hast = fromHtml(html, { fragment: true })
  const mdast = toMdast(hast as any)
  return toMarkdown(mdast as Root)
}

export function extractFromHTML(html: string): Pick<ChapterMeta, 'id' | 'title' | 'content'>[] {
  const $dom = parse(html)
  const list = Array.from($dom.querySelectorAll('#chapters > .chapter'))
  // 单章节模式
  if (list.length === 0) {
    const id = $dom.querySelector('#kudo_commentable_id')?.getAttribute('value')
    if (!id) {
      throw new Error('无法提取章节 id')
    }
    const title = $dom.querySelector('#workskin .title.heading')?.textContent.trim()
    if (!title) {
      throw new Error('无法提取章节标题')
    }
    const html = $dom.querySelector('#chapters > .userstuff')?.innerHTML
    if (!html) {
      throw new Error('无法提取章节内容')
    }
    return [{ id, title, content: html2md(html) }]
  }
  return list.map(($it) => {
    const $title = $it.querySelector('.title')
    if (!$title) {
      throw new Error('无法提取章节标题')
    }
    const $a = $title.querySelector('a')
    if (!$a) {
      throw new Error('无法提取章节链接')
    }
    const chapterId = $a.getAttribute('href')?.match(/\/works\/\d+\/chapters\/(\d+)/)?.[1]
    if (!chapterId) {
      throw new Error('无法提取章节 id')
    }
    $title.querySelector('a')?.remove()
    const title = $title.textContent?.trim().match('^: (.*)$')?.[1]
    if (!title) {
      throw new Error('无法提取章节标题')
    }
    const $content = $it.querySelector('.userstuff.module')
    if (!$content) {
      throw new Error('无法提取章节内容')
    }
    $content.querySelector('.landmark.heading')?.remove()
    return {
      id: chapterId,
      title: title,
      content: html2md($content.innerHTML) as string,
    } as Pick<ChapterMeta, 'id' | 'title' | 'content'>
  })
}

export function ao3(options: Pick<InputConfig, 'url'>): InputPlugin {
  return {
    name: 'ao3',
    async *generate() {
      const id = extractId(options.url)
      const list = await getBook(id)
      const len = list.length.toString().length
      for (let i = 0; i < list.length; i++) {
        const it = list[i]
        const name = (i + 1).toString().padStart(len, '0')
        yield {
          id: it.id,
          name,
          content: '# ' + it.title + '\n\n' + it.content,
          path: [name + '.md'],
          resources: [],
          created: Date.now(),
          updated: Date.now(),
        } as Content
      }
    },
  }
}
