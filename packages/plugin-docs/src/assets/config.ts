import { SiteConfig, UserConfig, createContentLoader, defineConfig, mergeConfig } from 'vitepress'
import { writeFile } from 'fs/promises'
import path from 'pathe'
import { Feed } from 'feed'
import type { RenderRssOptions } from '../output'
import { sortBy } from 'lodash-es'
import { cjk } from 'markdown-it-cjk-space-clean'
import { twitterMeta } from 'vitepress-plugin-twitter-card'
import taskLists from '@rxliuli/markdown-it-task-lists'
import { PagefindOption, pagefindPlugin, SearchConfig } from 'vitepress-plugin-pagefind'
import footnote from 'markdown-it-footnote'

// @ts-expect-error
const rss: RenderRssOptions = `INJECT_RSS_CONFIG`

function getFeed(): UserConfig {
  if (!(typeof rss === 'object' && rss.hostname && rss.copyright)) {
    return {}
  }

  async function cleanHtml(html: string, baseUrl: string): Promise<string | undefined> {
    const { parse } = await import('node-html-parser')
    const dom = parse(html).querySelector('main > .vp-doc > div')
    dom?.querySelectorAll('img').forEach((it) => {
      it.setAttribute('src', new URL(it.getAttribute('src')!, baseUrl).toString())
    })
    return dom?.innerHTML
  }

  function getAbsPath(outDir: string, p: string): string {
    if (p.endsWith('.html')) {
      return path.join(outDir, p)
    }
    if (p.endsWith('/')) {
      return path.join(outDir, p, 'index.html')
    }
    return p
  }
  return defineConfig({
    transformHtml(code, id, ctx) {
      if (!/[\\/]404\.html$/.test(id)) {
        map[id] = code
      }
    },
    buildEnd: async (siteConfig: SiteConfig) => {
      if (typeof rss === 'object' && rss.hostname && rss.copyright) {
        const hostname = rss.hostname
        const feed = new Feed({
          id: hostname,
          title: rss.title,
          description: rss.description ?? '',
          copyright: rss.copyright,
          link: hostname,
        })

        // You might need to adjust this if your Markdown files
        // are located in a subfolder
        const posts = await createContentLoader('**/*.md', {
          excerpt: true,
          render: true,
          globOptions: {
            ignore: ['dist', ...(rss.ignore ?? [])],
          },
        }).load()

        for (const it of sortBy(posts, (it) => it.url).slice(posts.length - 10)) {
          let html = it.html?.replaceAll('&ZeroWidthSpace;', '')
          if (it.html?.includes('<img')) {
            const htmlUrl = getAbsPath(siteConfig.outDir, it.url)
            if (map[htmlUrl]) {
              const baseUrl = path.join(rss.hostname, siteConfig.site.base)
              html = await cleanHtml(map[htmlUrl], baseUrl)
              it.html = html
            }
          }
          feed.addItem({
            title: it.frontmatter.title,
            id: `${hostname}${it.url}`,
            link: `${hostname}${it.url}`,
            description: it.excerpt,
            content: html,
            author: rss.author,
            date: it.frontmatter.date,
          })
        }

        // console.log(feed.items.map((it) => it.link))
        await writeFile(path.join(siteConfig.outDir, 'rss.xml'), feed.rss2())
      }
    },
  })
}

const map: Record<string, string> = {}

const configs: UserConfig[] = [
  defineConfig({
    markdown: {
      config: (md) => {
        md.use(cjk() as any)
          .use(taskLists as any)
          .use(footnote as any)
      },
      attrs: {
        disable: true,
      },
      breaks: true,
    },
    ignoreDeadLinks: true,
  }),
  getFeed(),
]

const twitter = {
  site: `INJECT_TWITTER_SITE`,
  image: `INJECT_TWITTER_IMAGE`,
}
if (twitter.site && twitter.image) {
  configs.push(twitterMeta(twitter) as any)
}
const INJECT_SEARCH = `INJECT_SEARCH` as any

const injectConfig = `INJECT_VITEPRESS_CONFIG` as UserConfig
configs.push(injectConfig)

if (INJECT_SEARCH.enabled === true) {
  let options: SearchConfig & PagefindOption = {}
  if (injectConfig.lang?.includes('zh')) {
    options = {
      customSearchQuery: (input: string) => {
        const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' })
        const result: string[] = []
        for (const it of segmenter.segment(input)) {
          if (it.isWordLike) {
            result.push(it.segment)
          }
        }
        return result.join(' ')
      },
      btnPlaceholder: '搜索',
      placeholder: '搜索文档',
      emptyText: '空空如也',
      heading: '共: {{searchResult}} 条结果',
    }
  }
  configs.push({
    vite: {
      plugins: [pagefindPlugin(options)],
    },
  })
}

// refer https://vitepress.dev/reference/site-config for details
export default configs.reduce((a, b) => mergeConfig(a, b))
