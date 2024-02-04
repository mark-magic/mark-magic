import { convert } from '@mark-magic/core'
import { loadConfig, parseConfig } from './configParser'
import { compareVersions } from 'compare-versions'
import ora from 'ora'
import { logger } from './logger'
import { isCI } from 'ci-info'

export interface CliOptions {
  root?: string
  config?: string
  task?: string[]
  debug?: boolean
}

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
    const spinner = ora({ text: `Starting: ${it.name}`, color: 'blue' }).start()
    try {
      let i = 0
      await convert(it)
        .on('generate', (it) => {
          i++
          if (isCI) {
            console.log(`Processing content ${i}: ${it.content.name}`)
          } else {
            spinner.text = `Processing content ${i}: ${it.content.name}`
          }
          logger.debug('generate: %O', it.content.name)
        })
        .on('transform', (it) => {
          logger.debug('transform: %O', it.content.name)
        })
        .on('handle', (it) => {
          logger.debug('handle: %O', it.content.name)
        })
      if (i > 0) {
        spinner.stopAndPersist({ text: `Completed: ${it.name} - ${i} content processed` })
      } else {
        spinner.stopAndPersist({ text: `Completed: ${it.name} - No content processed` })
      }
    } catch (err) {
      spinner.color = 'red'
      spinner.stopAndPersist({ text: `Error in task: ${it.name}` })
      logger.error(err)
      return
    }
  }
}
