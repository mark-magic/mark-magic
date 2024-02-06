# plugin-epub

Output plugin that generates EPUB ebook files while maintaining correct chapter structure and resource references.

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

Path to the output file, must have a `.epub` extension.

### id

Unique identifier for the novel, used to generate a unique identifier for the EPUB file. Must consist of letters, numbers, and underscores.

### title

Title of the novel.

### creator

Author.

### publisher

Publisher, defaults to `mark-magic`.

### language

Language, defaults to `en-US`.

### cover

Cover image, can be a local path. Default is none.
