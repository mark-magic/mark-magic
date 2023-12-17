# plugin-local

同时能作为输入和输出的插件，但在配置文件中仅能作为输入插件使用。

## input

```yaml
tasks:
  - name: test
    input:
      name: '@mark-magic/plugin-local'
      config:
        path: './book/'
```

### path

递归扫描这个路径下所有的 markdown 文件及其引用的资源文件。

```sh
.
├─ books
│  ├─ 01.md
│  ├─ 02.md
│  └─ readme.md
└─ package.json
```

例如上面的目录会扫描得到，而不管层级多深。

```sh
books/01.md
books/02.md
books/readme.md
```

## output

对于需要输出为本地 markdown 文件的场景很有用，例如输出 hexo/hugo/vitepress/jekyll 时不需要从零开始编写插件，而是基于 local plugin 的输出进行简单配置会更简单。插件 [@mark-magic/plugin-hexo](./plugin-hexo.md) 就是这样实现的，甚至只用了 30 几行代码。

```ts
import { OutputPlugin } from '@mark-magic/core'
import path from 'pathe'
import * as local from '@mark-magic/plugin-local'

export interface Tag {
  id: string
  title: string
}

export function output(options?: { path?: string; base?: string }): OutputPlugin {
  const root = options?.path ?? path.resolve()
  const postsPath = path.resolve(root, 'source/_posts')
  const resourcePath = path.resolve(root, 'source/resources')
  const p = local.output({
    rootContentPath: postsPath,
    rootResourcePath: resourcePath,
    meta: (it) => ({
      layout: 'post',
      title: it.name,
      abbrlink: it.id,
      tags: it.extra?.tags.map((it: { title: string }) => it.title),
      categories: it.path,
      date: it.created,
      updated: it.updated,
    }),
    contentLink: (it) => path.join('/', options?.base ?? '/', `/p/${it.linkContentId}`),
    resourceLink: (it) => `/resources/${it.resource.id}${path.extname(it.resource.name)}`,
    contentPath: (it) => path.resolve(postsPath, it.id + '.md'),
    resourcePath: (it) => path.resolve(resourcePath, it.id + path.extname(it.name)),
  })
  p.name = 'hexo'
  return p
}
```

完整的类型定义

```ts
export interface OutputOptions {
  rootContentPath: string
  rootResourcePath: string
  meta(content: Content): any
  contentPath(content: Content): string
  resourcePath(content: Resource): string
  contentLink(o: {
    content: Content
    contentPath: string
    linkContentPath: string
    linkContentId: string
  }): string | undefined
  resourceLink(o: { resource: Resource; contentPath: string; resourcePath: string }): string | undefined
}
```

你可以在使用 `local.output` 创建输出插件实例时控制输出的方方面面。

### rootContentPath

输出 markdown 文件的根目录，必填项。

### rootResourcePath

输出 markdown 文件引用资源的根目录，必填项。

### meta

控制 markdown 顶部的 yaml 元数据。

默认情况下会输出 名字、创建时间和修改时间。

```md
---
name: Getting Started
created: 1702805863284
updated: 1702805863284
---

# Getting Started

## Overview
```

返回 null 不保留任何元数据。

```md
# Getting Started

## Overview
```

### contentPath

控制内容实际输出的路径，默认会根据 `rootContentPath` 及内容自身的 `path` 进行计算。

例如 `rootContentPath` 是 _~/code/blog/posts/_ 一个内容数据如下

```json
{
  "id": "test",
  "name": "test",
  "path": ["dev", "web", "test.md"]
}
```

那么输出路径默认是 _~/code/blog/posts/dev/web/test.md_。

### resourcePath

控制资源实际输出的路径，默认会根据 `rootResourcePath` 及资源自身的 `name` 进行计算。

例如 `rootResourcePath` 是 _~/code/blog/resources/_ 一个资源数据如下

```json
{
  "id": "test",
  "name": "test.png"
}
```

那么输出路径默认是 _~/code/blog/resources/test.png_。

### contentLink

如果内容之间存在引用关系，控制输出之后的 markdown 文件中如何引用，默认是输出 markdown 文件的相对路径。

例如内容 _/dev/web/vscode-plugin_ 中引用了内容 _/dev/tool/vscode_

```md
[vscode](../tool/vscode.md)
```

### resourceLink

如果内容引用了资源，控制输出之后的 markdown 文件中如何引用，默认是输出资源文件的相对路径。

例如内容输出的 markdown 文件是 _/posts/dev/web/vscode-plugin.md_ 中引用了资源 _/resources/vscode.png_

```md
![vscode](../../../resources/vscode.png)
```
