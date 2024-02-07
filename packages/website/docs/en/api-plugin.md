# Plugin API

If there is currently no suitable plugin available, you can follow the steps below to create one. A plugin is just a regular npm package but exports functions that conform to specific standards.

## Concepts

The input plugin reads external data and converts it into a unified Content stream, and the output plugin converts the Content stream into specific outputs. The content is the key to data flow conversion, abstracting the data format between plugins.

![plugin-hooks](./resources/plugin-hooks.drawio.svg)

Content may also contain a series of Resources. They are part of the Content but not necessary. For example, Content could be an article, and the Resource could be the images referred to in the article. The following is the complete type definition:

```ts
interface Data {
  /** Unique identifier of the data */
  id: string
  /** Name of the data */
  name: string
  /** Creation time */
  created: number
  /** Updated time */
  updated: number
  /** Other possible data */
  extra?: any
}

/** Everything other than content is viewed as a resource */
export interface Resource extends Data {
  /** Binary representation of the resource */
  raw: Buffer
}

/** Content files */
export interface Content extends Data {
  /** Text content, doesn't really care about the format */
  content: string
  /** The path of the file, used to plan the directory, including the filename itself, such as books/01/001.md */
  path: string[]
  /** Referenced resources, repeated resources can point to the same one */
  resources: Resource[]
}
```

## Writing a Plugin

A basic plugin is an npm package that exports several specific functions. The three types of plugins correspond to the `input/transform/output` function names respectively. The parameters of these functions are set using the `config` in the plugin configuration file `mark-magic.config.yaml` and during actual runtime, these functions are called with the corresponding configuration passed in.
You can use `pnpm create @mark-magic/plugin <plugin-name>` to quickly create a plugin. You can see more real plugin examples in the [mark-magic project](https://github.com/mark-magic/mark-magic/tree/main/packages).

### Input Plugins

The input plugin's generate function is an async iterator, each iteration returns a Content object. The type definition is:

```ts
/** Input plugin */
export interface InputPlugin {
  /** Name */
  name: string
  /** Async iterator, generating content stream */
  generate(): AsyncGenerator<Content>
}
```

Basic example:

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

### Transform Plugins

The main function of the transform plugin is `transform`. It accepts a Content object and must return a Content object. You can arbitrarily modify Content inside the function and then return it. There are also two hook functions, `start` and `end`, which are called at the beginning and end of the task respectively.

```ts
/** Transform plugin, no input or output, just doing some conversion on the Content in the flow */
export interface TransformPlugin {
  name: string
  start?(): Promise<void>
  /** Transform function */
  transform(content: Content): Promise<Content>
  end?(): Promise<void>
}
```

Basic example:

```ts
// src/index.ts
import { OutputPlugin } from '@mark-magic/core'

export function transform(options: {}): OutputPlugin {
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

### Output Plugins

The main function of the output plugin is `handle`. It accepts a Content object and deals with it in its way. There are also two hook functions, `start` and `end`, which are called at the beginning and end of the task respectively.

```ts
/** Output plugin */
export interface OutputPlugin {
  /** Name */
  name: string
  /** Hook function at the end */
  start?(): Promise<void>
  /** Handles each content and its dependent resources */
  handle(content: Content): Promise<void>
  /** Hook function at the end */
  end?(): Promise<void>
}
```

Basic example:

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

## Publishing a Plugin

After writing a plugin, you just need to publish it as an npm package. There is no special requirement for the name, but it is recommended to use the format mark-magic-plugin-xxx, such as `mark-magic-plugin-joplin`, to facilitate later search.
