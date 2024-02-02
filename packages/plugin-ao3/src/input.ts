import { InputPlugin } from '@mark-magic/core'
import { InputConfig, NovelInputPlugin } from './utils'
import { ao3 } from './ao3/input'
import { sufficientvelocity } from './sufficientvelocity'
import { bilibiliReadList } from './bilibiliReadList'

export function input(options: InputConfig): NovelInputPlugin {
  const list = [ao3, sufficientvelocity, bilibiliReadList].map((it) => it(options))
  const plugin = list.find((it) => it.match())
  return {
    name: 'novel',
    match() {
      return !!plugin
    },
    async *generate() {
      if (!plugin) {
        throw new Error('不支持的 url')
      }
      yield* plugin.generate()
    },
    getMeta() {
      if (!plugin) {
        throw new Error('不支持的 url')
      }
      return plugin.getMeta()
    },
  }
}
