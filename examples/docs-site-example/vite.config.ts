import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { cssdts } from '@liuli-util/vite-plugin-css-dts'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fromMarkdown, Image, selectAll, shikiHandler, toHtml } from '@liuli-util/markdown-util'
import { getHighlighter } from 'shiki'
import pages from 'vite-plugin-pages'
import pathe from 'pathe'

async function markdown(): Promise<Plugin> {
  const high = await getHighlighter({
    themes: ['github-dark', 'github-light'],
  })
  let rootPath = process.cwd()
  return {
    name: 'vite-plugin-markdown',
    configResolved(config) {
      rootPath = config.root
    },
    async transform(code, id) {
      if (id.endsWith('.md')) {
        const root = fromMarkdown(code)
        ;(selectAll('image', root) as Image[])
          .filter((it) => it.url.startsWith('./') || it.url.startsWith('../'))
          .forEach((it) => {
            it.url = pathe.join('/@file', pathe.resolve(pathe.dirname(id), it.url))
          })

        const htmlContent = toHtml(root, {
          hast: {
            handlers: {
              code: shikiHandler(high),
            },
          },
        })

        return {
          code: `export default ${JSON.stringify(htmlContent)}`,
          map: { mappings: '' },
        }
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.endsWith('.md')) {
          try {
            const fileContent = await readFile(path.resolve(rootPath, req.url), 'utf-8')
            const htmlContent = toHtml(fromMarkdown(fileContent))

            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(htmlContent)
          } catch {
            next()
          }
          return
        }
        if (req.url.startsWith('/@file')) {
          res.end(await readFile(req.url.slice(6)))
          return
        }
        // console.log(req.url)
        return next()
      })
    },
  }
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      cssdts(),
      markdown(),
      pages({
        dirs: ['src/views/content/assets/books'],
        extensions: ['md'],
        async extendRoute(route, parent) {
          if (route.element?.endsWith('.md')) {
            const code = await readFile(path.join(process.cwd(), route.element), 'utf-8')
            const htmlContent = toHtml(fromMarkdown(code))

            return {
              ...route,
              html: htmlContent,
            }
          }
        },
      }),
    ],
    css: {
      postcss: {
        plugins: [tailwindcss() as any, autoprefixer()],
      },
    },
  }
})
