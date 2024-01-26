# Configuration

Use mark-magic.config.yaml as the configuration file. The following describes the basic fields:

```yaml
tasks: # Define a series of tasks
  - name: blog # Task name
    input: # Input plugin
      name: '@mark-magic/plugin-joplin' # Input plugin name
      config: # Input plugin configuration, detailed explanations for each plugin configuration below
    output:
      name: '@mark-magic/plugin-hexo' # Output plugin name
      config: # Output plugin configuration
```

## input

Input plugin used to read data from data sources, such as reading notes from Joplin or reading markdown files from local.

### input.name

Name of the input plugin, for example `@mark-magic/plugin-joplin`.

### input.config

Input plugin configuration, detailed explanations for each plugin configuration below.

- [plugin-local](./plugin/plugin-local.md)
- [plugin-epub](./plugin/plugin-epub.md)
- [plugin-docs](./plugin/plugin-docs.md)
- [plugin-joplin](./plugin/plugin-joplin.md)
- [plugin-hexo](./plugin/plugin-hexo.md)

## output

Output plugin, similar configuration to the input plugin.
