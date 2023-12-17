# plugin-hexo

输出插件，输出为 hexo 的 markdown 文件，同时保持正确的博客文章之间和对资源引用。

## output

```yaml
tasks:
  - name: test
    input:
      name: '@mark-magic/plugin-hexo'
      config:
        path: './'
        base: '/'
```

### path

输出的根路径，默认情况下为当前命令行的路径，一般不需要配置。

### base

输出的根路径，默认情况下为 `/`，一般不需要配置。如果你的博客不是部署在根路径下，可以配置为 `/blog/` 等。

例如如果你的博客部署在 GitHub Pages，不绑定域名的情况下，默认发布之后的路径是 `https://<username>.github.io/<repo>/`，那么这里就应该配置为 `/repo/`。
