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

The root path for the output, usually set to dist/docs.

### name

The name of the website, which will be displayed in the website's title and logo.

### description

The description of the website, which will be displayed in the website's meta tags.

### base

The root path for the output, which is `/` by default and generally doesn't need to be configured. If your website is not deployed at the root path, you can configure it as `/book/` or similar.

### public

The directory for static resources. If specified, all files in this directory will be copied to the output directory. This is usually used to store files like favicon.ico.

### lang

The language of the website, defaulting to `en-US`.

### nav

The top navigation bar, which can be configured as an array with each element being an object containing `text` and `link` fields. This is usually used to include external links such as GitHub or author's Twitter.

```json
[
  {
    "text": "GitHub",
    "link": "https://github.com/mark-magic/mark-magic"
  }
]
```

### logo

The logo of the website, which can be configured as a string or an object with `light` and `dark` fields, representing the logo in light and dark mode respectively.

```json
{
  "light": "./books/assets/logo-light.png",
  "dark": "./books/assets/logo-dark.png"
}
```

### gtag

The ID for Google Analytics. If configured, Google Analytics will be integrated into the website.

```json
{
  "gtag": "G-XXXXXXXXXX"
}
```

### sitemap

Configures the sitemap for the website. If configured, a sitemap.xml file will be generated for the website to improve search engine crawling.

```json
{
  "hostname": "https://mark-magic.github.io/mark-magic"
}
```

### giscus

Configures the commenting system for the website. If configured, Giscus comment system will be integrated into the website.

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

Configures the RSS feed for the website. If configured, an RSS file will be generated for the website for subscription.

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

Configures the files to be ignored by RSS, allowing the use of glob syntax. For example, ignore markdown files in a specific directory.

```json
{
  "ignore": ["**/04/**/*.md"]
}
```
