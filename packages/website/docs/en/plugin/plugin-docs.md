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

Root path of the output. It is usually configured as dist/docs.

### name

Name of the website, which will be displayed in the website's title and logo.

### description

Description of the website, which will be displayed in the website's meta tags.

### base

Root path of the output, which is `/` by default and generally does not need to be configured. If your website is not deployed at the root path, you can configure it as `/book/` or similar.

### public

Directory for static resources. If specified, all files in this directory will be copied to the output directory. It is typically used to store favicon.ico and other files.

### lang

Language of the website, defaulting to `en-US`.

### nav

Top navigation bar, which can be configured as an array where each element is an object containing `text` and `link` fields. It is commonly used to include external links such as GitHub or the author's Twitter profile.

```json
[
  {
    "text": "GitHub",
    "link": "https://github.com/mark-magic/mark-magic"
  }
]
```

### logo

Logo of the website, which can be configured as a string or an object containing `light` and `dark` fields for the light and dark modes, respectively.

```json
{
  "light": "./books/assets/logo-light.png",
  "dark": "./books/assets/logo-dark.png"
}
```

### gtag

Google Analytics ID. If configured, it will integrate Google Analytics into the website.

```json
{
  "gtag": "G-XXXXXXXXXX"
}
```

### sitemap

Configuration for the website's sitemap. If configured, it will generate a sitemap.xml file for better search engine crawling.

```json
{
  "hostname": "https://mark-magic.github.io/mark-magic"
}
```

### giscus

Configuration for the website's commenting system. If configured, it will integrate the Giscus commenting system into the website.

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

Configuration for the website's RSS feed. If configured, it will generate an RSS file for subscriptions.

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

Configuration for files to ignore in the RSS feed. Allows the use of glob syntax, for example, to ignore markdown files in specific directories.

```json
{
  "ignore": ["**/04/**/*.md"]
}
```
