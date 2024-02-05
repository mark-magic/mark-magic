# Configuration

Use `mark-magic.config.yaml` as the configuration file. The basic fields are explained below.

```yaml
tasks: # Define a series of tasks
  - name: blog # Name of the task
    input: # Input plugin
      name: '@mark-magic/plugin-joplin' # Name of the input plugin
      config: # Configuration of the input plugin, detailed explanation for each plugin's configuration
    transforms: # Transform plugins
      - name: '@mark-magic/plugin-doctran' # Name of the input plugin
        config: # Plugin's configuration
    output:
      name: '@mark-magic/plugin-hexo' # Name of the output plugin
      config: # Configuration of the input plugin
```

## input

Input plugin used to retrieve data from a data source, such as reading notes from Joplin or local markdown files.

### input.name

Name of the input plugin, for example, `@mark-magic/plugin-joplin`.

### input.config

Configuration of the input plugin. Detailed explanation for each plugin's configuration.

- [plugin-local](../..)
- [plugin-epub](./plugin/plugin-epub.md)
- [plugin-docs](./plugin/plugin-docs.md)
- [plugin-joplin](./plugin/plugin-joplin.md)
- [plugin-hexo](./plugin/plugin-hexo.md)

## transforms

Transform plugins, can be zero or more. Currently, there is only one translation transform plugin.

- [plugin-doctran](./plugin/plugin-doctran.md)

## output

Output plugin, configuration is similar to input plugin.

- [plugin-local](../..)
- [plugin-hexo](./plugin/plugin-hexo.md)

## Environment Variables

If there is a need to use some confidential configurations such as cookies or tokens, environment variables can be used in the `mark-magic.config.yaml` configuration file by using `${ENV_NAME}`. `@mark-magic/cli` also supports automatically reading the `.env*` from the same directory as the configuration file, where environment variables can be defined and ignored from `.gitignore`.

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

In addition to YAML configuration, you can also use `mark-magic.config.ts` as the configuration file. However, this configuration is only for those who are familiar with TypeScript and want to try using it. It is mainly used to quickly support some plugins that have not been supported yet.

For example, there is currently no VuePress plugin available, but it can be quickly implemented and used in the TypeScript configuration file.

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
