import { pathExists } from '@liuli-util/fs-extra'
import { bundleRequire } from 'bundle-require'
import ora from 'ora'
import path from 'path'
import { convert } from './convert'

const configPath = path.resolve('mami.config.ts')
if (!(await pathExists(configPath))) {
  throw new Error('config not found')
}
const { mod } = await bundleRequire({
  filepath: configPath,
})
console.log('start')
const spinner = ora().start()
spinner.color = 'blue'
await convert(mod.default)
  .on('generate', ({ note }) => {
    spinner.text = 'handle: ' + note.title
  })
  .on('error', (context) => {
    spinner.stop()
    console.error('origin error: ', context.error)
    throw new Error(`handle error, plugin: ${context.plugin.name}, note: ${context.note.title}`)
  })
spinner.stop()
console.log('end')
