# plugin-docs

Output plugin, publishing a novel as a website.

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

The root path for output, typically configured as dist/docs.

### name

The name of the website, which will be displayed on the site's title and logo.

### description

The description of the site, which will be displayed on the site's meta tags.

### base

The root path for output, default is `/`, generally no need to configure. If your website is not deployed at the root path, you could configure it as `/book/`, etc.

### public

The directory for static resources. If designated, all files within this directory will be copied to the output directory. It is usually used to store files like favicon.ico and others.

### lang

The language of the website, default is `en-US`.

### nav

Top navigation bar, which can be configured as an array, each element is an object containing `text` and `link` fields. It is usually used to place some external links, such as GitHub or the author's Twitter, etc.

```json
[
  {
    "text": "GitHub",
    "link": "https://github.com/mark-magic/mark-magic"
  }
]
```

### logo

The website's logo, which can be configured as a string, or as an object containing `light` and `dark` fields, corresponding to the daytime mode and night mode logos respectively.

```json
{
  "light": "./books/assets/logo-light.png",
  "dark": "./books/assets/logo-dark.png"
}
```

### gtag

Google Analytics ID, if this field is configured, Google Analytics will be integrated into the site.

```json
{
  "gtag": "G-XXXXXXXXXX"
}
```

### sitemap

Configure the site's sitemap, if this field is configured, a sitemap.xml file will be generated for the site to better facilitate search engine crawls.

```json
{
  "hostname": "https://mark-magic.github.io/mark-magic"
}
```

### giscus

Configure the site's comment system, if this field is configured, the Giscus comment system will be integrated into the site.

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

Configure the site's RSS, if this field is configured, an RSS file will be generated for the site so it can be subscribed to.

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

Configure files to be ignored by RSS, allowing the usage of glob syntax, for example, to ignore markdown files in a specific directory.

```json
{
  "ignore": ["**/04/**/*.md"]
}
```
