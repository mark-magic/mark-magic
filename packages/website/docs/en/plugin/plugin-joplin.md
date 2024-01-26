# plugin-joplin

An input plugin that uses Joplin notes as a data source.

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

The address of the Joplin Web Clipper service, usually `http://localhost:41184`. You can find it under **Settings => Web Clipper**.

![joplin-webclipper](../resources/joplin-webclipper.png)

### token

The token for the Joplin Web Clipper service, copied from Joplin.

### tag

Filters notes based on tags. For example, when publishing a blog, you can configure it as `blog` to only publish notes with the `blog` tag. If set to `''`, no filtering is done and all notes are used as the data source.
