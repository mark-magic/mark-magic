/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface ConfigSchema {
  /**
   * 输出为文档网站
   */
  output?: {
    /**
     * 插件名称
     */
    name: '@mark-magic/plugin-docs'
    config: DocsOutputConfig
  }
}
export interface DocsOutputConfig {
  /**
   * 输出文件的路径
   */
  path: string
  /**
   * 静态资源目录
   */
  public?: string
  /**
   * 网站名称
   */
  name: string
  /**
   * 网站 logo
   */
  logo?: string
  /**
   * 仓库地址
   */
  repo?: string
  theme?: {
    dark?: boolean
  }
  giscus?: {
    repo: string
    repoId: string
    category: string
    categoryId: string
    mapping: string
    reactionsEnabled: string
    emitMetadata: string
    inputPosition: string
    theme: string
    lang: string
    crossorigin: string
  }
  gtag?: string | string[]
}
