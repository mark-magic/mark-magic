# AI Translation

## Introduction

With the rise of LLM, the quality of AI translation is gradually improving. In some cases, AI translation can replace preliminary human translation. Here we will introduce how to use AI translation in mark-magic.

Some known use cases:

1. Translate documents into English, like the [English document](https://mark-magic.rxliuli.com/en/) of this project.
2. Translate English novels, for example, [The Sad System of Magical Girl](https://pmas.liuli.moe) uses GPT-4 for preliminary translation + human proofreading.

Next, we will use the translation of the document site into English as an example.

## Initialization

Create an empty directory, then initialize a package.json and a “books” directory to store novels.

```sh
mkdir my-docs && cd my-docs
npm init -y
mkdir docs
```

Install dependencies

```sh
npm i -D @mark-magic/cli @mark-magic/plugin-local @mark-magic/plugin-doctran
```

## Configuration

Since the input and output of translation configuration are both local directories, the `@mark-magic/plugin-local` plugin is used. The AI translation plugin is `@mark-magic/plugin-doctran`.

```yaml
# mark-magic.config.yaml
tasks:
  - name: trans
    input:
      name: '@mark-magic/plugin-local' # Input plugin, read from the local directory
      config:
        path: ./docs/ # Read directory
        ignore: # Ignore files
          - './docs/en/**'
          - './docs/.vitepress/**'
    transforms:
      - name: '@mark-magic/plugin-doctran' # Translation plugin
        config:
          to: en # Target language for translation
          engine: google # Translation engine, currently supports google/openai
    output:
      name: '@mark-magic/plugin-local' # Output plugin, which outputs to the local directory
      config:
        path: ./docs/en/ # Output directory
```

## Start Translating

Create file _docs/readme.md_

```sh
echo '# Hello, world' > docs/readme.md
```

Then you can continue to create more, the AI translation will be used next to translate the document into English.

```ts
npx mark-magic
```

You can see the translated document in the _docs/en/readme.md_ directory.

```md
# Hello World
```

## Next Step

Next, if you are not satisfied with the quality of the translation, you can use human proofreading to improve the quality of the translation.
