import { Command } from 'commander'
import { CliOptions, execute } from './execute'

new Command()
  .option('-t, --task [task...]', 'Excuting task')
  .option('--root, --root [root]', 'Execute root path')
  .option('--debug', 'Debug mode')
  .action(async (options: CliOptions) => {
    await execute(options)
  })
  .parse()
