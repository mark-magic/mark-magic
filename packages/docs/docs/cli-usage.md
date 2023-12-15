# 使用 CLI

## 安装

> 假设你已经安装了 [nodejs](https://nodejs.org) 和 [pnpm](https://pnpm.io)

```bash
pnpm i -D @mark-magic/cli @mark-magic/plugin-docs @mark-magic/plugin-epub @mark-magic/plugin-local live-server
```

## 配置

> 如果使用 VSCode，建议安装 [vscode-yaml 扩展](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) 以获得更好的配置体验

```yaml
# yaml-language-server: $schema=./node_modules/@mark-magic/cli/dist/config.schema.json

generate:
  - name: docs
    input:
      name: '@mark-magic/plugin-local'
      config:
        path: ./docs
    output:
      name: '@mark-magic/plugin-docs'
      config:
        path: ./dist/docs
        name: Hello World
  - name: epub
    input:
      name: '@mark-magic/plugin-local'
      config:
        path: ./docs
    output:
      name: '@mark-magic/plugin-epub'
      config:
        path: ./dist/epub/hello-world.epub
        metadata:
          id: hello-world
          title: Hello World
          creator: rxliuli
          publisher: rxliuli
          language: zh-CN
```

## 编写 readme.md

```sh
echo '# Hello World' > docs/readme.md
```

## 生成

```sh
pnpm mark-magic
```

你可以在 dist/docs 下找到生成的文档网站的静态资源，在 dist/epub/ 下看到生成好的 epub 文件。

## 预览

你可以预览生成的网站

```sh
pnpm live-server dist/docs
```
