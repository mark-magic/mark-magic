# Configuration

Use `mark-magic.config.yaml` as the configuration file. The base fields are explained below.

```yaml
tasks: # Defines a series of tasks
  - name: blog # Name of the task
    input: # Input plugin
      name: '@mark-magic/plugin-joplin' # Name of the input plugin
      config: # Configuration for the input plugin. Detailed explanation for each plugin's configuration is below.
    transforms: # Transform plugins, can be 0 or more
      - name: '@mark-magic/plugin-doctran' # Name of the transform plugin
        config: # Configuration for the plugin
    output:
      name: '@mark-magic/plugin-hexo' # Name of the output plugin
      config: # Configuration for the output plugin
```

## input

The input plugin is used to read data from a data source, such as retrieving notes from Joplin, reading markdown files from the local file system, etc.

### input.name

The name of the input plugin, for example `@mark-magic/plugin-joplin`.

### input.config

The configuration for the input plugin. Detailed explanation for each plugin's configuration is below.

- [plugin-local](./plugin/plugin-local.md#input)
- [plugin-epub](./plugin/plugin-epub.md)
- [plugin-docs](./plugin/plugin-docs.md)
- [plugin-joplin](./plugin/plugin-joplin.md)
- [plugin-hexo](./plugin/plugin-hexo.md)

## transforms

The transform plugins, can be 0 or more.

- [plugin-doctran](./plugin/plugin-doctran.md)
- [plugin-image-download](./plugin/plugin-image-download.md)

## output

The output plugin, with similar configuration as the input plugin.

- [plugin-local](./plugin/plugin-local.md#output)
- [plugin-hexo](./plugin/plugin-hexo.md)

## Environment Variables

If there is a need to use confidential configurations such as cookies or tokens, environment variables can be used in the `mark-magic.config.yaml` configuration file using the `${ENV_NAME}` syntax. Additionally, `@mark-magic/cli` is capable of automatically reading the `.env*` files in the same directory as the configuration file, allowing the definition of environment variables while ignoring them in `.gitignore`.

For example, when using the `@mark-magic/plugin-joplin` plugin:

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

## TypeScript Configuration File

In addition to using a YAML configuration, it is also possible to use `mark-magic.config.ts` as the configuration file. However, this configuration is mainly for TypeScript users who wish to experiment, as it provides a way to quickly support plugins that are not yet supported. For example, there is currently no VuePress plugin, but it can be quickly implemented and used in a TypeScript configuration file.

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
