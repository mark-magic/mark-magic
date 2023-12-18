import { TransformPlugin } from '@mark-magic/core'
import { createTrans, trans } from './translate'
import findCacheDirectory from 'find-cache-dir'
import { mkdir, writeFile } from 'fs/promises'
import path from 'pathe'
import { pathExists, readJson } from 'fs-extra/esm'
import { DoctranTransformConfig } from './config.schema'

export function transform(options: DoctranTransformConfig): TransformPlugin {
  const map: Record<string, string> = {}
  const dir = findCacheDirectory({ name: '@mark-magic/plugin-doctran' })
  return {
    name: 'doctran',
    async start() {
      if (!dir) {
        return
      }
      const cachePath = path.resolve(dir, 'cache.json')
      if (await pathExists(cachePath)) {
        Object.assign(map, await readJson(cachePath))
      }
    },
    async transform(content) {
      const origin = content.content
      if (map[origin]) {
        content.content = map[origin]
        return content
      }
      content.content = await trans(createTrans(options), origin)
      map[origin] = content.content
      return content
    },
    async end() {
      if (!dir) {
        return
      }
      await mkdir(dir, { recursive: true })
      await writeFile(path.resolve(dir, 'cache.json'), JSON.stringify(map, null, 2))
    },
  }
}
