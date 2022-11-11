import { pathExists, writeJson } from '@liuli-util/fs-extra'
import { bundleRequire } from 'bundle-require'
import ora from 'ora'
import path from 'path'
import { convert, ConvertConfig } from './convert'

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
const config = mod.default as ConvertConfig
const r = await convert(config)
  .on('generate', ({ note }) => {
    spinner.text = 'handle: ' + note.title
  })
  .on('handle', ({ note, time, output }) => {
    if (time > 10 * 1000) {
      spinner.warn(`handle slow, plugin ${output.name}, note: ${note.title}`)
    }
  })
  .on('error', (context) => {
    const e = context.error as Error
    spinner.fail(`handle error, plugin: ${context.plugin.name}, note: ${context.note.title}`)
    console.error(e)
  })
spinner.stop()
console.log('end')
if (config.debug) {
  await writeJson(path.resolve('mami-performance.json'), r.performance)
}
