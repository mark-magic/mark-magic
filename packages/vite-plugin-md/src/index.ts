import { Plugin, ConfigEnv } from 'vite'
import { readFile } from 'node:fs/promises'
import { fromMarkdown, Image, selectAll, mdToHast, hastToHtml } from '@liuli-util/markdown-util'
import { AsyncArray } from '@liuli-util/async'
import crypto from 'node:crypto'
import pathe from 'pathe'
import type { HastNodes } from 'mdast-util-to-hast/lib'

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

export function markdown(options: { mode: 'react' | 'vue' | 'html' }): Plugin {
  let command: ConfigEnv['command']
  return {
    name: 'vite-plugin-markdown',
    config(_, env) {
      command = env.command
    },
    async transform(code, id) {
      if (id.endsWith('.md')) {
        const root = fromMarkdown(code)
        await AsyncArray.forEach(
          (selectAll('image', root) as Image[]).filter((it) => it.url.startsWith('./') || it.url.startsWith('../')),
          async (it) => {
            if (command === 'build') {
              const imagePath = pathe.resolve(pathe.dirname(id), it.url)
              const fileName = hashString(imagePath) + pathe.extname(imagePath)
              this.emitFile({
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
          return `export default ${JSON.stringify(hastToHtml(hast!))}`
        }
        if (options.mode === 'react') {
          return `import { createElement as h, Fragment } from 'react'; export default () => h(Fragment, null, [${hastToJsx(
            hast!,
          )}]);`
        }
        if (options.mode === 'vue') {
          return `import { h, Fragment } from 'vue'; export default () => h(Fragment, null, [${hastToJsx(hast!)}])`
        }
        throw new Error(`不支持的模式: ${options.mode}`)
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
