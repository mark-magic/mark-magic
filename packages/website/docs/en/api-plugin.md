# Plugin API

If there is currently no suitable plugin, you can create one by following these steps. Plugins are just regular npm packages that export functions that comply with specific specifications.

## Concepts

Input plugins read external data and convert it into a unified Content stream, while output plugins convert the Content stream into a specific output. Content is crucial in the flow of data between plugins; it abstracts the data format between plugins.

![plugin-hooks](./resources/plugin-hooks.drawio.svg)

Content may also include a series of Resources, which are part of the Content but not mandatory. For example, the Content may be an article and the Resources may be images referenced in the article. Here is the complete type definition:

```ts
interface Data {
  /** Unique identifier of the data */
  id: string
  /** Name of the data */
  name: string
  /** Creation time */
  created: number
  /** Update time */
  updated: number
  /** Possible additional data */
  extra?: any
}

/** Anything other than content is considered a resource */
export interface Resource extends Data {
  /** Binary representation of the resource */
  raw: Buffer
}

/** Content file */
export interface Content extends Data {
  /** Text content, the format itself is not important */
  content: string
  /** File path used for directory planning, including the filename itself, e.g. books/01/001.md */
  path: string[]
  /** Referenced resources, duplicate resources can point to the same one */
  resources: Resource[]
}
```

## Writing Plugins

A basic plugin is an npm package that exports multiple functions, with each function corresponding to one of the `input/transform/output` operations. The functions receive the configuration from the `mark-magic.config.yaml` file using the `config` parameter and are invoked with the appropriate configuration during runtime. You can quickly create a plugin using `pnpm create @mark-magic/plugin <plugin-name>`. You can find more real-life plugin examples in the [mark-magic project](https://github.com/mark-magic/mark-magic/tree/main/packages).

### Input Plugins

The `generate` function of an input plugin is an asynchronous iterator that returns a Content object with each iteration. Here is the type definition:

```ts
/** Input plugin */
export interface InputPlugin {
  /** Name */
  name: string
  /** Asynchronous iterator that generates the content file stream */
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

The main function of a transform plugin is the `transform` function. It takes a Content object as input and must return a Content object. You can make any modifications to the Content object within the function and return the modified object. There are also two hook functions, `start` and `end`, which are called at the beginning and end of the operation, respectively.

```ts
/** Transform plugin, performs transformations on Content in the stream without input or output */
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

The main function of an output plugin is the `handle` function. It takes a Content object as input and processes it accordingly. There are also two hook functions, `start` and `end`, which are called at the beginning and end of the operation, respectively.

```ts
/** Output plugin */
export interface OutputPlugin {
  /** Name */
  name: string
  /** Start hook function */
  start?(): Promise<void>
  /** Handles each piece of content and its dependent resources */
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

Once you have finished writing a plugin, you can publish it as an npm package. There are no specific naming requirements, but it is recommended to use the format mark-magic-plugin-xxx. For example, `mark-magic-plugin-joplin` would be a good name, making it easier to find in the future.
