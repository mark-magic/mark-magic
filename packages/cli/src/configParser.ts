import { readFile, readdir } from 'fs/promises'
import { ConfigSchema } from './config.schema'
import pathe from 'pathe'
import yaml from 'yaml'
import { AsyncArray } from '@liuli-util/async'
import { pathExists } from 'fs-extra/esm'
import { bundleRequire } from 'bundle-require'
import { InputPlugin, OutputPlugin, TransformPlugin } from '@mark-magic/core'
import { ResolvedConfig } from './defineConfig'
import { logger } from './logger'
import { config } from 'dotenv'
import path from 'pathe'

export async function loadEnv(rootPath: string) {
  const list = await readdir(rootPath)
  list.filter((it) => it.startsWith('.env')).forEach((it) => config({ path: path.resolve(rootPath, it) }))
}

export function injectEnv(options: string): string {
  return options.replace(/\$\{([^}]+)\}/g, (_, key) => (process.env[key] ? JSON.stringify(process.env[key]) : ''))
}

export async function loadConfig(rootPath: string): Promise<string> {
  const c = ['mark-magic.config.yaml', 'mark-magic.config.ts']
  for (const it of c) {
    const configPath = pathe.resolve(rootPath, it)
    if (await pathExists(configPath)) {
      return configPath
    }
  }
  throw new Error(`Unable to find the configuration file: ${rootPath}`)
}

export async function parseYamlConfig(configPath: string): Promise<ResolvedConfig> {
  const configStr = await readFile(configPath, 'utf-8')
  await loadEnv(pathe.dirname(configPath))
  const config = yaml.parse(injectEnv(configStr)) as ConfigSchema
  logger.debug('yaml config: %O', config)
  return {
    tasks: await AsyncArray.map(config.tasks, async (it) => {
      let input: InputPlugin, output: OutputPlugin, transforms: TransformPlugin[]
      try {
        input = (await import(it.input.name)).input(it.input.config) as InputPlugin
      } catch {
        throw new Error(`Plugin not found: ${it.input.name}`)
      }
      transforms = await AsyncArray.map(it.transforms ?? [], async (transform) => {
        try {
          return (await import(transform.name)).transform(transform.config) as TransformPlugin
        } catch {
          throw new Error(`Plugin not found: ${transform.name}`)
        }
      })
      try {
        output = (await import(it.output.name)).output(it.output.config) as OutputPlugin
      } catch {
        throw new Error(`Plugin not found: ${it.output.name}`)
      }
      return {
        name: it.name,
        input,
        transforms,
        output,
      }
    }),
  }
}

export async function parseJsConfig(configPath: string): Promise<ResolvedConfig> {
  const { mod } = await bundleRequire({
    filepath: configPath,
  })
  let res: ResolvedConfig = mod.default
  if (typeof mod.default === 'function') {
    res = await mod.default()
  }
  if (typeof mod.default !== 'object') {
    throw new Error('The configuration file must export a function or an array.')
  }
  return mod.default as ResolvedConfig
}

export async function parseConfig(configPath: string): Promise<ResolvedConfig> {
  if (!configPath) {
    return {
      tasks: [],
    }
  }
  if (pathe.extname(configPath) === '.yaml') {
    return await parseYamlConfig(configPath)
  }
  if (['.ts', '.js'].includes(pathe.extname(configPath))) {
    return await parseJsConfig(configPath)
  }
  throw new Error('Unsupported configuration file type: ' + configPath)
}
