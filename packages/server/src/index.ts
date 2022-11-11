import Application from 'koa'
import cors from '@koa/cors'
import Router from '@koa/router'
import serve from 'koa-static'

export async function list() {
  return []
}

export function start(options: { static: string; port: number }) {
  const app = new Application()
  const router = new Router()
  router.get('/api/ping', (ctx) => {
    ctx.body = { code: 200, msg: 'success' }
  })
  app.use(cors()).use(router.routes())
  app.use(serve(options.static))

  const s = app.listen(options.port)
  return () => {
    s.close()
  }
}
