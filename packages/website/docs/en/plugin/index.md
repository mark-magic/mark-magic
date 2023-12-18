# Using Plugins

## Introduction

mark-magic is built on a plugin system, allowing you to extend the functionality of the tool by installing different plugins. Currently, several input plugins are supported, including local/joplin, and output plugins include docs/epub/hexo/local.

There are currently two types of plugins available: input plugins and output plugins. Input plugins are used to read data from a data source, and output plugins are used to output data to a specific destination.

- Input plugins
  - [plugin-local](./plugin-local.md)
  - [plugin-joplin](./plugin-joplin.md)
- Output plugins
  - [plugin-docs](./plugin-docs.md)
  - [plugin-epub](./plugin-epub.md)
  - [plugin-hexo](./plugin-hexo.md)
  - [plugin-local](./plugin-local.md)

## Installation and Configuration

To use a plugin, you must first install it and then configure it in the configuration file. For example, if you want to use local files as input and generate a novel website, you can follow these steps.

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

## Creating a Plugin

If there is currently no plugin available for your needs, you can submit a request in the [github issue](https://github.com/mark-magic/mark-magic/issues), or follow the instructions in [Creating a Plugin](../api-plugin.md) to develop a new plugin.
