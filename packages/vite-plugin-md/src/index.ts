import { Plugin, ConfigEnv } from 'vite'
import { readFile } from 'node:fs/promises'
import { fromMarkdown, Image, selectAll, mdToHast, hastToHtml } from '@liuli-util/markdown-util'
import { AsyncArray } from '@liuli-util/async'
import crypto from 'node:crypto'
import pathe from 'pathe'
import type { HastNodes } from 'mdast-util-to-hast/lib'
import { TransformPluginContext } from 'rollup'

function hashString(s: string) {
  return crypto.createHash('md5').update(s).digest('hex')
}

function hastToJsx(hast: HastNodes): string {
  if (hast.type === 'element') {
    const props = hast.properties ? JSON.stringify(hast.properties) : 'null'
    const children = hast.children.map(hastToJsx).join(', ')
    return `h("${hast.tagName}", ${props}, ${children})`
  } else if (hast.type === 'text') {
    return JSON.stringify(hast.value)
  } else if (hast.type === 'root') {
    return hast.children.map(hastToJsx).join(', ')
  } else {
    return ''
  }
}

async function mdToHtml(
  ctx: TransformPluginContext,
  code: string,
  options: {
    command: ConfigEnv['command']
    mode: 'react' | 'vue' | 'html'
    id: string
  },
) {
  const { command, id } = options
  const root = fromMarkdown(code)
  await AsyncArray.forEach(
    (selectAll('image', root) as Image[]).filter((it) => it.url.startsWith('./') || it.url.startsWith('../')),
    async (it) => {
      if (command === 'build') {
        const imagePath = pathe.resolve(pathe.dirname(id), it.url)
        const fileName = hashString(imagePath) + pathe.extname(imagePath)
        ctx.emitFile({
          type: 'asset',
          source: await readFile(imagePath),
          fileName,
        })
        it.url = fileName
        return
      }
      it.url = pathe.join('/@file', pathe.resolve(pathe.dirname(id), it.url))
    },
  )

  const hast = mdToHast(root)
  if (options.mode === 'html') {
    return `const HTML = ${JSON.stringify(hastToHtml(hast!))}; export default HTML;`
  }
  if (options.mode === 'react') {
    return `import { createElement as h, Fragment } from 'react'; const ReactComponent = () => h(Fragment, null, [${hastToJsx(
      hast!,
    )}]); export default ReactComponent;`
  }
  if (options.mode === 'vue') {
    return `import { h, Fragment } from 'vue'; const VueComponent = () => h(Fragment, null, [${hastToJsx(
      hast!,
    )}]); export default VueComponent;`
  }
  throw new Error(`不支持的模式: ${options.mode}`)
}

export function markdown(options: { mode: 'react' | 'vue' | 'html' }): Plugin {
  let command: ConfigEnv['command']
  return {
    name: 'vite-plugin-markdown',
    config(_, env) {
      command = env.command
    },
    async transform(code, id) {
      if (id.endsWith('.md')) {
        return await mdToHtml(this, code, { id, command, mode: options.mode })
      }
    },
    async handleHotUpdate(ctx) {
      if (pathe.extname(ctx.file) === '.md') {
        console.log('hot update', ctx.file)
        // const code = await mdToHtml(this as any, await ctx.read(), { id: ctx.file, command, mode: options.mode })
        // 创建一个更新模块
        const module = ctx.server.moduleGraph.getModuleById(ctx.file)

        // 通知 Vite 更新模块
        return ctx.server.moduleGraph.invalidateModule(module!)
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/@file')) {
          try {
            res.end(await readFile(pathe.resolve(req.url.slice(6))))
            return
          } catch (err) {
            console.error(err)
          }
        }
        return next()
      })
    },
  }
}
