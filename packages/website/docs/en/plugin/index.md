# Using Plugins

## Introduction

The foundation of mark-magic is built upon a plugin system, which allows you to extend the functionality of the tool by installing different plugins. Currently, there are several supported input plugins like local/joplin, and output plugins including docs/epub/hexo/local.

There are two categories of plugins available: input plugins and output plugins. Input plugins are used to retrieve data from a data source, while output plugins are used to output data to specific destinations.

- Input Plugins
  - [plugin-local](./plugin-local.md)
  - [plugin-joplin](./plugin-joplin.md)
- Output Plugins
  - [plugin-docs](./plugin-docs.md)
  - [plugin-epub](./plugin-epub.md)
  - [plugin-hexo](./plugin-hexo.md)
  - [plugin-local](./plugin-local.md)

## Installation and Configuration

To use a plugin, you must first install the plugin and then configure it in the configuration file. For example, if you want to use local files as input to generate a novel website, you can follow these steps.

```sh
npm i -D @mark-magic/plugin-local @mark-magic/plugin-docs
```

```yaml
# mark-magic.config.yaml
tasks:
  - name: local
    input:
      name: '@mark-magic/plugin-local'
      config:
        path: ./books/
    output:
      name: '@mark-magic/plugin-docs'
      config:
        path: ./dist/docs/
        name: 'My First Book'
```

## Creating Plugins

If there isn't a plugin available yet, you can submit a request on the [GitHub issue](https://github.com/mark-magic/mark-magic/issues) page or follow the instructions in [Creating Plugins](../api-plugin.md) to develop a new plugin.
