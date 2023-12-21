# Configuration

Use mark-magic.config.yaml as the configuration file. The following explains the basic fields.

```yaml
tasks: # Define a series of tasks
  - name: blog # Name of the task
    input: # Input plugin
      name: '@mark-magic/plugin-joplin' # Name of the input plugin
      config: # Configuration of the input plugin, explained below for each plugin's configuration
    output:
      name: '@mark-magic/plugin-hexo' # Name of the output plugin
      config: # Configuration of the output plugin
```

## input

Input plugin is used to read data from data sources, such as reading notes from Joplin, reading markdown files from local files, etc.

### input.name

Name of the input plugin, for example `@mark-magic/plugin-joplin`.

### input.config

Configuration of the input plugin, explained below for each plugin's configuration.

- [plugin-local](./plugin/plugin-local.md)
- [plugin-epub](./plugin/plugin-epub.md)
- [plugin-docs](./plugin/plugin-docs.md)
- [plugin-joplin](./plugin/plugin-joplin.md)
- [plugin-hexo](./plugin/plugin-hexo.md)

## output

Output plugin, similar to input plugin configuration.
