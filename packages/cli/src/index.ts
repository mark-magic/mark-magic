import { readFile } from 'fs/promises'
import { ConfigSchema, PluginConfig } from './config.schema'
import pathe from 'pathe'
import yaml from 'yaml'
import { AsyncArray } from '@liuli-util/async'
import { InputPlugin, OutputPlugin } from '@mark-magic/core'
import { pathExists } from '@liuli-util/fs'

export async function loadConfig(rootPath: string): Promise<ConfigSchema> {
  const configPath = pathe.resolve(rootPath, '.mark-magic.yaml')
  if (!(await pathExists(configPath))) {
    throw new Error(`无法找到配置文件: ${configPath}`)
  }
  const config = await readFile(configPath, 'utf-8')
  return yaml.parse(config)
}

export async function parseConfig(config: ConfigSchema): Promise<
  {
    name: string
    input: PluginConfig & {
      plugin: (config: PluginConfig['config']) => InputPlugin
    }
    output: PluginConfig & {
      plugin: (config: PluginConfig['config']) => OutputPlugin
    }
  }[]
> {
  return await AsyncArray.map(config.generate, async (it) => {
    try {
      return {
        ...it,
        input: { ...it.input, plugin: (await import(it.input.name)).input },
        output: { ...it.output, plugin: (await import(it.output.name)).output },
      }
    } catch {
      throw new Error(`无法找到插件: ${it.name}`)
    }
  })
}
