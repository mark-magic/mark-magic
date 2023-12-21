# plugin-hexo

An output plugin that generates markdown files for Hexo, while preserving correct links between blog articles and referencing resources.

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

The root path of the output. By default, it is set to the current command line path and generally does not require any configuration.

### base

The root path of the output. By default, it is set to `/` and generally does not require any configuration. If your blog is not deployed in the root path, you can configure it as `/blog/`, for example.

For instance, if your blog is deployed on GitHub Pages without a custom domain, the default published path would be `https://<username>.github.io/<repo>/`. In this case, you should configure it as `/repo/`.
