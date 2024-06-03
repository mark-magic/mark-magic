import { TransformPlugin } from '@mark-magic/core'
import { translate } from './translate'
import findCacheDirectory from 'find-cache-dir'
import { mkdir } from 'fs/promises'
import path from 'pathe'
import { pathExists, readJson, writeJson } from 'fs-extra/esm'
import { DoctranTransformConfig } from './config.schema'
import { google } from './model/google'
import { openai } from './model/openai'
import { gemini } from './model/gemini'
import { claude } from './model/claude'

export function transform(options: DoctranTransformConfig): TransformPlugin {
  const cacheDir = findCacheDirectory({ name: '@mark-magic/plugin-doctran' })!

  return {
    name: 'doctran',
    async start() {
      if (!cacheDir) {
        throw new Error('Cannot find cache directory')
      }
      await mkdir(cacheDir, { recursive: true })
    },
    async transform(content) {
      const origin = content.content
      const cachePath = path.resolve(cacheDir, `${content.id}.json`)

      interface Cache {
        origin: string
        transformed: string
      }

      if (await pathExists(cachePath)) {
        const cache = (await readJson(cachePath)) as Cache
        if (cache.origin === origin) {
          content.content = cache.transformed
          return content
        }
      }
      const list = { google, openai, gemini, claude }
      const translator = Object.entries(list).find(([k]) => k === options.engine)?.[1](options as any)
      if (!translator) {
        throw new Error(`Cannot find corresponding translation engine: ${options.engine}`)
      }
      content.content = await translate(translator, origin)
      await writeJson(cachePath, {
        origin,
        transformed: content.content,
      } as Cache)
      return content
    },
  }
}
