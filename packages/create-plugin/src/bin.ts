import { Command } from 'commander'
import { version } from '../package.json'
import { create } from '.'
import path from 'pathe'
import { pathExists } from 'fs-extra/esm'
import inquirer from 'inquirer'

new Command()
  .argument('[name]', 'plugin name')
  .action(async (name?: string) => {
    if (!name) {
      const response = await inquirer.prompt<{ name: string }>({
        type: 'input',
        name: 'name',
        message: 'plugin name:',
        validate(input) {
          if (!input) {
            return 'plugin name is required'
          }
          return true
        },
      })
      name = response.name
    }
    const rootPath = process.cwd()
    const distPath = path.resolve(process.cwd(), name)
    if (await pathExists(distPath)) {
      const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>({
        type: 'confirm',
        name: 'overwrite',
        message: `Directory ${name} already exists. Continue?`,
        validate(input) {
          if (!input) {
            return 'plugin name is required'
          }
          return true
        },
      })
      if (!overwrite) {
        return
      }
    }
    await create({
      root: rootPath,
      name: name,
      template: 'plugin-template',
    })
  })
  .version(version)
  .parse()
