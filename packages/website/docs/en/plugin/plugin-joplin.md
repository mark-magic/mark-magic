# plugin-joplin

Input plugin that uses Joplin notes as a data source.

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

The address of the Joplin web clipper service, usually `http://localhost:41184`.

> Reference: [web clipper service](https://joplinapp.org/help/apps/clipper/)

### token

The token for the Joplin web clipper service, copied from Joplin.

### tag

Filter notes based on tags. For example, when publishing a blog, you can configure it to `'blog'` to only publish notes with the tag `'blog'`. If specified as `''`, no tag filtering is applied and all notes are used as data source.
