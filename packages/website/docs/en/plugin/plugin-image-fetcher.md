# plugin-image-fetcher

Plugin for downloading and converting images referenced in a Markdown file to local files.

## transform

For example, when downloading novels from AO3, this plugin can be used to download the images included in the novel to local files.

```yaml
tasks:
  - name: fetch
    input:
      name: '@mark-magic/plugin-ao3'
      config:
        url: https://archiveofourown.org/works/29943597/chapters/73705791
    transform:
      name: '@mark-magic/plugin-image-fetcher'
    output:
      name: '@mark-magic/plugin-epub'
      config:
        path: './dist/A Summer of Two Months.epub'
        title: A Summer of Two Months
        creator: rundownes
```
