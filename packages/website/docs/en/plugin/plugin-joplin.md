# plugin-joplin

Input plugin, using Joplin notes as a data source.

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

The address of joplin webclipper service, usually `http://localhost:41184`, can be seen in **Settings => Web Clipper**.

![joplin-webclipper](../resources/joplin-webclipper.png)

### token

The token of joplin webclipper service, copied from joplin.

### tag

Filter notes by tags. For example, when publishing a blog, it can be configured as `blog`, only notes with the `blog` tag are published. If set to `''`, no filtering is performed, and all notes are used as data sources.
