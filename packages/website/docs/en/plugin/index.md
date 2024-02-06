# Using Plugins

## Introduction

mark-magic is built on top of a plugin system, allowing you to extend the functionality of the tool by installing different plugins. Currently, there are several supported input plugins, including local/joplin, and output plugins include docs/epub/hexo/local.

There are three types of plugins available: input plugins, transform plugins, and output plugins. Input plugins are used to read data from a data source, transform plugins are used to process content or resources without caring about input or output, and output plugins are used to output data to specific destinations.

## Installation and Configuration

To use a plugin, you must first install the plugin and then configure it in the configuration file. For example, to use a local file as input and generate a novel website, follow these steps:

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

If there is no existing plugin available, you can submit a request in the [github issue](https://github.com/mark-magic/mark-magic/issues), or follow the instructions in [Creating Plugins](../api-plugin.md) to develop a new plugin.
