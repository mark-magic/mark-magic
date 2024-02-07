# plugin-image-fetcher

Image download conversion plugin, download images referenced in markdown to local.

## transform

For example, when downloading a novel from ao3, you can use this plugin to download the images in the novel to local.

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
