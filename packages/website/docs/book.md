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

## 本地构建和测试

在本地构建完成之后，可以在本地先进行预览。

```sh
npx mark-magic
npx live-server dist/docs
```

## 设置公共基本路径

默认情况下，我们假设站点将部署在域的根路径 `/`。 如果网站将在子路径上提供服务，例如 <https://mywebsite.com/blog/>，那么需要在 _mark-magic.config.yaml_ 中设置 `plugin-docs` 插件的 `base` 选项 `'/blog/'`。

示例：如果使用 Github Pages 并部署到 `user.github.io/repo/`，然后设置 `base` 为 `/repo/`。

```yaml
# mark-magic.config.yaml
tasks:
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
        base: /repo/
```

## 平台指南

### GitHub Pages

1. 在项目的 `.github/workflows` 目录中创建一个 `deploy.yml`，其中包含以下内容。

   ```yml
   name: Deploy site to Pages

   on:
     # Runs on pushes targeting the `main` branch. Change this to `master` if you're
     # using the `master` branch as the default branch.
     push:
       branches: [main]

     # Allows you to run this workflow manually from the Actions tab
     workflow_dispatch:

   # Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
   permissions:
     contents: read
     pages: write
     id-token: write

   # Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
   # However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
   concurrency:
     group: pages
     cancel-in-progress: false

   jobs:
     # Build job
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3
           with:
             fetch-depth: 0 # Not needed if lastUpdated is not enabled
         # - uses: pnpm/action-setup@v2 # Uncomment this if you're using pnpm
         # - uses: oven-sh/setup-bun@v1 # Uncomment this if you're using Bun
         - uses: pnpm/action-setup@v2
           with:
             version: 8
         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: 20
             cache: pnpm # or pnpm / yarn
         - name: Setup Pages
           uses: actions/configure-pages@v3
         - name: Install dependencies
           run: pnpm i # or pnpm install / yarn install / bun install
         - name: Build
           run: |
             pnpm mark-magic
             touch dist/docs/.nojekyll
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v2
           with:
             path: dist/docs

     # Deployment job
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       needs: build
       runs-on: ubuntu-latest
       name: Deploy
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v2
   ```

   > 确保 plugin-docs 的 `base` 配置正确，请参阅 [设置公共基本路径](#设置公共基本路径)

2. 在存储库设置中的 **Pages** 菜单项下，选择 **Build and deployment > Source** 中的 **GitHub Actions**。
3. 将修改推送到 GitHub 等待 GitHub Actions 工作流程完成。应该可以看到站点被部署在 `https://<username>.github.io/[repository]/` 或 `https://<custom-domain>/`，具体取决于设置，你的网站将在每次推送时自动部署 main 分支。

## 下一步

- 更好的了解实际运作机制，请继续阅读 [插件](./plugin/index.md)
