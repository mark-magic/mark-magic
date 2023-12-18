import { Command } from 'commander'
import { version } from '../package.json'
import { create } from '.'

new Command()
  .argument('[name]')
  .option('--template <template>', '模版', 'plugin-template')
  .action(async (name: string, destination: { template: string }) => {
    // console.log('args: ', name, destination)
    await create({
      root: process.cwd(),
      name: name,
      template: destination.template as any,
    })
  })
  .version(version)
  .parse()
