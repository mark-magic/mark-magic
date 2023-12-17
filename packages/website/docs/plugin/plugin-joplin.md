# plugin-joplin

输入插件，将 Joplin 笔记作为数据源。

## input

```yaml
# mark-magic.config.yaml
tasks:
  - name: blog
    input:
      name: '@mark-magic/plugin-joplin'
      config:
        baseUrl: 'http://localhost:41184'
        token: ''
        tag: blog
```

### baseUrl

joplin web clipper service 的地址，一般是 `http://localhost:41184`。

> 参考 [web clipper service](https://joplinapp.org/help/apps/clipper/)

### token

joplin web clipper service 的 token，从 joplin 中复制。

### tag

根据标签过滤笔记。例如发布博客时，可以配置为 `blog`，只发布标签为 `blog` 的笔记。如果指定为 `''`，则不过滤标签，会将所有笔记都作为数据源。
