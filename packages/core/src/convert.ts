import { PromiseUtil } from './utils/PromiseUtil'

interface Data {
  /** 数据的唯一标识符 */
  id: string
  /** 数据的名字 */
  name: string
  /** 创建时间 */
  created: number
  /** 更新时间 */
  updated: number
  /** 可能存在的其他数据 */
  extra?: any
}

/** 除内容之外的内容均视为资源 */
export interface Resource extends Data {
  /** 资源的二进制表示 */
  raw: Buffer
}

/** 内容文件 */
export interface Content extends Data {
  /** 文本内容，实质上并不真的关心格式 */
  content: string
  /** 文件的路径，用于规划目录，包括文件名本身，例如 books/01/001.md */
  path: string[]
  /** 引用的资源，重复的资源可以指向同一个 */
  resources: Resource[]
}

/** 输入插件 */
export interface InputPlugin {
  /** 名字 */
  name: string
  /** 异步迭代器，生成内容文件流 */
  generate(): AsyncGenerator<Content>
}

/** 转换插件，不输入或输出，仅对流中的 Content 做一些转换 */
export interface TransformPlugin {
  name: string
  start?(): Promise<void>
  /** 转换函数 */
  transform(content: Content): Promise<Content>
  end?(): Promise<void>
}

/** 输出插件 */
export interface OutputPlugin {
  /** 名字 */
  name: string
  /** 结束的钩子函数 */
  start?(): Promise<void>
  /** 处理每一个内容及其依赖的资源 */
  handle(content: Content): Promise<void>
  /** 结束的钩子函数 */
  end?(): Promise<void>
}

/** 转换配置 */
export interface ConvertConfig {
  /** 输入插件 */
  input: InputPlugin
  /** 转换插件 */
  transforms?: TransformPlugin[]
  /** 输出插件 */
  output: OutputPlugin
  /** 是否启用 debug */
  debug?: boolean
}

export interface Events {
  generate?(options: { input: InputPlugin; content: Content }): void
  handle?(options: { input: InputPlugin; output: OutputPlugin; content: Content; time: number }): void
  transform?(options: { transform: TransformPlugin; content: Content; time: number }): void
}

export function convert(options: ConvertConfig) {
  return PromiseUtil.warpOnEvent(async (events: Events) => {
    const input = options.input
    const output = options.output
    await output.start?.()
    const generator = input.generate()

    for (const transform of options.transforms ?? []) {
      await transform.start?.()
    }
    for await (let content of generator) {
      events.generate?.({ input, content })
      let start = Date.now()
      try {
        for (const transform of options.transforms ?? []) {
          content = await transform.transform(content)
          events.transform?.({ transform, content, time: Date.now() - start })
          start = Date.now()
        }
        await output.handle(content)
        events.handle?.({ input, output, content, time: Date.now() - start })
      } catch (e) {
        throw e
      }
    }
    for (const transform of options.transforms ?? []) {
      await transform.end?.()
    }
    await output.end?.()

    return {}
  })
}
