# plugin-hexo

An output plugin that generates markdown files for Hexo while preserving correct links between blog posts and resource referencing.

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

The root path for output. By default, it is set to the current command line path and generally does not need to be configured.

### base

The base path for output. By default, it is set to `/` and generally does not need to be configured. If your blog is not deployed at the root path, you can configure it as `/blog/` or similar.

For example, if your blog is deployed on GitHub Pages without a custom domain, the default URL after publishing would be `https://<username>.github.io/<repo>/`. In that case, you should configure the base path as `/repo/`.
