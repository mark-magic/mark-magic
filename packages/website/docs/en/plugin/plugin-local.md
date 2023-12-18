# plugin-local

A plugin that can be used as both input and output, but can only be used as an input plugin in the configuration file.

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

Recursively scans all markdown files and their referenced resource files under this path.

```sh
.
├─ books
│  ├─ 01.md
│  ├─ 02.md
│  └─ readme.md
└─ package.json
```

For example, the above directory will be scanned and the following files will be obtained, regardless of the level of nesting.

```sh
books/01.md
books/02.md
books/readme.md
```

## output

Useful for scenarios that require output to local markdown files. For example, when outputting to hexo/hugo/vitepress/jekyll, it is simpler to configure based on the output of the local plugin instead of writing a plugin from scratch. The [@mark-magic/plugin-hexo](./plugin-hexo.md) plugin is implemented in this way and uses only about 30 lines of code.

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

Complete type definition:

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

You can control all aspects of the output when creating an output plugin instance with `local.output`.

### rootContentPath

The root directory for outputting markdown files. This is a required field.

### rootResourcePath

The root directory for outputting resources referenced in markdown files. This is a required field.

### meta

Controls the YAML metadata at the top of the markdown.

By default, the name, creation time, and modification time are output.

```md
---
name: Getting Started
created: 1702805863284
updated: 1702805863284
---

# Getting Started

## Overview
```

Return null to preserve no metadata.

```md
# Getting Started

## Overview
```

### contentPath

Controls the actual path of the content output. By default, it is calculated based on `rootContentPath` and the content's own `path`.

For example, if `rootContentPath` is _\~/code/blog/posts/_, and a content data is as follows:

```json
{
  "id": "test",
  "name": "test",
  "path": ["dev", "web", "test.md"]
}
```

The default output path would be _\~/code/blog/posts/dev/web/test.md_.

### resourcePath

Controls the actual path of the resource output. By default, it is calculated based on `rootResourcePath` and the resource's own `name`.

For example, if `rootResourcePath` is _\~/code/blog/resources/_, and a resource data is as follows:

```json
{
  "id": "test",
  "name": "test.png"
}
```

The default output path would be _\~/code/blog/resources/test.png_.

### contentLink

If there are referencing relationships between the contents, this controls how they are referenced in the markdown file after output. By default, it outputs the relative path of the markdown file.

For example, if the content _/dev/web/vscode-plugin_ references the content _/dev/tool/vscode_:

```md
[vscode](../tool/vscode.md)
```

### resourceLink

If a content references a resource, this controls how the resource is referenced in the markdown file after output. By default, it outputs the relative path of the resource file.

For example, if the markdown file output is _/posts/dev/web/vscode-plugin.md_ and references the resource _/resources/vscode.png_:

```md
![vscode](../../../resources/vscode.png)
```
