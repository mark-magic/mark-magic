# plugin-docs

An output plugin that publishes a novel as a website.

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

The root path of the output, typically configured as dist/docs.

### name

The name of the website, which will be displayed in the website's title and logo.

### description

The description of the website, which will be displayed in the website's meta tags.

### base

The root path of the output, which is `/` by default and generally doesn't need to be configured. If your website is not deployed at the root path, you can configure it as `/book/` or similar.

### public

The directory for static resources. If specified, all files in this directory will be copied to the output directory. Typically used to store favicon.ico and similar files.

### lang

The language of the website, set to `en-US` by default.

### nav

The top navigation bar, configured as an array where each element is an object with `text` and `link` fields. Typically used for external links such as GitHub or the author's Twitter.

```json
[
  {
    "text": "GitHub",
    "link": "https://github.com/mark-magic/mark-magic"
  }
]
```

### logo

The logo of the website, configured as a string or an object with `light` and `dark` fields representing the logo for light mode and dark mode, respectively.

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

Configures the sitemap for the website. If configured, a sitemap.xml file will be generated for better search engine crawling.

```json
{
  "hostname": "https://mark-magic.github.io/mark-magic"
}
```

### giscus

Configures the comment system for the website. If configured, the Giscus comment system will be integrated into the website.

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

Configures the RSS feed for the website. If configured, an RSS file will be generated for subscription.

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

Configures the files to be ignored by the RSS feed. Allows the use of glob syntax, for example, to ignore markdown files in specific directories.

```json
{
  "ignore": ["**/04/**/*.md"]
}
```
