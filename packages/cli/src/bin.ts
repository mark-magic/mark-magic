import { readFile } from 'fs/promises'
import { ConfigSchema, GenerateConfig, PluginConfig } from './config.schema'
import pathe from 'pathe'
import yaml from 'yaml'
import { AsyncArray } from '@liuli-util/async'
import { InputPlugin, OutputPlugin, convert } from '@mark-magic/core'
import { createRequire } from 'module'

async function loadConfig(rootPath: string): Promise<ConfigSchema> {
  const configPath = pathe.resolve(rootPath, '.mark-magic.yaml')
  const config = await readFile(configPath, 'utf-8')
  return yaml.parse(config)
}

async function parseConfig(
  rootPath: string,
  config: ConfigSchema,
): Promise<
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

async function main() {
  // 读取配置文件
  const rootPath = process.cwd()
  const config = await loadConfig(rootPath)
  // 解析插件和配置
  const resolvedConfig = await parseConfig(rootPath, config)
  // 执行转换
  for (const it of resolvedConfig) {
    console.log(`开始执行任务: ${it.name}`)
    await convert({
      input: it.input.plugin(it.input.config),
      output: it.output.plugin(it.output.config),
    })
  }
}

await main()
