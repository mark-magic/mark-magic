# plugin-hexo

An output plugin that exports to hexo's markdown files, while maintaining the correct links between blog posts and references to resources.

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

The root path of the output, by default it is the current command line path, usually no configuration is needed.

### base

The root path of the output, by default is `/`, usually no configuration is needed. If your blog is not deployed at the root path, it can be configured to `/blog/`, etc.

For example, if your blog is deployed on GitHub Pages, and it is not bound to a domain, the default path after publishing is `https://<username>.github.io/<repo>/`, so here it should be configured to `/repo/`.
