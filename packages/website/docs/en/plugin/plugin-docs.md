# plugin-docs

Output plugin that publishes a novel as a website.

## output

```yaml
tasks:
  - name: docs
    input:
      name: '@mark-magic/plugin-local'
      config:
        path: ./books/
    output:
      name: '@mark-magic/plugin-docs'
      config:
        path: ./dist/docs/
        name: 'My First Book'
```

### path

Root path of the output, usually configured as dist/docs.

### name

Name of the website, displayed in the website's title and logo.

### description

Description of the website, displayed in the website's meta tags.

### base

Root path of the output, by default `/`, generally not necessary to configure. If your website is not deployed under the root path, it can be configured as `/book/`, etc.

### public

Directory for static resources, if specified, all files in this directory will be copied to the output directory. Generally used to store files like favicon.ico.

### lang

Language of the website, default is `en-US`.

### nav

Top navigation bar, can be configured as an array, each element is an object containing `text` and `link` fields. Generally used for external links, such as GitHub or author's Twitter.

```json
[
  {
    "text": "GitHub",
    "link": "https://github.com/mark-magic/mark-magic"
  }
]
```

### logo

Logo of the website, can be configured as a string or an object containing `light` and `dark` fields, corresponding to the logo in light and dark mode.

```json
{
  "light": "./books/assets/logo-light.png",
  "dark": "./books/assets/logo-dark.png"
}
```

### gtag

Google Analytics ID, if configured, Google Analytics will be integrated into the website.

```json
{
  "gtag": "G-XXXXXXXXXX"
}
```

### sitemap

Configuration for the website's sitemap, if configured, a sitemap.xml file will be generated for the website to improve search engine crawling.

```json
{
  "hostname": "https://mark-magic.github.io/mark-magic"
}
```

### giscus

Configuration for the website's commenting system, if configured, Giscus commenting system will be integrated into the website.

```json
{
  "repo": "mark-magic/mark-magic",
  "repoId": "MDEwOlJlcG9zaXRvcnkzNjQ3MjIwNjE=",
  "category": "General",
  "categoryId": "DIC_kwDOFZTmB4d-4QFf",
  "mapping": "title",
  "reactionsEnabled": "1",
  "emitMetadata": "0",
  "inputPosition": "top",
  "theme": "light",
  "lang": "en-US",
  "crossorigin": "anonymous"
}
```

### rss

Configuration for the website's RSS, if configured, an RSS file will be generated for the website for subscriptions.

```json
{
  "hostname": "https://mark-magic.github.io/mark-magic",
  "copyright": "Copyright (c)",
  "author": [
    {
      "name": "Mark Magic",
      "email": "i@example.com"
    }
  ]
}
```

#### ignore

Configuration for files to be ignored in RSS, using glob syntax, for example, to ignore markdown files in specific directories.

```json
{
  "ignore": ["**/04/**/*.md"]
}
```
