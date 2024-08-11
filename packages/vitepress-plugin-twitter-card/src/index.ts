import { readFile } from 'fs/promises'
import path from 'path'
import type { UserConfig } from 'vitepress'

// 截取 markdown 文件主体内容的前 160 个字符，不包括顶部的 yaml 配置和一级标题
function sliceContent(content: string, length: number) {
  const lines = content.split('\n')
  let start = lines.findIndex((line) => line.startsWith('# '))
  if (start === -1) {
    start = lines.findIndex((line) => line.startsWith('---'))
  }
  const s = lines
    .slice(start + 1)
    .filter(
      (line) => !line.startsWith('#') && !line.startsWith('---') && !line.startsWith('![') && !line.startsWith('['),
    )
    .join(' ')
    .trim()
  return s.length <= length ? s : s.slice(0, length).trim() + '...'
}

export function twitterMeta(options: { site: string; image: string }): UserConfig {
  return {
    async transformPageData(pageData, ctx) {
      pageData.frontmatter.head ??= []
      const tags: { name: string; content: string }[] = []
      tags.push({ name: 'twitter:card', content: 'summary' })
      tags.push({
        name: 'twitter:title',
        content: pageData.frontmatter.layout === 'home' ? ctx.siteConfig.site.title : pageData.title,
      })
      tags.push({
        name: 'twitter:description',
        content:
          pageData.frontmatter.layout === 'home'
            ? ctx.siteConfig.site.description
            : pageData.frontmatter.description ||
              pageData.description ||
              sliceContent(await readFile(path.resolve(ctx.siteConfig.root, pageData.filePath), 'utf-8'), 160),
      })
      tags.push({ name: 'twitter:image', content: options.image })
      tags.push({ name: 'twitter:site', content: `@${options.site}` })
      tags.forEach((tag) => {
        pageData.frontmatter.head.push(['meta', tag])
      })
    },
  }
}
