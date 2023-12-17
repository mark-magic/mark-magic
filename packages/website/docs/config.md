# 配置

使用 mark-magic.config.yaml 作为配置文件，下面对基础字段加以说明

```yaml
tasks: # 定义一系列任务
  - name: blog # 任务的名字
    input: # 输入插件
      name: '@mark-magic/plugin-joplin' # 输入插件的名字
      config: # 输入插件的配置，下面对每个插件的配置详加说明
    output:
      name: '@mark-magic/plugin-hexo' # 输出插件的名字
      config: # 输入插件的配置
```

## input

输入插件，用来从数据源中读取数据，例如从 joplin 中读取笔记，从本地文件中读取 markdown 文件等。

### input.name

输入插件的名字，例如 `@mark-magic/plugin-joplin`。

### input.config

输入插件的配置，下面对每个插件的配置详加说明。

- [plugin-local](./plugin/plugin-local.md)
- [plugin-epub](./plugin/plugin-epub.md)
- [plugin-docs](./plugin/plugin-docs.md)
- [plugin-joplin](./plugin/plugin-joplin.md)
- [plugin-hexo](./plugin/plugin-hexo.md)

## output

输出插件，配置与输入插件类似。
