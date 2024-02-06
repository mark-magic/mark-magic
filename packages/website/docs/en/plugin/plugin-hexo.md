# plugin-hexo

Output plugin that generates Markdown files for hexo, while preserving proper cross-referencing between blog articles and resource references.

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

Root path for output. By default, it is the current command line path and generally does not need configuration.

### base

Root path for output. By default, it is `/` and generally does not need configuration. However, if your blog is not deployed at the root path, you can configure it as `/blog/` or something similar.

For example, if your blog is deployed on GitHub Pages without a custom domain, the default path after publishing will be `https://<username>.github.io/<repo>/`, in which case you should configure it as `/repo/`.
