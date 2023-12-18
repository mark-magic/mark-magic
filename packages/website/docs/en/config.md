# Configuration

Use mark-magic.config.yaml as the configuration file. The following describes the basic fields.

```yaml
tasks: # Define a series of tasks
  - name: blog # Name of the task
    input: # Input plugin
      name: '@mark-magic/plugin-joplin' # Name of the input plugin
      config: # Configuration for the input plugin
    output:
      name: '@mark-magic/plugin-hexo' # Name of the output plugin
      config: # Configuration for the output plugin
```

## input

The input plugin is used to read data from data sources, such as reading notes from Joplin or reading markdown files from local storage.

### input.name

Name of the input plugin, for example `@mark-magic/plugin-joplin`.

### input.config

Configuration for the input plugin. Detailed explanations for each plugin configuration are provided below.

- [plugin-local](./plugin/plugin-local.md)
- [plugin-epub](./plugin/plugin-epub.md)
- [plugin-docs](./plugin/plugin-docs.md)
- [plugin-joplin](./plugin/plugin-joplin.md)
- [plugin-hexo](./plugin/plugin-hexo.md)

## output

The output plugin, which has a similar configuration to the input plugin.
