import { mkdirp, pathExists, readJson, writeJson } from '@liuli-util/fs-extra'
import { OutputPlugin } from '@mark-magic/core'
import path from 'path'

export interface OutputCacheOptions {
  read(): Promise<Record<string, number>>
  write(json: Record<string, number>): Promise<void>
}

function defaultOutputCacheOptions(plugin: OutputPlugin): OutputCacheOptions {
  const fsPath = path.resolve(plugin.name + '-output-cache.json')
  return {
    async read() {
      return (await pathExists(fsPath)) ? await readJson(fsPath) : {}
    },
    async write(cache) {
      await mkdirp(path.dirname(fsPath))
      await writeJson(fsPath, cache)
    },
  }
}

export function outputCache(
  plugin: OutputPlugin,
  options: OutputCacheOptions = defaultOutputCacheOptions(plugin),
): OutputPlugin {
  let map: Record<string, number> = {}
  const newMap: Record<string, number> = {}
  return {
    name: plugin.name,
    async start() {
      map = await options.read()
      plugin.start?.()
    },
    async handle(content) {
      newMap[content.id] = content.updated
      if (map[content.id] && map[content.id] === content.updated) {
        delete map[content.id]
        return
      }
      await plugin.handle(content)
    },
    async end() {
      await options.write(newMap)
      plugin.end?.()
    },
  }
}
