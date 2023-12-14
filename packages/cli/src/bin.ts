import { convert } from '@mark-magic/core'
import { Command } from 'commander'
import { pino } from 'pino'
import { loadConfig, parseConfig } from './configParser'

interface CliOptions {
  root?: string
  config?: string
  task?: string[]
  debug?: boolean
}

const logger = pino({
  level: 'info',
})

async function main(options: CliOptions) {
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
  for (const it of resolvedConfig) {
    if (options.task && !options.task.includes(it.name)) {
      continue
    }
    console.log(`运行任务: ${it.name}`)
    await convert(it)
  }
}

new Command()
  .option('-c, --config [config]', '配置文件路径')
  .option('-t, --task [task...]', '执行的任务')
  .option('--debug', '调试模式')
  .action(async (options: CliOptions) => {
    await main(options)
  })
  .parse()
