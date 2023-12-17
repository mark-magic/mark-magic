# 插件 API

如果目前还没有合适的插件，可以按照以下步骤创建插件。插件只是普通的 npm 包，但导出了符合特定规范的函数。

## 概念

输入插件是读取外部数据并转换为统一的 Content 流，输出插件是将 Content 流转换为特定的输出。内容是数据流转的关键，它抽象了插件之间的数据格式。

Content 可能还包含一系列的 Resource，它们是 Content 的一部分，但不是必须的。例如，Content 可能是一篇文章，而 Resource 是文章中引用的图片。下面是完整的类型定义：

```ts
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
```

## 编写插件

一个基本的插件是一个函数，而其中函数的参数就是配置文件中的 `config`，传入参数返回插件对象实例，然后由 mark-magic 调用与连接。

输入插件的 generate 函数是一个异步迭代器，每次迭代返回一个 Content 对象。类型定义是：

```ts
/** 输入插件 */
export interface InputPlugin {
  /** 名字 */
  name: string
  /** 异步迭代器，生成内容文件流 */
  generate(): AsyncGenerator<Content>
}
```

基本示例：

```ts
// src/index.ts
import { InputPlugin } from '@mark-magic/core'

export function input(options: {}): InputPlugin {
  return {
    name: 'xxx',
    async *generate() {
      // TODO
    },
  }
}
```

输出插件的主要函数是 `handle`，它接受一个 Content 对象并自行处理它。还有两个钩子函数，`start` 和 `end`，分别在任务开始和结束时调用。

```ts
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
```

基本示例：

```ts
// src/index.ts
import { OutputPlugin } from '@mark-magic/core'

export function output(options: {}): OutputPlugin {
  return {
    name: 'xxx',
    async start() {
      // TODO
    },
    async handle(content) {
      // TODO
    },
    async end() {
      // TODO
    },
  }
}
```

可以在 [mark-magic 项目](https://github.com/mark-magic/mark-magic/tree/main/packages) 中看到更多真实的插件示例。

## 发布插件

写完插件发布 npm 包即可，关于名字没什么特别要求，但建议使用 mark-magic-plugin-xxx 的格式，例如 `mark-magic-plugin-joplin`，便于后续查找。
