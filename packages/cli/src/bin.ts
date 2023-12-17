import { Command } from 'commander'
import { CliOptions, execute } from './execute'

new Command()
  .option('-c, --config [config]', '配置文件路径')
  .option('-t, --task [task...]', '执行的任务')
  .option('--debug', '调试模式')
  .action(async (options: CliOptions) => {
    await execute(options)
  })
  .parse()
