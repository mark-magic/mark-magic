# 插件

> **该文档正在进行中**

## 介绍

mark-magic 的基础是建立在插件系统之上的，目前已经支持的几个数据源插件有 local/joplin，输出插件包括 docs/epub/hexo/local，如果目前还没有，可以在 [github issue](https://github.com/mark-magic/mark-magic/issues) 中提出，或按照 [开发自定义插件](#开发自定义插件) 中的说明开发新的插件。

目前提供了两类插件，输入插件和输出插件，输入插件用来从数据源中读取数据，输出插件用来将数据输出特定目标。

- 输入插件
  - [plugin-local](./plugin-local.md)
  - [plugin-joplin](./plugin-joplin.md)
- 输出插件
  - [plugin-docs](./plugin-docs.md)
  - [plugin-epub](./plugin-epub.md)
  - [plugin-hexo](./plugin-hexo.md)
  - [plugin-local](./plugin-local.md)

## 开发自定义插件

如果目前还没有合适的插件，可以按照以下步骤开发自定义插件。

### 插件的概念

### 初始化项目

```bash
mkdir mark-magic-plugin-xxx
cd mark-magic-plugin-xxx
npm init
```

### 安装依赖

```bash
npm install @mark-magic/core
```

### 编写插件

```ts
// src/index.ts
import { InputPlugin } from '@mark-magic/core'

export function input(): InputPlugin {
  return {
    name: 'xxx',
    async generate() {
      // TODO
    },
  }
}
```

### 插件结构

插件是一个 npm 包，需要包含以下文件：

插件可以在 exports 中导出以下字段：

- input: 输入插件
- output: 输出插件

```ts
export function input(): InputPlugin {
  return {
    name: 'xxx',
    async generate() {
      // TODO
    },
  }
}
```
