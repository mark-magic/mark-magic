# plugin-local

A plugin that can be used as both input and output. For example, it can read local Markdown files and generate websites or ebooks, or download content from websites to the local machine.

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

Recursively scan all Markdown files and their referenced resource files in this path.

```sh
.
├─ books
│  ├─ 01.md
│  ├─ 02.md
│  └─ readme.md
└─ package.json
```

For example, the above directory will be scanned and the following files will be obtained, regardless of the depth of the hierarchy.

```sh
books/01.md
books/02.md
books/readme.md
```

### ignore(input)

Ignored files, supporting glob syntax.

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

The root directory for outputting Markdown files, required.

## Using as a library

It is very useful for scenarios that need to output local Markdown files. For example, when outputting hexo/hugo/vitepress/jekyll, there is no need to write plugins from scratch. It is simpler to configure based on the output of the local plugin. The plugin [@mark-magic/plugin-hexo](./plugin-hexo.md) is implemented like this, and it only uses about 30 lines of code.

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

You can control all aspects of the output when creating an output plugin instance using `local.output`.

### meta

Controls the YAML metadata at the top of the Markdown file. By default, no metadata will be added.

```md
# Getting Started

## Overview
```

Return null to not keep any metadata.

```md
# Getting Started

## Overview
```

### contentPath

Controls the path where the content is actually output. By default, it is calculated based on the `path` and the content's own `path`.

For example, if the `path` is _\~/code/blog/posts/_ and a content data is as follows:

```json
{
  "id": "test",
  "name": "test",
  "path": ["dev", "web", "test.md"]
}
```

Then the default output path is _\~/code/blog/posts/dev/web/test.md_.

### resourcePath

Controls the path where the resource is actually output. By default, it is calculated based on the `path` and the resource's `name`.

For example, if the `path` is _\~/code/blog/_ and a resource data is as follows:

```json
{
  "id": "test",
  "name": "test.png"
}
```

Then the default output path is _\~/code/blog/resources/test.png_.

### contentLink

Controls how to reference other content files in the output Markdown file. By default, it uses the relative path of the output Markdown file.

For example, if the content _/dev/web/vscode-plugin_ references the content _/dev/tool/vscode_:

```md
[vscode](../tool/vscode.md)
```

### resourceLink

Controls how to reference resources in the output Markdown file. By default, it uses the relative path of the output resource file.

For example, if the output Markdown file is _/posts/dev/web/vscode-plugin.md_ and it references the resource _/resources/vscode.png_:

```md
![vscode](../../../resources/vscode.png)
```
