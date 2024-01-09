# plugin-hexo

Output plugin that generates markdown files for Hexo while preserving correct links between blog articles and resource references.

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

The root path for output. By default, it is the current command line path and generally does not need to be configured.

### base

The root path for output. By default, it is `/` and generally does not need to be configured. If your blog is not deployed at the root path, you can configure it as `/blog/` or similar.

For example, if your blog is deployed on GitHub Pages without a custom domain, the default published path would be `https://<username>.github.io/<repo>/`. In that case, you should configure it as `/repo/`.
