import { ConvertConfig } from '@mark-magic/core'

export interface ResolvedConfig {
  tasks: (ConvertConfig & {
    name: string
  })[]
}

/**
 * 配置辅助工具函数
 * @param config
 * @returns
 */
export function defineConfig<T extends ResolvedConfig | (() => ResolvedConfig) | (() => Promise<ResolvedConfig>)>(
  config: T,
): T {
  return config
}
