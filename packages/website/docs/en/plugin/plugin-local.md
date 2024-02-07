# plugin-local

A plugin that can act as both input and output. For example, reading local markdown and generating websites or epubs, or downloading content from the website to local.

## input

```yaml
tasks:
  - name: test
    input:
      name: '@mark-magic/plugin-local'
      config:
        path: './book/'
```

### path(input)

Recursively scan all markdown files and their referenced resource files under this path.

```sh
.
├─ books
│  ├─ 01.md
│  ├─ 02.md
│  └─ readme.md
└─ package.json
```

For example, the above directory will be scanned, regardless of how deep the hierarchy is.

```sh
books/01.md
books/02.md
books/readme.md
```

### ignore(input)

The ignored files, support glob syntax.

## output

```yaml
tasks:
  - name: test
    output:
      name: '@mark-magic/plugin-local'
      config:
        path: './book/en-US/'
```

### path(output)

The root directory for the output markdown file, required item.

## Use as a library

Very useful for scenarios that need to output as local markdown files, such as output during hexo/hugo/vitepress/jekyll, no need to write plugins from scratch, but it's simpler to configure based on the output of the local plugin. The plugin [@mark-magic/plugin-hexo](./plugin-hexo.md) is implemented in this way, and it even only used 30+ lines of code.

```ts
import { OutputPlugin } from '@mark-magic/core'
import path from 'path'
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
    path: postsPath,
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

Complete type definition

```ts
export interface OutputOptions {
  path: string
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

You can control all aspects of output when creating output plugin instances with `local.output`.

### meta

Controls the yaml metadata at the top of markdown, by default, no metadata will be added.

```md
# Getting Started

## Overview
```

Returns null and does not keep any metadata.

```md
# Getting Started

## Overview
```

### contentPath

Controls the actual output path of the content, by default, it is calculated based on `path` and the content's own `path`.

For example, the `path` is _\~/code/blog/posts/_, a content data is as follows:

```json
{
  "id": "test",
  "name": "test",
  "path": ["dev", "web", "test.md"]
}
```

Then, the default output path is _\~/code/blog/posts/dev/web/test.md_.

### resourcePath

Controls the actual output path of the resource, by default, it is calculated based on `path` and the resource's own `name`.

For example, the `path` is _\~/code/blog/_, a resource data is as follows:

```json
{
  "id": "test",
  "name": "test.png"
}
```

Then, the default output path is _\~/code/blog/resources/test.png_.

### contentLink

If there is a reference relationship between the content, control how to reference in the markdown file after output, the default is the relative path of the output markdown file.

For example, the content _/dev/web/vscode-plugin_ refers to the content _/dev/tool/vscode_

```md
[vscode](../tool/vscode.md)
```

### resourceLink

If the content references a resource, control how to reference in the markdown file after output, the default is the relative path of the output resource file.

For example, the output markdown file is _/posts/dev/web/vscode-plugin.md_ referring to the resource _/resources/vscode.png_

```md
![vscode](../../../resources/vscode.png)
```
