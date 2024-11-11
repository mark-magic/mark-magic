import { OutputPlugin } from '@mark-magic/core'
import path from 'pathe'
import * as local from '@mark-magic/plugin-local'
import { flatMap, fromMarkdown, select, toMarkdown } from '@liuli-util/markdown-util'

export function removeFirstH1(content: string) {
  const root = fromMarkdown(content)
  const firstHeading = select('heading[depth="1"]', root)
  if (firstHeading) {
    return toMarkdown(
      flatMap(root, (it) => {
        if (it === firstHeading) {
          return []
        }
        return [it]
      }),
    )
  }
  return content
}

export function output(options?: { path?: string; base?: string }): OutputPlugin {
  const root = options?.path ?? path.resolve()
  const postsPath = path.resolve(root, 'source/_posts')
  const resourcePath = path.resolve(root, 'source/resources')
  const p = local.output({
    path: postsPath,
    meta: (it) => ({
      layout: 'post',
      title: it.name,
      abbrlink: it.id,
      tags: it.extra?.tags,
      categories: it.path.slice(0, it.path.length - 1),
      date: it.created,
      updated: it.updated,
    }),
    contentLink: (it) => {
      let url = path.join('/', options?.base ?? '/', `/p/${it.linkContentId}`)
      if (it.linkContentHash) {
        url += `#${it.linkContentHash}`
      }
      return url
    },
    resourceLink: (it) => `/resources/${it.resource.id}${path.extname(it.resource.name)}`,
    contentPath: (it) => path.resolve(postsPath, it.id + '.md'),
    resourcePath: (it) => path.resolve(resourcePath, it.id + path.extname(it.name)),
  })
  p.name = 'hexo'
  return {
    ...p,
    async handle(content) {
      content.content = removeFirstH1(content.content)
      await p.handle(content)
    },
  }
}
