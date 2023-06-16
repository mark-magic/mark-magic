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
  /** 文件的路径，用于规划目录 */
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
  /** 输出插件 */
  output: OutputPlugin
  /** 是否启用 debug */
  debug?: boolean
}

export interface Events {
  generate?(options: { input: InputPlugin; note: Content }): void
  handle?(options: { input: InputPlugin; output: OutputPlugin; note: Content; time: number }): void
  error?(context: { note: Content; plugin: InputPlugin | OutputPlugin; error: unknown }): void
}

export function convert(options: ConvertConfig) {
  return PromiseUtil.warpOnEvent(async (events: Events) => {
    const input = options.input
    const output = options.output
    await output.start?.()
    const generator = input.generate()

    for await (const note of generator) {
      events.generate?.({ input, note })
      const start = Date.now()

      try {
        await output.handle(note)
        events.handle?.({ input, output, note, time: Date.now() - start })
      } catch (e) {
        events.error?.({
          note,
          plugin: output,
          error: e,
        })
      }
    }
    await output.end?.()

    return {}
  })
}
