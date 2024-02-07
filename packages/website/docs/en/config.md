# Configuration

Use `mark-magic.config.yaml` as the configuration file, the following will explain the basic fields

```yaml
tasks: # Define a series of tasks
  - name: blog # The name of the task
    input: # Input plugin
      name: '@mark-magic/plugin-joplin' # The name of the input plugin
      config: # Configuration of the input plugin, detailed explanation for each plugin configuration below
    transforms: # Transformation plugins
      - name: '@mark-magic/plugin-doctran' # The name of the input plugin
        config: # Configuration of the plugin
    output:
      name: '@mark-magic/plugin-hexo' # The name of the output plugin
      config: # Configuration of the input plugin
```

## input

Input plugin is used to read data from the data source, such as reading notes from joplin, reading markdown files from local files, etc.

### input.name

The name of the input plugin, for example, `@mark-magic/plugin-joplin`.

### input.config

The configuration of the input plugin, the following will provide a detailed explanation for each plugin configuration.

- [plugin-local](./plugin/plugin-local.md)
- [plugin-epub](./plugin/plugin-epub.md)
- [plugin-docs](./plugin/plugin-docs.md)
- [plugin-joplin](./plugin/plugin-joplin.md)
- [plugin-hexo](./plugin/plugin-hexo.md)

## transforms

Transformation plugins can be 0 to multiple.

- [plugin-doctran](./plugin/plugin-doctran.md)
- [plugin-image-fetcher](./plugin/plugin-image-fetcher.md)

## output

Output plugin, the configuration is similar to the input plugin.

- [plugin-local](./plugin/plugin-local.md)
- [plugin-hexo](./plugin/plugin-hexo.md)

## Environment Variables

If you need to use some confidential configurations, such as cookies or tokens, you can use the `${ENV_NAME}` format to use environment variables in the `mark-magic.config.yaml` configuration file. At the same time, `@mark-magic/cli` also supports automatically reading `.env*` configurations in the same directory of the configuration file. You can define environment variables in it and ignore them from `.gitignore`.

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

## TypeScript Configuration File

In addition to the yaml configuration, you can also use `mark-magic.config.ts` as the configuration file, but this configuration is only for those who understand TypeScript to try, mainly to quickly support some unsupported plugins.
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
