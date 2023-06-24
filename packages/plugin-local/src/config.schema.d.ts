/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface ConfigSchema {
  /**
   * 从本地目录读取或输出到本地目录
   */
  input?: {
    /**
     * 插件名字
     */
    name: '@mark-magic/plugin-local'
    config: LocalInputConfig
  }
}
/**
 * 插件配置
 */
export interface LocalInputConfig {
  /**
   * 本地目录的路径
   */
  path: string
}
