# plugin-epub

An output plugin that generates an EPUB ebook file while preserving correct chapter divisions and resource references.

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

## path

The path of the output file, which must have the `.epub` extension.

## id

The unique identifier of the novel, used to generate a unique identifier for the EPUB file. It must consist of letters, numbers, and underscores.

## title

The title of the novel.

## creator

The author.

## publisher

The publisher, defaulting to "mark-magic".

## language

The language, defaulting to "en-US".

## cover

The cover image, which can be a local path and is non-existent by default.
