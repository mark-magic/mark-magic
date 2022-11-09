import { mkdirp, pathExists, readJson, writeJson } from '@liuli-util/fs-extra'
import { OutputPlugin } from '@mami/cli'
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
    async handle(note) {
      newMap[note.id] = note.updateAt
      if (map[note.id] && map[note.id] === note.updateAt) {
        delete map[note.id]
        return
      }
      await plugin.handle(note)
    },
    async end() {
      await options.write(newMap)
      plugin.end?.()
    },
  }
}
