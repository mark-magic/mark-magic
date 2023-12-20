import { OutputPlugin } from '@mark-magic/core'
import path from 'pathe'
import * as local from '@mark-magic/plugin-local'
import { Heading, flatMap, fromMarkdown, select, toMarkdown } from '@liuli-util/markdown-util'

export interface Tag {
  id: string
  name: string
}

export function output(options?: { path?: string; base?: string; removeH1?: boolean }): OutputPlugin {
  const root = options?.path ?? path.resolve()
  const postsPath = path.resolve(root, 'source/_posts')
  const resourcePath = path.resolve(root, 'source/resources')
  const p = local.output({
    rootContentPath: postsPath,
    rootResourcePath: resourcePath,
    meta: (it) => ({
      layout: 'post',
      title: it.name,
      abbrlink: it.id,
      tags: it.extra?.tags.map((it: { title: string }) => it.title),
      categories: it.path,
      date: it.created,
      updated: it.updated,
    }),
    contentLink: (it) => path.join('/', options?.base ?? '/', `/p/${it.linkContentId}`),
    resourceLink: (it) => `/resources/${it.resource.id}${path.extname(it.resource.name)}`,
    contentPath: (it) => path.resolve(postsPath, it.id + '.md'),
    resourcePath: (it) => path.resolve(resourcePath, it.id + path.extname(it.name)),
  })
  p.name = 'hexo'
  if (!options?.removeH1) {
    return p
  }
  return {
    ...p,
    async handle(content) {
      const root = fromMarkdown(content.content)
      let first = true
      // 删除第一个 h1 标题
      content.content = toMarkdown(
        flatMap(root, (it) => {
          if (first && it.type === 'heading' && (it as Heading).depth === 1) {
            first = false
            return []
          }
          return [it]
        }),
      )
      await p.handle(content)
    },
  }
}
