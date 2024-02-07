# Using Plugins

## Introduction

The basis of mark-magic relies on a plugin system that allows for an extended tool functionality by installing different plugins. Currently, several supported input plugins include local/joplin, and output plugins include docs/epub/hexo/local.

There are three types of plugins provided: input plugins, transformation plugins, and output plugins. Input plugins are used to read data from data sources, transformation plugins are used to process content or resources (not concerning input and output), and output plugins are used to output data to specific targets.

## Installation and Configuration

To use a plugin, you must first install the plugin, then configure it in the configuration file. For example, if you want to use a local file as input and create a novel website, you can follow the steps below.

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

If there aren't any available currently, you can raise an issue in [github issue](https://github.com/mark-magic/mark-magic/issues) or follow the instructions in [creating plugins](../api-plugin.md) to develop new plugins.
