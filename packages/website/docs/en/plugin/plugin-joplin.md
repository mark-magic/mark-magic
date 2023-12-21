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

The address of the Joplin Web Clipper service, which is usually `http://localhost:41184`. You can find it in **Settings => Web Clipper**.

![joplin-webclipper](../resources/joplin-webclipper.png)

### token

The token for the Joplin Web Clipper service, copied from Joplin.

### tag

Filters notes based on a tag. For example, when publishing a blog, you can configure it as `blog` to only publish notes with the `blog` tag. If specified as `''`, no filtering will be done and all notes will be used as the data source.
