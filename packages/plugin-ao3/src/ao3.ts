import { InputPlugin, Content } from '@mark-magic/core'
import { fromHtml } from 'hast-util-from-html'
import { toMdast } from 'hast-util-to-mdast'
import parse from 'node-html-parser'
import { Root, toMarkdown } from '@liuli-util/markdown-util'
import { InputConfig } from './options'

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
  name: string
}

function getChaptersFromHTML(html: string): Omit<ChapterMeta, 'bookId'>[] {
  const dom = parse(html)
  return [...dom.querySelectorAll('#selected_id option')].map(
    (el) =>
      ({
        id: el.getAttribute('value')!,
        name: el.text.trim(),
      } as ChapterMeta),
  )
}

export async function getChapters(id: string): Promise<ChapterMeta[]> {
  const res = await fetch(`https://archiveofourown.org/works/${id}`)
  const html = await res.text()
  return getChaptersFromHTML(html).map((it) => ({ ...it, bookId: id }))
}

async function fetchChapterHTML(chapter: ChapterMeta) {
  const res = await fetch(`https://archiveofourown.org/works/${chapter.bookId}/chapters/${chapter.id}`)
  const html = await res.text()
  const dom = parse(html)
  const el = dom.querySelector('#chapters .userstuff.module')
  if (el == null) {
    throw new Error(`无法从 ${chapter.id} 中提取内容`)
  }
  el.querySelector('.landmark.heading')?.remove()
  const content = el.innerHTML
  return content
}
async function extractChapterContent(html: string) {
  const hast = fromHtml(html, { fragment: true })
  const mdast = toMdast(hast as any)
  return toMarkdown(mdast as Root)
}

export async function fetchChapterContent(chapter: ChapterMeta) {
  return extractChapterContent(await fetchChapterHTML(chapter))
}

export function ao3(options: Pick<InputConfig, 'url'>): InputPlugin {
  return {
    name: 'ao3',
    async *generate() {
      const id = extractId(options.url)
      const list = await getChapters(id)
      for (const chapter of list) {
        const content = await fetchChapterContent(chapter)
        yield {
          id: chapter.id,
          name: chapter.name,
          content,
          path: [],
          resources: [],
          created: Date.now(),
          updated: Date.now(),
        } as Content
      }
    },
  }
}
