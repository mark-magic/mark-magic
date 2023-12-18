import { convert } from '@mark-magic/core'
import { pino } from 'pino'
import { loadConfig, parseConfig } from './configParser'

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
  const rootPath = options.root ?? process.cwd()
  if (options.task) {
    options.task = options.task
      .map((it) => it.split(','))
      .flat()
      .filter((it) => it)
  }
  if (options.debug) {
    logger.level = 'debug'
    logger.debug('options: %O', options)
  }
  // 解析插件和配置
  const configPath = options.config ?? (await loadConfig(rootPath))
  const resolvedConfig = await parseConfig(configPath)
  // 执行转换
  for (const it of resolvedConfig.tasks) {
    if (options.task && !options.task.includes(it.name)) {
      continue
    }
    console.log(`任务开始: ${it.name}`)
    await convert(it)
      .on('generate', (it) => {
        logger.debug('生成内容: %O', it.content.name)
      })
      .on('transform', (it) => {
        logger.debug('转换内容: %O', it.content.name)
      })
      .on('handle', (it) => {
        logger.debug('处理内容: %O', it.content.name)
      })
  }
}
