import { InputPlugin } from '@mark-magic/core'
import { InputConfig } from './utils'
import { ao3 } from './ao3'
import { sufficientvelocity } from './sufficientvelocity'

const map: Record<Required<InputConfig>['site'], (options: InputConfig) => InputPlugin> = {
  ao3,
  sufficientvelocity,
}

export function input(options: InputConfig): InputPlugin {
  return map[options.site](options)
}
