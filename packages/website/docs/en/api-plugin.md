# Plugin API

If there isn't a suitable plugin available at the moment, you can create a plugin following the steps below. A plugin is just a regular npm package that exports functions that conform to a specific specification.

## Concepts

An input plugin reads external data and transforms it into a unified Content stream, while an output plugin transforms the Content stream into a specific output. Content is the key to data flow between plugins and abstracts the data format between them.

Content may also contain a series of Resources, which are part of the Content but not mandatory. For example, Content could be an article, while Resources are the images referenced in the article. Here is the complete type definition:

```ts
interface Data {
  /** The unique identifier of the data */
  id: string
  /** The name of the data */
  name: string
  /** Created time */
  created: number
  /** Updated time */
  updated: number
  /** Possible additional data */
  extra?: any
}

/** Anything apart from Content is considered a resource */
export interface Resource extends Data {
  /** The binary representation of the resource */
  raw: Buffer
}

/** Content file */
export interface Content extends Data {
  /** The textual content, the format is not important */
  content: string
  /** The path of the file, used to plan the directory, including the file name itself, e.g. books/01/001.md */
  path: string[]
  /** Referenced resources, duplicate resources can point to the same one */
  resources: Resource[]
}
```

## Writing Plugins

A basic plugin is a function, and one of its parameters is the `config` from the configuration file. The return value of this function is the plugin object instance, which will then be called and connected by mark-magic.

The `generate` function of an input plugin is an asynchronous iterator that returns a Content object on each iteration. The type definition is as follows:

```ts
/** Input plugin */
export interface InputPlugin {
  /** Name */
  name: string
  /** Asynchronous iterator that generates a content file stream */
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

The main function of an output plugin is `handle`, which takes a Content object and processes it. There are also two hook functions, `start` and `end`, which are called at the beginning and end of the task, respectively.

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

You can find more real-world plugin examples in the [mark-magic project](https://github.com/mark-magic/mark-magic/tree/main/packages).

## Publishing Plugins

After writing the plugin, publish it as an npm package. There are no specific requirements for the name, but it is recommended to use the format `mark-magic-plugin-xxx`, such as `mark-magic-plugin-joplin`, for easier searching in the future.
