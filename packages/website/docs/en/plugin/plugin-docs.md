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

Root path of the output, typically configured as dist/docs.

### name

Name of the website, displayed in the website's title and logo.

### description

Description of the website, displayed in the website's meta tags.

### base

Root path of the output, defaults to `/`. Generally not required to configure. If your website is not deployed under the root path, you can configure it as `/book/`, etc.

### public

Directory for static resources. If specified, all files in this directory will be copied to the output directory. Typically used to store favicon.ico and other files.

### lang

Language of the website, defaults to `en-US`.

### nav

Top navigation bar, can be configured as an array where each element is an object containing `text` and `link` fields. Generally used to add external links such as GitHub or author's Twitter.

```json
[
  {
    "text": "GitHub",
    "link": "https://github.com/mark-magic/mark-magic"
  }
]
```

### logo

Logo of the website, can be configured as a string or an object containing `light` and `dark` fields, representing the logo in light mode and dark mode respectively.

```json
{
  "light": "./books/assets/logo-light.png",
  "dark": "./books/assets/logo-dark.png"
}
```

### gtag

ID of Google Analytics. If configured, Google Analytics will be integrated into the website.

```json
{
  "gtag": "G-XXXXXXXXXX"
}
```

### sitemap

Configuration for the website's sitemap. If configured, a sitemap.xml file will be generated for better search engine crawling.

```json
{
  "hostname": "https://mark-magic.github.io/mark-magic"
}
```

### giscus

Configuration for the website's comment system. If configured, Giscus comment system will be integrated into the website.

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

Configuration for the website's RSS. If configured, an RSS file will be generated for subscription.

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

Configuration for files to ignore in the RSS feed, allowing the use of glob syntax. For example, ignore markdown files in specific directories.

```json
{
  "ignore": ["**/04/**/*.md"]
}
```
