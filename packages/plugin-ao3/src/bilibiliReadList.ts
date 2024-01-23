import { InputConfig, NovelInputPlugin, NovelMeta, renderReadme } from './utils'
import parse from 'node-html-parser'
import { fromHtml } from 'hast-util-from-html'
import { toMdast } from 'hast-util-to-mdast'
import { toMarkdown } from '@liuli-util/markdown-util'

/**
 *
 * @param url
 * @example https://www.bilibili.com/read/readlist/rl705094
 * @returns
 */
function extractId(url: string): string {
  const match = url.match(new RegExp('https://www.bilibili.com/read/readlist/rl(\\d+)'))
  if (match == null) {
    throw new Error(`无法从 ${url} 中提取 id`)
  }
  return match[1]
}

function html2md(html: string): string {
  // @ts-ignore
  return toMarkdown(toMdast(fromHtml(html, { fragment: true }) as any))
}

function extractReadmeFromHTML(html: string): {
  content: string
} & Omit<NovelMeta, 'id'> {
  const $dom = parse(html)
  const title = $dom.querySelector('.right-side .title')?.textContent.trim()
  if (!title) {
    throw new Error('无法提取标题')
  }
  const htmlContent = $dom.querySelector('.right-side .summary')?.textContent.trim()
  if (!htmlContent) {
    throw new Error('无法提取简介')
  }
  const $creator = $dom.querySelector('.up-info-block .up-name')
  if (!$creator) {
    throw new Error('无法提取作者')
  }
  const creatorName = $creator.textContent.trim()
  const link = $creator.getAttribute('href')
  if (!link) {
    throw new Error('无法提取作者链接')
  }
  const creatorLink = link?.startsWith('https://') ? link : 'https:' + link
  return {
    name: title,
    content: html2md(htmlContent),
    creator: {
      name: creatorName,
      url: creatorLink,
    },
  }
}

function extractChapterFromHTML(html: string): string {
  const $dom = parse(html)
  const htmlContent = $dom.querySelector('#read-article-holder')?.innerHTML
  if (!htmlContent) {
    throw new Error('无法提取简介')
  }
  return html2md(htmlContent)
}

async function fetchChapters(id: string): Promise<{ id: number; title: string; publish_time: number; url: string }[]> {
  return (await (await fetch(`https://api.bilibili.com/x/article/list/web/articles?id=${id}&jsonp=jsonp`)).json()).data
    .articles
}

/**
 * 读取
 * @returns
 */
export function bilibiliReadList(options: InputConfig): NovelInputPlugin {
  return {
    name: 'bilibili-read-list',
    async *generate() {
      const id = extractId(options.url)
      const html = await fetch(options.url).then((r) => r.text())
      const readme = extractReadmeFromHTML(html)
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
      }
      const chapters = await fetchChapters(id)
      const len = chapters.length.toString().length
      for (let i = 0; i < chapters.length; i++) {
        const it = chapters[i]
        const name = (i + 1).toString().padStart(len, '0')
        const chapterHtml = await fetch(`https://www.bilibili.com/read/cv${it.id}`).then((r) => r.text())
        const content = '# ' + it.title + '\n\n' + extractChapterFromHTML(chapterHtml)
        yield {
          id: it.id.toString(),
          name,
          content,
          path: [name + '.md'],
          resources: [],
          created: Date.now(),
          updated: Date.now(),
        }
      }
    },
    async getMeta() {
      const html = await fetch(options.url).then((r) => r.text())
      const readme = extractReadmeFromHTML(html)
      const id = extractId(options.url)
      return {
        ...readme,
        id,
      }
    },
    match() {
      // https://www.bilibili.com/read/readlist/rl705094
      return options.url.startsWith('https://www.bilibili.com/read/readlist/')
    },
  }
}
