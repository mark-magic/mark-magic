# 使用插件

## 介绍

mark-magic 的基础是建立在插件系统之上的，允许通过安装不同的插件来扩展工具的功能。目前已经支持的几个输入插件有 local/joplin，输出插件包括 docs/epub/hexo/local。

目前提供了三类插件，输入插件、转换插件和输出插件，输入插件用来从数据源中读取数据，转换插件用于对内容或资源做一些处理，但并不关心输入和输出，输出插件用来将数据输出特定目标。

## 安装与配置

想使用一个插件，必须先安装插件，然后在配置文件中配置。例如，想要使用本地文件作为输入，生成一个小说网站，可以按照以下步骤进行。

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

## 创建插件

如果目前还没有，可以在 [github issue](https://github.com/mark-magic/mark-magic/issues) 中提出，或按照 [创建插件](../api-plugin.md) 中的说明开发新的插件。
