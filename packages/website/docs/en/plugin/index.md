# Using Plugins

## Introduction

mark-magic is built on top of a plugin system, allowing you to extend the functionality of the tool by installing different plugins. Currently, there are several supported input plugins, such as local/joplin, and output plugins including docs/epub/hexo/local.

There are two types of plugins available: input plugins and output plugins. Input plugins are used to read data from the data source, while output plugins are used to output data to specific targets.

- Input plugins
  - [plugin-local](./plugin-local.md)
  - [plugin-joplin](./plugin-joplin.md)
- Output plugins
  - [plugin-docs](./plugin-docs.md)
  - [plugin-epub](./plugin-epub.md)
  - [plugin-hexo](./plugin-hexo.md)
  - [plugin-local](./plugin-local.md)

## Installation and Configuration

To use a plugin, you need to install it and then configure it in the configuration file. For example, if you want to use local files as input to generate a novel website, you can follow these steps:

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

If there are currently no available plugins, you can either submit an issue on [GitHub](https://github.com/mark-magic/mark-magic/issues) or follow the instructions in [Creating Plugins](../api-plugin.md) to develop a new plugin.
