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
var config_default = mergeConfig(
  defineConfig({
    markdown: {
      config: (md) => {
        md.use(_clearStrongAfterSpace(['\uFF0C', '\u3002', '\uFF1F', '\uFF01']))
      },
      attrs: {
        disable: true,
      },
    },
    buildEnd: async (config) => {
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
          const item = {
            title: it.frontmatter.title,
            id: `${hostname}${it.url}`,
            link: `${hostname}${it.url}`,
            description: it.excerpt,
            content: it.html?.replaceAll(
              /[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/,
              '',
            ),
            author: rss.author,
            date: it.frontmatter.date,
          }
          feed.addItem(item)
        }
        await writeFile(path.join(config.outDir, 'rss.xml'), feed.rss2())
      }
    },
  }),
  // @ts-expect-error 从外部替换
  '{{config}}',
)
export { config_default as default }
