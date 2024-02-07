# Configuration

Use `mark-magic.config.yaml` as the configuration file, with the basic fields explained below

```yaml
tasks: # Define a series of tasks
  - name: blog # The name of the task
    input: # Input plugin
      name: '@mark-magic/plugin-joplin' # The name of the input plugin
      config: # The configuration of the input plugin, explained in detail for each plugin below
    transforms: # Transformation plugins
      - name: '@mark-magic/plugin-doctran' # The name of the transformation plugin
        config: # The configuration of the plugin
    output:
      name: '@mark-magic/plugin-hexo' # The name of the output plugin
      config: # The configuration of the output plugin
```

## input

The input plugin is used to read data from the data source, such as reading notes from Joplin, reading markdown files from local files, etc.

### input.name

The name of the input plugin, such as `@mark-magic/plugin-joplin`.

### input.config

The configuration of the input plugin, explained in detail for each plugin below.

- [plugin-local](./plugin/plugin-local.md#input)
- [plugin-epub](./plugin/plugin-epub.md)
- [plugin-docs](./plugin/plugin-docs.md)
- [plugin-joplin](./plugin/plugin-joplin.md)
- [plugin-hexo](./plugin/plugin-hexo.md)

## transforms

Transformation plugins, there can be 0 to many.

- [plugin-doctran](./plugin/plugin-doctran.md)
- [plugin-image-fetcher](./plugin/plugin-image-fetcher.md)

## output

The output plugin, which has a similar configuration to the input plugin.

- [plugin-local](./plugin/plugin-local.md#output)
- [plugin-hexo](./plugin/plugin-hexo.md)

## Environment Variables

If you need to use some secret configurations, such as cookies or tokens, you can use the `${ENV_NAME}` format in the `mark-magic.config.yaml` configuration file to use environment variables. The `@mark-magic/cli` also supports automatically reading `.env*` configurations in the same directory as the configuration file, where you can define environment variables and ignore them in .gitignore.

For example, when using the `@mark-magic/plugin-joplin` plugin

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

## TypeScript Configuration file

In addition to yaml configuration, you can also use `mark-magic.config.ts` as a configuration file, but this configuration is only for TypeScript users to try, mainly to quickly support some unsupported plugins.
For example, there is currently no vuepress plugin, but it can be quickly implemented and used in the TypeScript configuration file.

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
