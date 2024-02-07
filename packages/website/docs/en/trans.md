# AI Translation

## Introduction

With the rise of LLM, the quality of AI translation has gradually improved and in some cases, AI translation can replace basic human translation. Here is how to use AI translation in mark-magic.

Some known use-cases:

1. Translating documents into English, as is done with the [English documentation](https://mark-magic.rxliuli.com/en/) of this project.
2. Translating English novels, for instance, [Magical Girl Sadness System](https://pmas.liuli.moe) used GPT-4 for initial translation followed by manual proofreading.

The example below is about translating a documentation site into English.

## Initialization

Create an empty directory, then initialize a package.json and a books directory to store novels.

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

The translation configuration uses the `@mark-magic/plugin-local` plugin as both input and output are local directories. The AI translation plugin is `@mark-magic/plugin-doctran`.

```yaml
# mark-magic.config.yaml
tasks:
  - name: trans
    input:
      name: '@mark-magic/plugin-local' # Input plugin, read from local directory
      config:
        path: ./docs/ # Reading directory
        ignore: # Files to ignore
          - './docs/en/**'
          - './docs/.vitepress/**'
    transforms:
      - name: '@mark-magic/plugin-doctran' # Translation plugin
        config:
          to: en # Translation target language
          engine: google # Translation engine, currently supports google/openai
    output:
      name: '@mark-magic/plugin-local' # Output plugin, also outputs to local directory here
      config:
        path: ./docs/en/ # Output directory
```

## Start Translating

Create file _docs/readme.md_

```sh
echo '# 你好，世界' > docs/readme.md
```

You can then continue creating more. Next, we'll use AI translation to translate the document into English.

```ts
npx mark-magic
```

You can see the translated document in the _docs/en/readme.md_ directory.

```md
# Hello World
```

## Next Steps

Next, if you are not satisfied with the quality of the translation, you can improve the quality of the translation by using manual proofreading.
