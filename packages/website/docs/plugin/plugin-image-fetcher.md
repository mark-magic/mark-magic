# plugin-image-fetcher

图片下载转换插件，将 markdown 中引用的图片下载到本地。

## transform

例如，在下载 ao3 的小说时，可以使用插件将小说中的图片也下载到本地。

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
