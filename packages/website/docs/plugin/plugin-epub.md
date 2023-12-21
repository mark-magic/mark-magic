# plugin-epub

输出插件，输出为 epub 的电子书文件，同时保持正确的章节之间和对资源引用。

## output

```yaml
tasks:
  - name: book
    output:
      name: '@mark-magic/plugin-epub'
      config:
        path: ./dist/my-book.epub
        id: my-book
        title: My First Book
        creator: Mark Magic
```

### path

输出文件的路径，必须是 `.epub` 后缀。

### id

小说的唯一标识，用于生成 epub 文件的唯一标识符，必须是字母、数字、下划线组成。

### title

小说的标题。

### creator

作者。

### publisher

发布者，默认为 `mark-magic`。

### language

语言，默认为 `en-US`。

### cover

封面图片，可以是本地路径，默认不存在。
