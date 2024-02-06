# 配置

使用 `mark-magic.config.yaml` 作为配置文件，下面对基础字段加以说明

```yaml
tasks: # 定义一系列任务
  - name: blog # 任务的名字
    input: # 输入插件
      name: '@mark-magic/plugin-joplin' # 输入插件的名字
      config: # 输入插件的配置，下面对每个插件的配置详加说明
    transforms: # 转换插件
      - name: '@mark-magic/plugin-doctran' # 输入插件的名字
        config: # 插件的配置
    output:
      name: '@mark-magic/plugin-hexo' # 输出插件的名字
      config: # 输入插件的配置
```

## input

输入插件，用来从数据源中读取数据，例如从 joplin 中读取笔记，从本地文件中读取 markdown 文件等。

### input.name

输入插件的名字，例如 `@mark-magic/plugin-joplin`。

### input.config

输入插件的配置，下面对每个插件的配置详加说明。

- [plugin-local](./plugin/plugin-local.md#input)
- [plugin-epub](./plugin/plugin-epub.md)
- [plugin-docs](./plugin/plugin-docs.md)
- [plugin-joplin](./plugin/plugin-joplin.md)
- [plugin-hexo](./plugin/plugin-hexo.md)

## transforms

转换插件，可以有 0 到多个。

- [plugin-doctran](./plugin/plugin-doctran.md)
- [plugin-image-fetcher](./plugin/plugin-image-fetcher.md)

## output

输出插件，配置与输入插件类似。

- [plugin-local](./plugin/plugin-local.md#output)
- [plugin-hexo](./plugin/plugin-hexo.md)

## 环境变量

如果需要使用一些机密配置，例如 cookie 或 token 之类的，可以在 `mark-magic.config.yaml` 配置文件中使用 `${ENV_NAME}` 的方式来使用环境变量。同时 `@mark-magic/cli` 还支持自动读取配置文件同目录下的 `.env*` 配置，可以在其中定义环境变量并从 .gitignore 中忽略它们。

例如使用 `@mark-magic/plugin-joplin` 插件时

```yaml
tasks:
  - name: blog
    input:
      name: '@mark-magic/plugin-joplin'
      config:
        baseUrl: 'http://localhost:41184'
        token: ${JOPLIN_TOKEN}
        tag: blog
```

## TypeScript 配置文件

除了 yaml 配置之外，也支持使用 `mark-magic.config.ts` 作为配置文件，但该配置仅供了解 TypeScript 的使用者尝试，主要是为了快速支持一些未得到支持的插件。
例如目前并没有 vuepress 插件，但可以在 TypeScript 配置文件中快速实现并使用它。

```ts
import { defineConfig } from '@mark-magic/cli'
import * as joplin from '@mark-magic/plugin-joplin'
import * as local from '@mark-magic/plugin-local'
import { OutputPlugin } from '@mark-magic/core'
import { config } from 'dotenv'
import path from 'path'
import { existsSync } from 'fs'

function vuepress(options: { path: string }): OutputPlugin {
  const plugin = local.output({
    path: options.path,
    contentPath: (it) => path.join(options.path, it.id + '.md'),
    meta: (it) => ({
      title: it.name,
      date: new Date(it.created).toJSON(),
      tags: it.extra.tags,
    }),
  })
  plugin.name = 'vuepress'
  return plugin
}

if (existsSync('.env.local')) {
  config({ path: '.env.local' })
}

export default defineConfig({
  tasks: [
    {
      name: 'blog',
      input: joplin.input({
        baseUrl: 'http://localhost:41184',
        token: process.env.JOPLIN_TOKEN!,
        tag: 'blog',
      }),
      output: vuepress({
        path: './src/posts',
      }),
    },
  ],
})
```
