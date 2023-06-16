import { OutputPlugin } from '@mark-magic/core'

export function output(): OutputPlugin {
  return {
    name: 'epub',
    start() {},
    handle(content) {},
    end() {},
  }
}
