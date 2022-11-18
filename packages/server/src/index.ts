import Application from 'koa'
import cors from '@koa/cors'
import Router from '@koa/router'
import serve from 'koa-static'
import { list } from './api/list'
import { getConfig, setConfig } from './api/config'
import { koaBody } from 'koa-body'
import logger from 'koa-logger'
import { execute } from './api/excute'

export type { MamiPlugin } from './api/list'
export type { GetConfigParam, SetConfigParam } from './api/config'
export type { ExecuteOptions } from './api/excute'

export function start(options: { static: string; port: number }) {
  const app = new Application()
  const router = new Router()
  router.get('/api/ping', (ctx) => {
    ctx.body = { code: 200, msg: 'success' }
  })
  // 根据类型获取所有插件
  router.get('/api/list', (ctx) => {
    ctx.body = list(ctx.request.query.type as any)
  })
  // 根据插件名和 input/output 获取插件的配置
  router.get('/api/config', (ctx) => {
    ctx.body = getConfig(ctx.query as any)
  })
  // 根据插件名和 input/output 配置插件
  router.post('/api/config', koaBody(), (ctx) => {
    setConfig(ctx.request.body as any)
    ctx.body = {}
  })
  // 根据插件执行
  router.post('/api/execute', koaBody(), async (ctx) => {
    await execute(JSON.parse(ctx.request.body))
    ctx.body = {}
  })
  app
    .use(cors())
    .use(
      logger({
        transporter(str) {
          console.log(str)
        },
      }),
    )
    .use(router.routes())
  app.use(serve(options.static))

  const s = app.listen(options.port)
  return () => {
    s.close()
  }
}
