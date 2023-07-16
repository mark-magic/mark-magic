import { ConfigEnv, defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { cssdts } from '@liuli-util/vite-plugin-css-dts'
import { readFile } from 'node:fs/promises'
import { fromMarkdown, Image, selectAll, shikiHandler, toHtml } from '@liuli-util/markdown-util'
import { getHighlighter } from 'shiki'
import pathe from 'pathe'
import { transform } from 'esbuild'
import { AsyncArray } from '@liuli-util/async'
import crypto from 'node:crypto'

function hashString(s: string) {
  return crypto.createHash('md5').update(s).digest('hex')
}
async function markdown(): Promise<Plugin> {
  const high = await getHighlighter({
    themes: ['github-dark', 'github-light'],
  })
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

        const htmlContent = toHtml(root, {
          hast: {
            handlers: {
              code: shikiHandler(high),
            },
          },
          html: {
            closeSelfClosing: true,
          },
        })
        return {
          code: `import React from 'react'; export default () => ${
            (await transform(`<>${htmlContent}</>`, { loader: 'jsx' })).code
          };`,
        }
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url.startsWith('/@file')) {
          res.end(await readFile(req.url.slice(6)))
          return
        }
        return next()
      })
    },
  }
}

export default defineConfig(() => {
  return {
    plugins: [
      markdown(),
      // mdx(),
      react(),
      cssdts(),
    ],
    css: {
      postcss: {
        plugins: [tailwindcss() as any, autoprefixer()],
      },
    },
  }
})
