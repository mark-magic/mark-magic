# plugin-hexo

Output plugin that generates Hexo markdown files while maintaining correct references between blog articles and resources.

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

Root path of the output. By default, it is the current command line path and generally does not need to be configured.

### base

Root path of the output. By default, it is `/` and generally does not need to be configured. If your blog is not deployed in the root path, you can configure it as `/blog/`, etc.

For example, if your blog is deployed on GitHub Pages without a custom domain, the default published path is `https://<username>.github.io/<repo>/`, so you should configure it as `/repo/`.
