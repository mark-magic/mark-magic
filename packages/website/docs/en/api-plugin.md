# Plugin API

If there are currently no suitable plugins, you can create a plugin by following these steps. A plugin is just a regular npm package that exports functions that adhere to specific specifications.

## Concepts

An input plugin reads external data and converts it into a unified Content stream, while an output plugin converts a Content stream into a specific output. Content is a key component in the flow of data between plugins, and it abstracts the data format between plugins.

![plugin-hooks](./resources/plugin-hooks.drawio.svg)

Content may also include a series of Resources, which are part of Content but not mandatory. For example, Content could be an article and Resources could be images referenced in the article. Here is the complete type definition:

```ts
interface Data {
  /** Unique identifier for the data */
  id: string
  /** Name of the data */
  name: string
  /** Creation timestamp */
  created: number
  /** Update timestamp */
  updated: number
  /** Optional additional data */
  extra?: any
}

/** Anything other than content is considered a resource */
export interface Resource extends Data {
  /** Binary representation of the resource */
  raw: Buffer
}

/** Content file */
export interface Content extends Data {
  /** Text content, actual format is not important */
  content: string
  /** File path for directory planning, including the file name itself, e.g., books/01/001.md */
  path: string[]
  /** Referenced resources, duplicate resources can point to the same one */
  resources: Resource[]
}
```

## Writing Plugins

A basic plugin is an npm package that exports multiple functions corresponding to `input/transform/output` in the `mark-magic.config.yaml` configuration file. These functions receive the corresponding configuration when called during runtime.
Use `pnpm create @mark-magic/plugin <plugin-name>` to quickly create a plugin. You can find more real-life plugin examples in the [mark-magic project](https://github.com/mark-magic/mark-magic/tree/main/packages).

### Input Plugins

The `generate` function of an input plugin is an asynchronous iterator that returns a Content object for each iteration. The type definition is:

```ts
/** Input plugin */
export interface InputPlugin {
  /** Name */
  name: string
  /** Asynchronous iterator that generates Content stream */
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

The main function of a transform plugin is `transform`, which receives a Content object and must return a Content object. You can modify the Content object arbitrarily within the function and return it in the end. There are also two hook functions, `start` and `end`, which are called at the beginning and end of the task, respectively.

```ts
/** Transform plugin, does not take input or output, only performs transformations on Content in the stream */
export interface TransformPlugin {
  name: string
  start?(): Promise<void>
  /** Transformation function */
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

The main function of an output plugin is `handle`, which receives a Content object and processes it. There are also two hook functions, `start` and `end`, which are called at the beginning and end of the task, respectively.

```ts
/** Output plugin */
export interface OutputPlugin {
  /** Name */
  name: string
  /** Start hook function */
  start?(): Promise<void>
  /** Process each content and its dependent resources */
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

Once the plugin is written, you can publish it as an npm package. There are no specific naming requirements, but it is recommended to use the format mark-magic-plugin-xxx, for example `mark-magic-plugin-joplin`, for easier future reference.
