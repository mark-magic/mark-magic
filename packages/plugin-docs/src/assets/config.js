import { createContentLoader, defineConfig, mergeConfig } from 'vitepress'
import { writeFile } from 'fs/promises'
import path from 'pathe'
import { Feed } from 'feed'
import { sortBy } from 'lodash-es'
import { cjk } from 'markdown-it-cjk-space-clean'
import { twitterMeta } from 'vitepress-plugin-twitter-card'
import taskLists from '@rxliuli/markdown-it-task-lists'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'
import footnote from 'markdown-it-footnote'
const rss = `INJECT_RSS_CONFIG`
function getFeed() {
  if (!(typeof rss === 'object' && rss.hostname && rss.copyright)) {
    return {}
  }
  async function cleanHtml(html, baseUrl) {
    const { parse } = await import('node-html-parser')
    const dom = parse(html).querySelector('main > .vp-doc > div')
    dom?.querySelectorAll('img').forEach((it) => {
      it.setAttribute('src', new URL(it.getAttribute('src'), baseUrl).toString())
    })
    return dom?.innerHTML
  }
  function getAbsPath(outDir, p) {
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
    buildEnd: async (siteConfig) => {
      if (typeof rss === 'object' && rss.hostname && rss.copyright) {
        const hostname = rss.hostname
        const feed = new Feed({
          id: hostname,
          title: rss.title,
          description: rss.description ?? '',
          copyright: rss.copyright,
          link: hostname,
        })
        const posts = await createContentLoader('**/*.md', {
          excerpt: true,
          render: true,
          globOptions: {
            ignore: ['dist', ...(rss.ignore ?? [])],
          },
        }).load()
        for (const it of sortBy(posts, (it2) => it2.url).slice(posts.length - 10)) {
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
        await writeFile(path.join(siteConfig.outDir, 'rss.xml'), feed.rss2())
      }
    },
  })
}
const map = {}
const configs = [
  defineConfig({
    markdown: {
      config: (md) => {
        md.use(cjk()).use(taskLists).use(footnote)
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
  configs.push(twitterMeta(twitter))
}
const INJECT_SEARCH = `INJECT_SEARCH`
const injectConfig = `INJECT_VITEPRESS_CONFIG`
configs.push(injectConfig)
if (INJECT_SEARCH.enabled === true) {
  let options = {}
  if (injectConfig.lang?.includes('zh')) {
    options = {
      customSearchQuery: (input) => {
        const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' })
        const result = []
        for (const it of segmenter.segment(input)) {
          if (it.isWordLike) {
            result.push(it.segment)
          }
        }
        return result.join(' ')
      },
      btnPlaceholder: '\u641C\u7D22',
      placeholder: '\u641C\u7D22\u6587\u6863',
      emptyText: '\u7A7A\u7A7A\u5982\u4E5F',
      heading: '\u5171: {{searchResult}} \u6761\u7ED3\u679C',
    }
  }
  configs.push({
    vite: {
      plugins: [pagefindPlugin(options)],
    },
  })
}
var config_default = configs.reduce((a, b) => mergeConfig(a, b))
export { config_default as default }
