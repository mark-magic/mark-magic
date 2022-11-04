# mami 一个跨工具文档转换器

## 简介

mami 是一个转换工具，可以连接不同的基于 markdown 框架和工具，能将一种工具的数据转换到另一种工具，这对于跨应用迁移以及多平台发布很有帮助，目前已已知 `joplin/obsidian/hexo/hugo/raw`，计划将支持 `docsify/vuepress`。

## 使用

> 前置条件
>
> - 你需要安装 [nodejs 18](https://nodejs.org/en/download/)

### 步骤 1：创建新项目

> 下面使用 pnpm 作为包管理器，但你可以替换它为 npm

创建新目录并进入

```sh
mkdir mami-starter && cd mami-starter
```

然后使用喜欢的包管理器初始化

```sh
pnpm init
```

### 步骤 2：安装 mami

添加 @mami/cli 和 typescript 作为项目的开发依赖项

```sh
pnpm i -D @mami/cli typescript
```

添加一些脚本到 `package.json`

```json
{
  ...
  "scripts": {
    "gen": "mami"
  },
  ...
}
```

创建你的配置文件 `mami.config.ts`

```ts
import { defineConfig } from '@mami/cli'

export default defineConfig({
  input: [],
  output: [],
})
```

然后运行

```sh
$ pnpm run gen

> joplin2obsidian-demo@1.0.0 gen
> mami

start
end
```

嗯，什么也没有发生，因为你没有定义输入或输出插件。继续看下一步。

### 步骤 3：安装需要的插件

安装需要的插件，用来连接需要的工具，这里使用 joplin => obsidian 来举例

```ts
pnpm i -D @mami/plugin-joplin @mami/plugin-obsidian
```

修改你的配置文件 `mami.config.ts`

> 这里的 joplin 插件需要的 token 来自 [web clipper service](https://joplinapp.org/clipper/#troubleshooting-the-web-clipper-service)

```ts
import { defineConfig } from '@mami/cli'
import * as joplin from '@mami/plugin-joplin'
import * as obsidian from '@mami/plugin-obsidian'
import path from 'path'

export default defineConfig({
  input: [
    joplin.input({
      baseUrl: 'http://localhost:41184',
      token:
        '5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31',
      tag: '',
    }),
  ],
  output: [
    obsidian.output({
      root: path.resolve(__dirname, 'dist'),
    }),
  ],
})
```

### 步骤 4：执行转换

然后，你可以重新运行以下命令

```sh
pnpm run gen
```

现在，你将能在 dist 中看到转换的 obsidian 文件

> [示例](https://github.com/rxliuli/mami/tree/master/demos/joplin2obsidian-demo)

## 插件

> [API 文档](https://paka.dev/npm/@mami/cli@latest/api)

大致上，插件分为输入和输出插件，输入插件会返回一个 [AsyncGenerator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncGenerator)，而输出插件则会则 `handle hook` 函数中消费它。

![design](./public/design.drawio.svg)

中间格式

```json
{
  "id": "0e2510c9272449dbafe3e0f3fba12d74",
  "title": "Welcome to Joplin!",
  "content": "content body",
  "createAt": 1666288266591,
  "updateAt": 1666288266591,
  "path": ["Welcome! (Desktop)"],
  "tags": [
    {
      "id": "04dfa5cf19e4435f9f3f09a73a7edfb2",
      "title": "blog"
    }
  ],
  "resources": [
    {
      "id": "63b83e548b7b4adfae18544b7038b0bc",
      "title": "AllClients.png",
      "raw": "<nodejs buffer>"
    }
  ]
}
```

编写插件涉及到一些 markdown ast 操作，例如你可能需要转换 markdown 中的链接，建议使用 [mdast](https://github.com/syntax-tree/mdast) 来处理。

## 动机

为什么开始了这次重写？

主要原因是目前支持了一些框架，但实际上仍然不够，就吾辈而言，目前接触到了 vitepress 文档生成器，吾辈打算用它替代 vuepress，但这需要对 joplin-blog 做一些修改，实际上这并不太方便。之前也有人提到如何更有定制性的生成文件，例如在生成的 markdown 添加额外的 yaml meta 信息（ref: <https://github.com/rxliuli/joplin-utils/issues/55>），这实际上在没有扩展点的情况下有点麻烦，那时给出的临时解决方案是以 lib 的形式使用 joplin-blog，并插入自定义的一些逻辑来完成。也有人提到了支持 hugo，但全部在 joplin-blog 中实现是不显示的。

后来，吾辈意识到支持生成任意框架的文件需要插件系统，进一步而言，吾辈甚至可以将输入源（例如 joplin）也作为插件，就像 pandoc 一样，连接不同的笔记、博客和 wiki 工具。目前做的一个尝试就是 mami，打算通过 markdown 作为中间格式进行转换。
目前这个项目才刚刚创建，并且仅支持 joplin 作为输入源、hexo/hugo/obsidian 作为输出源，但吾辈已经在自己的 blog 中使用了，参考：<https://github.com/rxliuli/blog/blob/master/mami.config.ts>

> PS：mami 这个名字的来源是 Puella Magi Madoka Magica 中的 [Mami Tomoe](https://en.wikipedia.org/wiki/Mami_Tomoe)，她的魔法是**缎带**，可以连接各种不同的事物，甚至能组成火枪（笑）。
