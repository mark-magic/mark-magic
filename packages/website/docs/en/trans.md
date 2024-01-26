# AI Translation

## Introduction

With the rise of LLM, the quality of AI translation has also been gradually improved. In some cases, AI translation can replace basic manual translation. Here we will introduce how to use AI translation in mark-magic.

Some known use cases are:

1.  Translating documents into English, such as the [English documentation](https://mark-magic.rxliuli.com/en/) of this project.
2.  Translating English novels, such as [Magical Girl Sadness System](https://pmas.liuli.moe), which uses GPT-4 for initial translation and human proofreading.

Let's use translating a documentation site into English as an example.

## Initialization

Create an empty directory, then initialize a package.json and a "books" directory to store the novels.

```sh
mkdir my-docs && cd my-docs
npm init -y
mkdir docs
```

Install dependencies.

```sh
npm i -D @mark-magic/cli @mark-magic/plugin-local @mark-magic/plugin-doctran
```

## Configuration

The configuration for translation uses the `@mark-magic/plugin-local` plugin for both input and output because they are both local directories. The AI translation plugin used is `@mark-magic/plugin-doctran`.

```yaml
# mark-magic.config.yaml
tasks:
  - name: trans
    input:
      name: '@mark-magic/plugin-local' # input plugin, read from a local directory
      config:
        path: ./docs/ # directory to read
        ignore: # ignored files
          - './docs/en/**'
          - './docs/.vitepress/**'
    transforms:
      - name: '@mark-magic/plugin-doctran' # translation plugin
        config:
          to: en # target language for translation
          engine: google # translation engine, currently supports google/openai
    output:
      name: '@mark-magic/plugin-local' # output plugin, also output to a local directory
      config:
        path: ./docs/en/ # output directory
```

## Start Translation

Create a file _docs/readme.md_.

```sh
echo '# Hello, world' > docs/readme.md
```

Then you can continue creating more content. Next, we will use AI translation to translate the document into English.

```ts
npx mark-magic
```

You will see the translated document in the _docs/en/readme.md_ directory.

```md
# Hello World
```

## Next Steps

If you are not satisfied with the quality of the translation, you can use human proofreading to improve the translation quality.
