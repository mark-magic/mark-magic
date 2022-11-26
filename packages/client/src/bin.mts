import { pathExists, readJson, writeJson } from '@liuli-util/fs-extra'
import ora from 'ora'
import path from 'path'
import { convert, ConvertConfig } from '@mami/cli'
import * as joplin from '@mami/plugin-joplin'
import * as obsidian from '@mami/plugin-obsidian'
import * as hexo from '@mami/plugin-hexo'
import * as hugo from '@mami/plugin-hugo'
import * as local from '@mami/plugin-local'
import * as raw from '@mami/plugin-raw'

const plugins = {
  joplin,
  obsidian,
  hexo,
  hugo,
  local,
  raw,
}

interface JsonConfig {
  input?: [string, any][]
  output?: [string, any][]
  debug?: boolean
}

const configPath = path.resolve('mami.config.json')
if (!(await pathExists(configPath))) {
  throw new Error('config <mami.config.json> not found ')
}
const jsonConfig = (await readJson(configPath)) as JsonConfig

console.log('start')
const spinner = ora().start()
spinner.color = 'blue'
const config = {
  ...jsonConfig,
  input: jsonConfig.input?.map((item) => plugins[item[0]].input(item[1])),
  output: jsonConfig.output?.map((item) => plugins[item[0]].output(item[1])),
} as ConvertConfig
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
