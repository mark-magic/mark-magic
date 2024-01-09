# Plugin API

If there are no suitable plugins available yet, you can create a plugin by following these steps. Plugins are just regular npm packages that export functions that conform to specific specifications.

## Concepts

An input plugin reads external data and converts it into a unified content stream, while an output plugin converts a content stream into a specific output. Content is crucial in the data flow and abstracts the data format between plugins.

![plugin-hooks](./resources/plugin-hooks.drawio.svg)

Content may also contain a series of resources, which are a part of the content but not mandatory. For example, content may be an article and a resource may be an image referenced in the article. Here is the complete type definition:

```ts
interface Data {
  /** Unique identifier for the data */
  id: string
  /** Name of the data */
  name: string
  /** Creation time */
  created: number
  /** Update time */
  updated: number
  /** Other possible data */
  extra?: any
}

/** Anything other than content is considered a resource */
export interface Resource extends Data {
  /** Binary representation of the resource */
  raw: Buffer
}

/** Content file */
export interface Content extends Data {
  /** Text content, the actual format is not really important */
  content: string
  /** Path of the file for directory planning, including the file name itself, for example books/01/001.md */
  path: string[]
  /** Referenced resources, duplicate resources can refer to the same one */
  resources: Resource[]
}
```

## Writing Plugins

A basic plugin is an npm package that exports multiple specific functions, and the three types of plugins correspond to the `input/transform/output` function names. The functions receive the `config` from the `mark-magic.config.yaml` configuration file as their parameters. During runtime, the functions are called and the corresponding configurations are passed in. Use `pnpm create @mark-magic/plugin <plugin-name>` to quickly create a plugin. More real-world examples of plugins can be found in the [mark-magic project](https://github.com/mark-magic/mark-magic/tree/main/packages).

### Input Plugins

The `generate` function of an input plugin is an async iterator that returns a Content object with each iteration. The type definition is:

```ts
/** Input Plugin */
export interface InputPlugin {
  /** Name */
  name: string
  /** Async iterator that generates the content stream */
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

The `transform` function is the main function of a transform plugin. It takes a Content object as input and must return a Content object. The Content object can be modified as necessary within the function and returned in the end. There are also two hook functions, `start` and `end`, which are called at the beginning and end of the task, respectively.

```ts
/** Transform Plugin, no input or output, only transforms the Content in the stream */
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

The `handle` function is the main function of an output plugin. It takes a Content object and processes it. There are also two hook functions, `start` and `end`, which are called at the beginning and end of the task, respectively.

```ts
/** Output Plugin */
export interface OutputPlugin {
  /** Name */
  name: string
  /** Start hook function */
  start?(): Promise<void>
  /** Handle each content and its dependent resources */
  handle(content: Content): Promise<void>
  /** End hook function */
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

## Publishing Plugins

After writing the plugin, it can be published as an npm package. There are no specific requirements for the name, but it is recommended to use the format mark-magic-plugin-xxx, for example `mark-magic-plugin-joplin`, for easier searching in the future.
