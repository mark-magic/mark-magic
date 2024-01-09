# plugin-epub

An output plugin that generates e-book files in the EPUB format while preserving the correct chapter structure and resource references.

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

The path of the output file, must have the `.epub` extension.

### id

The unique identifier of the novel, used to generate a unique identifier for the EPUB file. Must consist of letters, numbers, and underscores.

### title

The title of the novel.

### creator

The author.

### publisher

The publisher, default is `mark-magic`.

### language

The language, default is `en-US`.

### cover

The cover image, can be a local path. Default not provided.
