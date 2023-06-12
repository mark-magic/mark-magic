# mark-magic

## 简介

一个基于 markdown 的生成工具，可以将 markdown 转换为其他格式，例如 blob、docs、epub、pdf 等，主要是为了在同一框架下处理 markdown 生成需要的一切，并且支持从不同的数据源导入和同步。

## 为什么不使用现有的工具

吾辈现在已经使用了许多工具用来处理不同的任务，但它们都是基于 markdown 的，例如

- 使用 joplin 记录笔记
- 使用 mami(自行实现) 导出笔记为 markdown 到 hexo 需要的格式
- 使用 hexo 生成 blog
- 使用 mdbook(自行实现) 生成 epub
- 使用 docusaurus 生成 seo 更友好的小说网站
- 使用 vuepress 生成内部 docs 网站
- 使用 vscode-pdf 插件从 markdown 生成 pdf 文档用于分享

真正让吾辈感到痛苦的是使用 docusaurus 时，每个项目都需要配置一堆东西，这非常烦人，所以希望有更好的可以开箱即用处理所有常用功能的工具。
另一件事是分层，似乎分层的工具很少见，即能满足普通用户的直接开箱即用的使用，也能支持高级用户的定制化，这个需求似乎很常见，以至于有人为 hexo 开发了 hexo-admin 之类的 GUI 界面。

## MVP

提供一个 cli 从命令行生成 epub/docs，支持有限的配置。例如

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/rxliuli/mark-magic/main/schema/mark-magic.schema.json
# mark-magic.yml
generate:
  - name: book-01
    input:
      - type: local
        path: ./books/01/
    output:
      - type: epub
        path: ./dist/epub/01.epub
  - name: book-02
    input:
      - type: local
        path: ./books/02/
    output:
      - type: epub
        path: ./dist/epub/02.epub
  - name: docs
    input:
      - type: local
        path: ./books/
    output:
      - type: docs
        path: ./dist/docs/
        sidebar:
          - title: 量子纠缠
            children:
              - title: 第一卷-量子纠缠
                path: ./books/01/readme.md
              - title: 一个愿望
                path: ./books/01/001.md
          - title: 第二卷-宇宙膨胀
            children:
              - title: 量子纠缠
                path: ./books/02/readme.md
              - title: 一个愿望
                path: ./books/02/001.md
```

- 输入
  - 从 markdown 本地目录
- 输出
  - 生成 epub
  - 生成 docs

## 快速的 idea

- md => output: 将 markdown 转换为其他格式
  - blog
  - docs
  - epub
  - epub
  - pdf
  - text?
- using: 提供分层次的工具
  - dev
    - code lib
    - cli
    - ci/cd
    - plugin
  - user
    - desktop
    - online => paid plan
- config: 提供不同的配置
  - preset theme: 选择不同的主题（网站）
    - minual + tailwind
    - light + dark
  - sync data: markdown 数据源
    - local dir
    - notion
    - obsidian
    - joplin
  - deploy web: 部署 web 站点
    - github pages/cloudflare pages/custom/?
  - release epub/pdf/txt: 发布非 web 版本
    - github release/custom/?
  - domain => paid plan?
  - edit ?
- framework: 采用框架
  - ssg / ssr => first ssg
  - preact / astro / ?

## 同类工具

- RMarkdown: 使用 haskell 实现，看起来很古老
- mweb: 使用 swift 实现 mac 版本，但并不是跨平台的，也不开源 -- 不是很好用，epub 的目录不能手动调节和配置
