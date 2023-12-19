import { convert } from '@mark-magic/core'
import { pino } from 'pino'
import { loadConfig, parseConfig } from './configParser'
import { compareVersions } from 'compare-versions'
import { ResolvedConfig } from './defineConfig'

export interface CliOptions {
  root?: string
  config?: string
  task?: string[]
  debug?: boolean
}
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
  },
})

export async function execute(options: CliOptions) {
  if (compareVersions(process.version, '20.0.0') === -1) {
    console.error('node version must >= 20')
    return
  }
  const rootPath = options.root ?? process.cwd()
  if (options.task) {
    options.task = options.task
      .map((it) => it.split(','))
      .flat()
      .filter((it) => it)
  }
  if (options.debug) {
    logger.level = 'debug'
  }
  logger.debug('options: %O', options)
  // 解析插件和配置
  const configPath = options.config ?? (await loadConfig(rootPath))
  const resolvedConfig = await parseConfig(configPath)
  logger.debug('resolvedConfig: %O', resolvedConfig)
  // 执行转换
  for (const it of resolvedConfig.tasks) {
    if (options.task && !options.task.includes(it.name)) {
      continue
    }
    console.log(`task start: ${it.name}`)
    try {
      let i = 0
      await convert(it)
        .on('generate', (it) => {
          i++
          logger.debug('generate: %O', it.content.name)
        })
        .on('transform', (it) => {
          logger.debug('transform: %O', it.content.name)
        })
        .on('handle', (it) => {
          logger.debug('handle: %O', it.content.name)
        })
      if (i > 0) {
        console.log(`task end: ${it.name}`)
      } else {
        console.log(`task end: ${it.name} (no file generated)`)
      }
    } catch (err) {
      logger.error(`task error: ${it.name}`)
      logger.error(err)
    }
  }
}
