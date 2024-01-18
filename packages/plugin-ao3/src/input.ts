import { InputPlugin } from '@mark-magic/core'
import { InputConfig } from './options'
import { ao3 } from './ao3'

const map: Record<InputConfig['site'], (options: InputConfig) => InputPlugin> = {
  ao3: ao3,
}

export function input(options: InputConfig): InputPlugin {
  return map[options.site](options)
}
