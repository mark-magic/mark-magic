# plugin-docs

输出插件，将一本小说发布为网站。

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

输出的根路径，一般配置为 dist/docs。

### name

网站的名字，会显示在网站的标题和 logo 上。

### description

网站的描述，会显示在网站的 meta 标签上。

### base

输出的根路径，默认情况下为 `/`，一般不需要配置。如果你的网站不是部署在根路径下，可以配置为 `/book/` 等。

### public

静态资源目录，如果指定，所有该目录下的文件会复制到输出目录下。一般用来存储一些 favicon.ico 等文件。

### lang

网站的语言，默认为 `en-US`。

### nav

顶部导航栏，可以配置为一个数组，每个元素都是一个对象，包含 `text` 和 `link` 字段。一般用来放一些外部链接，例如 GitHub 或者作者 Twitter 等。

```json
[
  {
    "text": "GitHub",
    "link": "https://github.com/mark-magic/mark-magic"
  }
]
```

### logo

网站的 logo，可以配置为一个字符串，也可以配置为一个对象，包含 `light` 和 `dark` 字段，分别对应白天模式和夜间模式下的 logo。

```json
{
  "light": "./books/assets/logo-light.png",
  "dark": "./books/assets/logo-dark.png"
}
```

### gtag

Google Analytics 的 ID，如果配置了该字段，会在网站中集成 Google Analytics。

```json
{
  "gtag": "G-XXXXXXXXXX"
}
```

### sitemap

配置网站的 sitemap，如果配置了该字段，会为网站生成 sitemap.xml 文件，以便搜索引擎更好的抓取。

```json
{
  "hostname": "https://mark-magic.github.io/mark-magic"
}
```

### giscus

配置网站的评论系统，如果配置了该字段，会在网站中集成 Giscus 评论系统。

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

配置网站的 RSS，如果配置了该字段，会为网站生成 RSS 文件，以便订阅。

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

配置 RSS 忽略的文件，允许使用 glob 语法，例如忽略特定目录下的 markdown 文件。

```json
{
  "ignore": ["**/04/**/*.md"]
}
```
