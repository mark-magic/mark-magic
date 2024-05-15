/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type InputPluginConfig = LocalPluginConfig
export type TransformPluginConfig = DoctranPluginConfig
export type OutputPluginConfig =
  | {
      /**
       * 插件名字
       */
      name: '@mark-magic/plugin-local'
      /**
       * 插件配置
       */
      config: {
        /**
         * 输出本地目录的路径
         */
        path: string
      }
    }
  | EpubPluginConfig
  | DocsPluginConfig

export interface ConfigSchema {
  tasks: TaskConfig[]
}
export interface TaskConfig {
  /**
   * 生成任务的名字
   */
  name: string
  input: InputPluginConfig
  /**
   * 转换插件
   */
  transforms?: TransformPluginConfig[]
  output: OutputPluginConfig
  /**
   * 是否开启调试模式
   */
  debug?: boolean
}
/**
 * 从本地目录读取
 */
export interface LocalPluginConfig {
  /**
   * 插件名字
   */
  name: '@mark-magic/plugin-local'
  /**
   * 插件配置
   */
  config: {
    /**
     * 本地目录的路径
     */
    path: string
    /**
     * 包含的文件，支持 glob 语法
     */
    source?: string[]
    /**
     * 排除的文件，支持 glob 语法
     */
    ignore?: string[]
  }
}
/**
 * 翻译文档
 */
export interface DoctranPluginConfig {
  /**
   * 插件名字
   */
  name: '@mark-magic/plugin-doctran'
  /**
   * 插件配置
   */
  config:
    | {
        engine: 'google'
        to: 'zh-CN' | 'en'
      }
    | {
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
}
/**
 * 输出为 epub
 */
export interface EpubPluginConfig {
  /**
   * 插件名字
   */
  name: '@mark-magic/plugin-epub'
  /**
   * 插件配置
   */
  config: {
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
}
/**
 * 输出为网站
 */
export interface DocsPluginConfig {
  /**
   * 插件名称
   */
  name: '@mark-magic/plugin-docs'
  config: {
    /**
     * 输出文件的路径
     */
    path: string
    /**
     * 网站名称
     */
    name: string
    /**
     * 网站名称
     */
    description?: string
    /**
     * 基础路径
     */
    base?: string
    /**
     * 静态资源目录
     */
    public?: string
    /**
     * 语言
     */
    lang?: string
    /**
     * 导航栏
     */
    nav?: (
      | {
          text: string
          link: string
        }
      | {
          text: string
          items: {
            text: string
            link: string
          }[]
        }
    )[]
    /**
     * 网站 logo
     */
    logo?:
      | string
      | {
          light: string
          dark: string
        }
    sitemap?: {
      hostname: string
    }
    rss?: {
      hostname: string
      copyright: string
      author?: {
        name?: string
        email?: string
        link?: string
        [k: string]: unknown
      }[]
      ignore?: string[]
    }
    giscus?: {
      repo: string
      repoId: string
      category: string
      categoryId: string
      mapping: string
      reactionsEnabled: string
      emitMetadata?: string
      inputPosition: string
      theme: string
      lang: string
      crossorigin: string
    }
    gtag?: string | string[]
  }
}
