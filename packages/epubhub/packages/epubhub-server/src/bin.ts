import express, { ErrorRequestHandler, RequestHandler } from 'express'
import { createServer } from 'http'
import { download, generate } from './download'
import path from 'pathe'

const app = express().use(express.json())

function handleError(handler: RequestHandler): RequestHandler {
  return async (req, res, next) => {
    try {
      await handler(req, res, next)
      next()
    } catch (err) {
      console.log('server error', err)
      if (!err) {
        return next()
      }
      if (
        (typeof err === 'object' || err instanceof Error) &&
        'code' in err &&
        typeof err.code === 'number' &&
        'message' in err
      ) {
        return res.status((err as any).code).json({
          error: {
            code: (err as any).code,
            message: (err as any).message,
            data: (err as any).data,
          },
        })
      }
      res.status(500).json({
        error: {
          code: 500,
          message: err instanceof Error ? String(err.message) : String(err),
        },
      })
    }
  }
}

app.post(
  '/api/generate',
  handleError(async (req, res) => {
    const { url } = req.body
    if (typeof url !== 'string') {
      throw new Error('Invalid url')
    }
    console.log('generate', url)
    const r = await generate(url)
    res.json({ url: r })
  }),
)

app.get(
  '/api/download/:id',
  handleError(async (req, res) => {
    const { id } = req.params
    const r = await download(id)
    res.setHeader('Content-Type', 'application/epub+zip')
    res.setHeader('Content-Disposition', `attachment; filename="${r.name}.epub"`)
    res.send(r.data)
  }),
)

if (!import.meta.env.DEV) {
  app.use(express.static(path.resolve(__dirname, 'static')))
}
const server = createServer(app)
server.listen(8080)
console.log(`Server listening on http://localhost:8080`)
if (import.meta.hot) {
  import.meta.hot.accept(() => server.close())
  import.meta.hot.dispose(() => server.close())
}
