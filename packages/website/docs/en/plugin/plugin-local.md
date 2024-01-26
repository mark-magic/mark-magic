# plugin-local

A plugin that can be used as both an input and an output. For example, it can read markdown files locally and generate websites or EPUBs, or download content from websites to the local system.

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

Recursively scans all the markdown files and their referenced resource files in this path.

```sh
.
├─ books
│  ├─ 01.md
│  ├─ 02.md
│  └─ readme.md
└─ package.json
```

For example, the above directory will be scanned, regardless of the depth of the hierarchy.

```sh
books/01.md
books/02.md
books/readme.md
```

### ignore(input)

Ignored files, supports glob syntax.

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

The root directory to output markdown files, required.

## Usage as a Library

It is very useful for scenarios that require output to local markdown files. For example, when outputting to hexo/hugo/vitepress/jekyll, it is easier to configure based on the output of the local plugin rather than writing a plugin from scratch. The plugin [@mark-magic/plugin-hexo](./plugin-hexo.md) is implemented in this way, and it only uses about 30 lines of code.

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

Complete type definition:

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

Controls the YAML metadata at the top of the markdown.

By default, it outputs the name, creation time, and modification time.

```md
---
name: Getting Started
created: 1702805863284
updated: 1702805863284
---

# Getting Started

## Overview
```

Return null to remove all metadata.

```md
# Getting Started

## Overview
```

### contentPath

Controls the actual output path of the content. By default, it is calculated based on the `path` and the content's own `path`.

For example, if the `path` is _\~/code/blog/posts/_ and a content data is as follows:

```json
{
  "id": "test",
  "name": "test",
  "path": ["dev", "web", "test.md"]
}
```

The default output path is _\~/code/blog/posts/dev/web/test.md_.

### resourcePath

Controls the actual output path of the resource. By default, it is calculated based on the `path` and the resource's `name`.

For example, if the `path` is _\~/code/blog/_ and a resource data is as follows:

```json
{
  "id": "test",
  "name": "test.png"
}
```

The default output path is _\~/code/blog/resources/test.png_.

### contentLink

Controls how the markdown file after output references other content. By default, it outputs the relative path of the markdown file.

For example, if a content _/dev/web/vscode-plugin_ references a content _/dev/tool/vscode_:

```md
[vscode](../tool/vscode.md)
```

### resourceLink

Controls how the markdown file after output references resources. By default, it outputs the relative path of the resource file.

For example, if the markdown file output is _/posts/dev/web/vscode-plugin.md_ and it references a resource _/resources/vscode.png_:

```md
![vscode](../../../resources/vscode.png)
```
