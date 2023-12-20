# 小说 => 网站 + EPUB

## 必要条件

1. 已经安装了 [nodejs](https://nodejs.org) 最新的 lts 版本
2. 已经安装了 [git](https://git-scm.com/) 最新的版本
3. 用以通过命令行界面访问 mark-magic 的终端
4. 支持 markdown 和 yaml 的文本编辑器，推荐 [vscode](https://code.visualstudio.com/)

## 初始化小说项目

1. 创建一个空目录，然后初始化一个 package.json 和 books 目录用来存放小说

   ```sh
   mkdir my-book && cd my-book
   npm init -y
   mkdir books
   ```

2. 安装依赖

   ```sh
   npm i -D @mark-magic/cli @mark-magic/plugin-docs @mark-magic/plugin-epub live-server
   ```

## 配置小说

添加配置文件 `mark-magic.config.yaml`，输入都是本地的 books 目录，输出分别配置为 epub/docs。

```yaml
# mark-magic.config.yaml
tasks:
  - name: epub
    input:
      name: '@mark-magic/plugin-local' # 输入插件，从本地目录读取
      config:
        path: ./books/ # 读取的目录
    output:
      name: '@mark-magic/plugin-epub' # 输出插件，生成 epub 文件
      config:
        path: ./dist/my-book.epub # 生成路径
        id: my-book # 小说的唯一 id
        title: My First Book # 小说的名字
        creator: Mark Magic # 创作者
  - name: docs
    input:
      name: '@mark-magic/plugin-local' # 同上
      config:
        path: ./books/
    output:
      name: '@mark-magic/plugin-docs' # 同上
      config:
        path: ./dist/docs/ # 输出的目录
        name: 'My First Book' # 小说的名字
```

## 开始写作

从小说的首页开始，在 books 目录下创建 readme.md 作为首页。

```md
# Hello World
```

然后可以继续创作更多，为了保持顺序，建议文件名使用 01,02,03... 这样的前缀。

文件结构

```sh
.
├─ books
│  ├─ 01.md
│  ├─ 02.md
│  └─ readme.md
└─ package.json
```

## 运行构建

现在，可以开始构建了。

```sh
npx mark-magic
```

完成后你可以在 dist 下看到 epub 文件和构建好的 html 文件。使用 live-server 来预览它。

```sh
npx live-server dist/docs
```

> 示例项目可以在 <https://github.com/mark-magic/book-demo> 看到。

## 下一步是什么？

- 如果你想要立刻部署到线上，请务必阅读 [部署指南](./deploy.md)
- 更好的了解实际运作机制，请继续阅读 [插件](./plugin/index.md)
