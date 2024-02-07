# plugin-epub

This is an output plugin, it outputs as epub eBook files, while maintaining the correct references between chapters and to resources.

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

The path of the output file, it must have a `.epub` suffix.

### id

The unique identifier of the novel, used to generate a unique identifier for the epub file, it must consist of letters, numbers, and underscores.

### title

The title of the novel.

### creator

The author.

### publisher

The publisher, it defaults to `mark-magic`.

### language

The language, it defaults to `en-US`.

### cover

The cover image, it can be a local path, it doesn't exist by default.
