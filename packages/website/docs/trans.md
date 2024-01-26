# AI 翻译

## 介绍

由于 LLM 的兴起，AI 翻译的质量也逐渐提高，在一些场合下，AI 翻译已经可以替代初级的人工翻译。这里将介绍如何在 mark-magic 中使用 AI 翻译。

一些已知的用例：

1. 翻译文档为英文，这个项目的 [英文文档](https://mark-magic.rxliuli.com/en/) 就是如此。
2. 翻译英文小说，例如 [魔法少女悲伤系统](https://pmas.liuli.moe) 就是使用 GPT-4 初翻 + 人工校对。

下面将翻译文档站点为英文作为例子。

## 初始化

创建一个空目录，然后初始化一个 package.json 和 books 目录用来存放小说

```sh
mkdir my-docs && cd my-docs
npm init -y
mkdir docs
```

安装依赖

```sh
npm i -D @mark-magic/cli @mark-magic/plugin-local @mark-magic/plugin-doctran
```

## 配置

翻译的配置由于输入和输出都是本地目录，所以都使用 `@mark-magic/plugin-local` 插件。而 AI 翻译的插件是 `@mark-magic/plugin-doctran`。

```yaml
# mark-magic.config.yaml
tasks:
  - name: trans
    input:
      name: '@mark-magic/plugin-local' # 输入插件，从本地目录读取
      config:
        path: ./docs/ # 读取的目录
        ignore: # 忽略的文件
          - './docs/en/**'
          - './docs/.vitepress/**'
    transforms:
      - name: '@mark-magic/plugin-doctran' # 翻译插件
        config:
          to: en # 翻译目标语言
          engine: google # 翻译引擎，目前支持 google/openai
    output:
      name: '@mark-magic/plugin-local' # 输出插件，这里同样也输出到本地目录
      config:
        path: ./docs/en/ # 输出的目录
```

## 开始翻译

创建文件 _docs/readme.md_

```sh
echo '# 你好，世界' > docs/readme.md
```

然后可以继续创作更多，接下来将使用 AI 翻译将文档翻译为英文。

```ts
npx mark-magic
```

会在 _docs/en/readme.md_ 目录看到翻译好的文档。

```md
# Hello World
```

## 下一步

接下来，如果你对翻译的质量不满意，可以使用人工校对的方式来提高翻译的质量。
