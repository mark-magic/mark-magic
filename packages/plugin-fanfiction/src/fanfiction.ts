import parse from 'node-html-parser'
import { InputConfig, NovelInputPlugin, NovelMeta, renderReadme } from './utils'
import { Browser, Page } from 'puppeteer-core'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { toMarkdown } from '@liuli-util/markdown-util'
import { toMdast } from 'hast-util-to-mdast'
import { fromHtml } from 'hast-util-from-html'
import { wait } from '@liuli-util/async'
import { getChromePath } from 'chrome-launcher'

/**
 *
 * @param url
 * @example https://www.fanfiction.net/s/11551156/1/A-Wish-Within-Darkness
 * @example https://www.fanfiction.net/s/11551156/1/
 * @example https://m.fanfiction.net/s/11551156/1/A-Wish-Within-Darkness
 * @example https://m.fanfiction.net/s/11551156/1/
 */
export function extractId(url: string): string {
  const match = url.match(/^https?:\/\/(?:www|m)\.fanfiction\.net\/s\/(\d+)\//)
  if (!match) {
    throw new Error(`Unable to extract ID from url: ${url}`)
  }
  return match[1]
}

async function createBrowser(): Promise<Browser> {
  puppeteer.use(StealthPlugin())
  const browser = await puppeteer.launch({
    executablePath: getChromePath(),
    // 必须禁用 headless 模式
    headless: false,
    // 不知何故，但 work，尽管导致不能使用 newPage，但只需要一个 page 就足够了🤷，ref: https://github.com/berstend/puppeteer-extra/issues/817#issuecomment-1669544250
    targetFilter: (target) => !!target.url(),
  })
  return browser as any
}

let flag = true

async function load(page: Page, url: string): Promise<string> {
  console.log('load start', url)
  page.goto(url)
  const id = extractId(url)
  await page.waitForFunction((id) => document.documentElement.innerText.includes(id), {}, id)
  const r = await page.content()
  console.log('load end', url)
  return r
}

function extractChaptersFromHtml(html: string): string[] {
  const $dom = parse(html)
  const list = Array.from($dom.querySelector('#chap_select')?.querySelectorAll('option') ?? [])
  return list.map((it) => {
    const s = it.textContent.trim()
    return s.slice(s.indexOf('.') + 1)
  })
}

function extractReadmeFromHtml(html: string): Omit<NovelMeta, 'id'> & {
  content: string
} {
  const $dom = parse(html)
  const name = $dom.querySelector('#profile_top b.xcontrast_txt')?.textContent
  if (!name) {
    throw new Error('无法提取标题')
  }
  const $creator = $dom.querySelector('#profile_top a.xcontrast_txt[href^="/u/"]')
  const creatorName = $creator?.textContent
  const creatorLink = $creator?.getAttribute('href')
  if (!creatorName || !creatorLink) {
    throw new Error('无法提取作者')
  }
  const content = $dom.querySelector('#profile_top div.xcontrast_txt')?.textContent
  if (!content) {
    throw new Error('无法提取简介')
  }
  return {
    name,
    creator: {
      name: creatorName,
      url: 'https://www.fanfiction.net' + creatorLink,
    },
    content,
  }
}

function html2md(html: string): string {
  return toMarkdown(toMdast(fromHtml(html, { fragment: true }) as any) as any)
}

function extractChapterFromHtml(html: string): string {
  const $dom = parse(html)
  const htmlContent = $dom.querySelector('#storytext')?.innerHTML
  if (!htmlContent) {
    throw new Error('无法解析章节内容')
  }
  return html2md(htmlContent)
}

export function fanfiction(options: InputConfig): NovelInputPlugin {
  return {
    name: 'fanfiction',
    async *generate() {
      const browser = await createBrowser()
      try {
        const id = extractId(options.url)
        const page = (await browser.pages())[0]
        const firstHtml = await load(page, `https://www.fanfiction.net/s/${id}/1`)
        const chapters = extractChaptersFromHtml(firstHtml)
        const readme = extractReadmeFromHtml(firstHtml)
        yield {
          id,
          name: 'readme',
          content: renderReadme({ ...readme, url: options.url }),
          path: ['readme.md'],
          resources: [],
          created: Date.now(),
          updated: Date.now(),
        }
        const len = chapters.length.toString().length
        for (let i = 0; i < chapters.length; i++) {
          const title = chapters[i]
          const chapterId = i + 1
          const html = i === 0 ? firstHtml : await load(page, `https://www.fanfiction.net/s/${id}/${chapterId}/`)
          const content = extractChapterFromHtml(html)
          yield {
            id: `${id}_${chapterId}`,
            name: (i + 1).toString().padStart(len, '0'),
            content: '# ' + title + '\n\n' + content,
            path: [`${chapterId}.md`],
            resources: [],
            created: Date.now(),
            updated: Date.now(),
          }
          await wait(Math.random() * 1000)
        }
      } finally {
        await browser.close()
      }
    },
    match() {
      throw new Error('Not implemented')
    },
    async getMeta() {
      throw new Error('Not implemented')
    },
  }
}
