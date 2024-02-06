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

The address of the Joplin web clipper service, usually `http://localhost:41184`. You can find it in **Settings => Web Clipper**.

![joplin-webclipper](../resources/joplin-webclipper.png)

### token

The token for the Joplin web clipper service, copied from Joplin.

### tag

Filter notes by tag. For example, when publishing a blog, it can be configured as `blog` to only publish notes with the `blog` tag. If set to `''`, no filtering will be done and all notes will be used as a data source.
