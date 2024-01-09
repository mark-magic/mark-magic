import { DefaultTheme, UserConfig, build } from 'vitepress'
import { OutputPlugin } from '@mark-magic/core'
import path from 'pathe'
import * as local from '@mark-magic/plugin-local'
import { mkdir, writeFile } from 'fs/promises'
import { copy, pathExists } from 'fs-extra/esm'
import { pick } from 'lodash-es'
import { ISidebar, treeSidebarByPath } from '@mark-magic/utils'
import { treeMap } from '@liuli-util/tree'
import { fromMarkdown, selectAll, Heading, toString } from '@liuli-util/markdown-util'
import Mustache from 'mustache'
import themeConfigRaw from './assets/theme/index.js?raw'
import configRaw from './assets/config.js?raw'
import { findParent } from '@liuli-util/fs'
import { DocsOutputConfig } from './config.schema'

interface Sidebar extends Omit<DefaultTheme.SidebarItem, 'children'>, ISidebar {}

function generateSidebar(sidebars: Sidebar[]): DefaultTheme.SidebarItem[] {
  return treeMap(
    sidebars,
    (it) =>
      ({
        ...pick(it, 'text', 'link'),
        items: it.children,
      } as DefaultTheme.SidebarItem),
    {
      id: 'path',
      children: 'children',
    },
  )
}

export interface OutputOptions extends DocsOutputConfig {
  debug?: {
    test?: boolean
    root?: string
  }
}

export interface RenderRssOptions extends NonNullable<OutputOptions['rss']> {
  title: string
  description?: string
  lang?: string
}

export function output(options: OutputOptions): OutputPlugin {
  const config: UserConfig<DefaultTheme.Config> = {
    ...pick(options, 'lang', 'description', 'base'),
    title: options.name,
    themeConfig: {
      nav: options.nav,
      sidebar: [],
      logo: options.logo,
    },
    sitemap: options.sitemap,
  }
  if (options.gtag) {
    config.head = [
      ...(config.head ?? []),
      ['script', { async: '', src: `https://www.googletagmanager.com/gtag/js?id=${options.gtag}` }],
      [
        'script',
        {},
        `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${options.gtag}');`,
      ],
    ]
  }
  const sidebars: Sidebar[] = []
  let tempPath: string, p: OutputPlugin
  function findTitle(content: string): string | undefined {
    const root = fromMarkdown(content)
    const findHeader = (selectAll('heading', root) as Heading[]).find((it) => it.depth === 1)
    if (findHeader?.children[0]) {
      return toString(findHeader.children[0])
    }
  }
  return {
    name: 'docs',
    async start() {
      const root =
        options.debug?.root ??
        (await findParent(__dirname, async (it) => await pathExists(path.resolve(it, 'package.json')))) ??
        path.resolve()
      // fix vitepress issue: https://github.com/vuejs/vitepress/issues/3363
      tempPath = path.resolve(root, '.temp', Date.now().toString())
      p = local.output({
        rootContentPath: tempPath,
        rootResourcePath: path.resolve(tempPath, 'resources'),
        meta: (o) => ({
          title: findTitle(o.content) ?? o.name,
        }),
      })
      await p.start?.()
    },
    async handle(content) {
      if (content.name === 'readme') {
        content.name = 'index'
        content.path[content.path.length - 1] = 'index.md'
      }
      await p.handle(content)
      const sidebar: Sidebar = {
        path: path.join(...content.path),
        text: findTitle(content.content) ?? content.name,
        link: content.path.map((it) => '/' + it).join(''),
      }

      sidebars.push(sidebar)
    },
    async end() {
      await p.end?.()
      // 生成一个临时目录，包含 vitepress 配置文件之类的，用于后续写入 markdown 文件
      config.themeConfig!.sidebar = generateSidebar(treeSidebarByPath(sidebars))
      await mkdir(path.resolve(tempPath, '.vitepress'), { recursive: true })
      await writeFile(
        path.resolve(tempPath, '.vitepress/config.mjs'),
        configRaw.replace('INJECT_VITEPRESS_CONFIG', JSON.stringify(config)).replace(
          'INJECT_RSS_CONFIG',
          JSON.stringify({
            ...options.rss,
            title: options.name,
            description: options.description,
            lang: options.lang,
          } as RenderRssOptions),
        ),
      )
      if (options.public && (await pathExists(options.public))) {
        await copy(path.resolve(options.public), path.resolve(tempPath, 'public'))
      }
      if (options.giscus) {
        await mkdir(path.resolve(tempPath, '.vitepress/theme'), { recursive: true })
        await writeFile(
          path.resolve(tempPath, '.vitepress/theme/index.mjs'),
          Mustache.render(themeConfigRaw, options.giscus),
        )
      }
      if (!options.debug?.test) {
        // 调用 vitepress 构建
        await build(tempPath, {
          outDir: options.path,
        })
      }
    },
  }
}
