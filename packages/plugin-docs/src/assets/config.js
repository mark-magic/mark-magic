import { createContentLoader, defineConfig, mergeConfig } from 'vitepress'
import { writeFile } from 'fs/promises'
import path from 'pathe'
import { Feed } from 'feed'
import { sortBy } from 'lodash-es'
function _clearStrongAfterSpace(ends) {
  return (md) => {
    const renderInline = md.renderer.renderInline.bind(md.renderer)
    md.renderer.renderInline = (tokens, options, env) => {
      const checkTokenIndexs = tokens
        .map((token, i) => {
          return {
            p:
              token.type === 'strong_close' &&
              ends.some((end) => tokens[i - 1].content.endsWith(end)) &&
              i + 1 < tokens.length &&
              tokens[i + 1].type === 'text',
            i: i + 1,
          }
        })
        .filter((item) => item.p)
        .map((item) => item.i)
      const newTokens = tokens.map((token, i) => {
        if (!checkTokenIndexs.includes(i)) {
          return token
        }
        return {
          ...token,
          content: token.content.trimStart(),
        }
      })
      return renderInline(newTokens, options, env)
    }
  }
}
const rss = '{{rss}}'
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
var config_default = [
  defineConfig({
    markdown: {
      config: (md) => {
        md.use(_clearStrongAfterSpace(['\uFF0C', '\u3002', '\uFF1F', '\uFF01']))
      },
      attrs: {
        disable: true,
      },
    },
  }),
  getFeed(),
  '{{config}}',
].reduce((a, b) => mergeConfig(a, b))
export { config_default as default }
