import { Content } from '@mark-magic/core'
import { parse, HTMLElement } from 'node-html-parser'
import { InputConfig, NovelInputPlugin, NovelMeta, renderReadme } from './utils'
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
  id: string
  name: string
  content: string
}

function html2md(html: string): string {
  const hast = fromHtml(html, { fragment: true })
  const mdast = toMdast(hast as any)
  return toMarkdown(mdast as Root)
}

function extractReadmeFromHTML($dom: HTMLElement): Pick<ChapterMeta, 'name' | 'content'> & Omit<NovelMeta, 'id'> {
  const html = $dom.querySelector('.summary.module .userstuff')?.innerHTML.trim()
  if (!html) {
    throw new Error('无法提取简介')
  }
  const title = $dom.querySelector('.title.heading')?.textContent.trim()
  if (!title) {
    throw new Error('无法提取标题')
  }
  const $creator = $dom.querySelector('.byline.heading [rel="author"]')
  if (!$creator) {
    throw new Error('无法提取作者')
  }
  const creatorName = $creator.textContent.trim()
  const creatorLink = 'https://archiveofourown.org/' + $creator.getAttribute('href')
  return {
    name: title,
    content: html2md(html),
    creator: { name: creatorName, url: creatorLink },
  }
}

interface ExtractData {
  readme: ChapterMeta
  chapters: ChapterMeta[]
}

function extractChaptersFromHTML($dom: HTMLElement): ChapterMeta[] {
  const list = Array.from($dom.querySelectorAll('#chapters > .chapter'))
  const id = $dom.querySelector('#kudo_commentable_id')?.getAttribute('value')
  if (!id) {
    throw new Error('无法提取书籍 id')
  }
  // 单章节模式
  if (list.length === 0) {
    const title = $dom.querySelector('#workskin .title.heading')?.textContent.trim()
    if (!title) {
      throw new Error('无法提取章节标题')
    }
    const html = $dom.querySelector('#chapters > .userstuff')?.innerHTML
    if (!html) {
      throw new Error('无法提取章节内容')
    }
    return [{ id, name: title, content: html2md(html) }]
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
      name: title,
      content: html2md($content.innerHTML) as string,
    } as ChapterMeta
  })
}

export function ao3(options: Pick<InputConfig, 'url'>): NovelInputPlugin {
  return {
    name: 'ao3',
    async *generate() {
      const id = extractId(options.url)
      const html = await fetch(`https://archiveofourown.org/works/${id}?view_full_work=true`).then((r) => r.text())
      const $dom = parse(html)
      const chapters = extractChaptersFromHTML($dom)
      const readme = extractReadmeFromHTML($dom)
      const len = chapters.length.toString().length
      yield {
        id: `${id}_readme`,
        name: 'readme',
        content: renderReadme({
          ...readme,
          url: options.url,
        }),
        path: ['readme.md'],
        resources: [],
        created: Date.now(),
        updated: Date.now(),
      } as Content
      for (let i = 0; i < chapters.length; i++) {
        const it = chapters[i]
        const name = (i + 1).toString().padStart(len, '0')
        yield {
          id: it.id,
          name,
          content: '# ' + it.name + '\n\n' + it.content,
          path: [name + '.md'],
          resources: [],
          created: Date.now(),
          updated: Date.now(),
        } as Content
      }
    },
    match(): boolean {
      return options.url.startsWith('https://archiveofourown.org/works/')
    },
    async getMeta() {
      const id = extractId(options.url)
      const html = await fetch(`https://archiveofourown.org/works/${id}`).then((r) => r.text())
      const $dom = parse(html)
      const readme = extractReadmeFromHTML($dom)
      return {
        ...readme,
        id,
      }
    },
  }
}
