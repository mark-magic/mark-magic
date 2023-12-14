import { OutputPlugin } from '@mark-magic/core'
import pathe from 'pathe'
import * as local from '@mark-magic/plugin-local'
import { Heading, fromMarkdown, selectAll, toString } from '@liuli-util/markdown-util'
import { mkdir, writeFile, rename } from 'fs/promises'
import { pathExists } from '@liuli-util/fs'
import indexHtml from './template/index.html?raw'
import giscusJs from './template/giscus.js?raw'
import gtagJs from './template/gtag.js?raw'
import { treeReduce } from '@liuli-util/tree'
import Mustache from 'mustache'
import { copy, remove } from 'fs-extra/esm'
import { pick } from 'lodash-es'
import { DocsOutputConfig } from './config.schema'
import { ISidebar, treeSidebarByPath, isIndex } from '@mark-magic/utils'

export interface Sidebar extends ISidebar {
  id: string
  name: string
}

export function generateSidebar(sidebars: Sidebar[]): string {
  return treeReduce(
    sidebars,
    (r, it, child, p) => {
      const s = `${'  '.repeat(p.length - 1)}- [${it.name}](/p/${it.id})`
      return r + s + '\n' + child
    },
    '',
    {
      id: 'id',
      children: 'children',
    },
  )
}

export function output(options: DocsOutputConfig): OutputPlugin {
  const rootPath = options.path
  const postsPath = pathe.resolve(rootPath, 'p')
  const resourcePath = pathe.resolve(rootPath, 'resources')
  const p = local.output({
    rootContentPath: postsPath,
    rootResourcePath: resourcePath,
    meta: () => null,
    contentLink: ({ linkContentId }) => `/p/${linkContentId}`,
    resourceLink: ({ resource }) => `../resources/${resource.id}${pathe.extname(resource.name)}`,
    contentPath: (content) => pathe.resolve(postsPath, content.id + '.md'),
    resourcePath: (resource) => pathe.resolve(resourcePath, resource.id + pathe.extname(resource.name)),
  })
  const sidebars: Sidebar[] = []
  return {
    ...p,
    name: 'docs',
    async handle(content) {
      const findHeader = (selectAll('heading', fromMarkdown(content.content)) as Heading[]).find((it) => it.depth === 1)
      if (findHeader?.children[0]) {
        content.name = toString(findHeader.children[0])
      }
      sidebars.push({
        id: content.id,
        name: content.name,
        path: pathe.join(...content.path),
      })
      await p.handle(content)
      if (content.path.length === 1 && isIndex(pathe.join(...content.path))) {
        await rename(pathe.resolve(postsPath, content.id + '.md'), pathe.resolve(options.path, 'README.md'))
      }
    },
    async end() {
      if (!(await pathExists(rootPath))) {
        await mkdir(rootPath, { recursive: true })
      }
      const all = [
        ['index.html', renderIndexHTML(options)],
        ['_sidebar.md', generateSidebar(treeSidebarByPath(sidebars))],
      ].map(([p, s]) => writeFile(pathe.resolve(rootPath, p), s))
      if (options.public) {
        all.unshift(copy(options.public, rootPath))
      }
      if (options.giscus) {
        all.unshift(writeFile(pathe.resolve(rootPath, 'giscus.js'), giscusJs))
      }
      if (options.gtag) {
        all.unshift(writeFile(pathe.resolve(rootPath, 'gtag.js'), gtagJs))
      }
      if (options.logo) {
        const distPath = pathe.resolve(rootPath, pathe.basename(options.logo))
        all.unshift(remove(distPath).then(() => copy(options.logo!, distPath)))
      }
      await Promise.all(all)
      await p.end?.()
    },
  }
}

function renderIndexHTML(options: DocsOutputConfig) {
  const links: (
    | string
    | {
        value: string
      }
  )[] = []
  const scripts: string[] = ['//cdn.jsdelivr.net/npm/docsify-pagination/dist/docsify-pagination.min.js']
  const docsifyConfig: any = {
    ...pick(options, ['name', 'repo', 'giscus', 'gtag']),
    loadSidebar: true,
    auto2top: true,
    pagination: {
      previousText: 'Previous',
      nextText: 'Next',
      crossChapter: true,
      crossChapterText: true,
    },
  }
  if (options.theme?.dark) {
    links.push('https://cdn.jsdelivr.net/npm/docsify/themes/dark.css')
  }
  if (options.giscus) {
    links.push('https://unpkg.com/docsify-giscus@1.0.0/dist/giscus.css')
    scripts.push('./giscus.js')
  }
  if (options.gtag) {
    scripts.push('./gtag.js')
  }
  if (options.logo) {
    links.push({
      value: `<link rel="icon" href="./${pathe.basename(options.logo)}" type="image/${pathe
        .extname(options.logo)
        .slice(1)}">`,
    })
  }

  return Mustache.render(indexHtml, {
    styles: links.map((it) => (typeof it === 'string' ? `<link rel="stylesheet" href="${it}">` : it.value)).join('\n'),
    scripts: scripts.map((it) => `<script src="${it}"></script>`).join('\n'),
    docsifyConfig: JSON.stringify(docsifyConfig, null, 2),
  })
}
