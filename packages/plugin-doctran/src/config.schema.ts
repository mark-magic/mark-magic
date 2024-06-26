/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * 插件配置
 */
export type DoctranTransformConfig = DoctranGoogleOptions | DoctranOpenAIOptions

export interface ConfigSchema {
  /**
   * 翻译文档
   */
  transform?: {
    /**
     * 插件名字
     */
    name: '@mark-magic/plugin-doctran'
    config: DoctranTransformConfig
  }
}
/**
 * Google 翻译
 */
export interface DoctranGoogleOptions {
  engine: 'google'
  to: 'zh-CN' | 'en'
}
/**
 * openai
 */
export interface DoctranOpenAIOptions {
  engine: 'openai'
  to: 'zh-CN' | 'en'
  apiKey: string
  baseUrl?: string
  model?: string
  prompt?: string
  entities?: {
    [k: string]: string
  }
}
