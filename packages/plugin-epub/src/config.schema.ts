/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface ConfigSchema {
  /**
   * 输出为 epub
   */
  output?: {
    /**
     * 插件名字
     */
    name: '@mark-magic/plugin-epub'
    config: EpubOutputConfig
  }
}
/**
 * 插件配置
 */
export interface EpubOutputConfig {
  /**
   * 输出文件的路径
   */
  path: string
  /**
   * 书籍唯一标识
   */
  id?: string
  /**
   * 书籍标题
   */
  title?: string
  /**
   * 作者
   */
  creator?: string
  /**
   * 发布者
   */
  publisher?: string
  /**
   * 语言
   */
  language?: string
  /**
   * 封面图片
   */
  cover?: string
}
