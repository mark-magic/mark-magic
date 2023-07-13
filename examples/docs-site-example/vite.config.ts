import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { cssdts } from '@liuli-util/vite-plugin-css-dts'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fromMarkdown, shikiHandler, toHtml } from '@liuli-util/markdown-util'
import { getHighlighter } from 'shiki'

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
        const htmlContent = toHtml(fromMarkdown(code), {
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
        if (!req.url?.endsWith('.md')) {
          return next()
        }

        try {
          const fileContent = await readFile(path.resolve(rootPath, req.url), 'utf-8')
          const htmlContent = toHtml(fromMarkdown(fileContent))

          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(htmlContent)
        } catch {
          next()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), cssdts(), markdown()],
  css: {
    postcss: {
      plugins: [tailwindcss() as any, autoprefixer()],
    },
  },
})
