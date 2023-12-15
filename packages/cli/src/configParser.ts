import { readFile } from 'fs/promises'
import { ConfigSchema } from './config.schema'
import pathe from 'pathe'
import yaml from 'yaml'
import { AsyncArray } from '@liuli-util/async'
import { pathExists } from '@liuli-util/fs'
import { bundleRequire } from 'bundle-require'
import { InputPlugin, OutputPlugin } from '@mark-magic/core'
import { ResolvedConfig } from './defineConfig'

export async function loadConfig(rootPath: string): Promise<string> {
  const c = ['mark-magic.config.yaml', 'mark-magic.config.ts']
  for (const it of c) {
    const configPath = pathe.resolve(rootPath, it)
    if (await pathExists(configPath)) {
      return configPath
    }
  }
  throw new Error(`无法找到配置文件: ${rootPath}`)
}

export async function parseYamlConfig(configPath: string): Promise<ResolvedConfig[]> {
  const config = yaml.parse(await readFile(configPath, 'utf-8')) as ConfigSchema
  return await AsyncArray.map(config.generate, async (it) => {
    try {
      return {
        name: it.name,
        input: (await import(it.input.name)).input(it.input.config) as InputPlugin,
        output: (await import(it.output.name)).output(it.output.config) as OutputPlugin,
      } as ResolvedConfig
    } catch {
      throw new Error(`无法找到插件: ${it.name}`)
    }
  })
}

export async function parseJsConfig(configPath: string): Promise<ResolvedConfig[]> {
  const { mod } = await bundleRequire({
    filepath: configPath,
  })
  if (typeof mod.default === 'function') {
    return await mod.default()
  }
  if (Array.isArray(mod.default)) {
    return mod.default as ResolvedConfig[]
  }
  throw new Error('配置文件必须导出一个函数或者数组')
}

export async function parseConfig(configPath: string): Promise<ResolvedConfig[]> {
  if (!configPath) {
    return []
  }
  if (pathe.extname(configPath) === '.yaml') {
    return await parseYamlConfig(configPath)
  }
  if (['.ts', '.js'].includes(pathe.extname(configPath))) {
    return await parseJsConfig(configPath)
  }
  throw new Error('不支持的配置文件类型 ' + configPath)
}
