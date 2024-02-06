# AI Translation

## Introduction

With the rise of LLM, the quality of AI translation has also improved. In some cases, AI translation can replace basic human translation. Here, we will introduce how to use AI translation in mark-magic.

Some known use cases include:

1.  Translating documents into English, like the [English documentation](https://mark-magic.rxliuli.com/en/) for this project.
2.  Translating English novels, such as [Sadness System of Magical Girls](https://pmas.liuli.moe), which uses GPT-4 for initial translation and manual proofreading.

Below is an example of translating a documentation site into English.

## Initialization

Create an empty directory and then initialize a package.json and books directory for storing novels.

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

The configuration for translation uses the `@mark-magic/plugin-local` plugin for both input and output because the input and output are both local directories. The plugin for AI translation is `@mark-magic/plugin-doctran`.

```yaml
# mark-magic.config.yaml
tasks:
  - name: trans
    input:
      name: '@mark-magic/plugin-local' # Input plugin, reads from local directory
      config:
        path: ./docs/ # Directory to read from
        ignore: # Ignored files
          - './docs/en/**'
          - './docs/.vitepress/**'
    transforms:
      - name: '@mark-magic/plugin-doctran' # Translation plugin
        config:
          to: en # Target language for translation
          engine: google # Translation engine, currently supports google/openai
    output:
      name: '@mark-magic/plugin-local' # Output plugin, also outputs to local directory
      config:
        path: ./docs/en/ # Directory to output to
```

## Start Translation

Create a file _docs/readme.md_.

```sh
echo '# Hello, world' > docs/readme.md
```

You can continue to create more content. Next, we will use AI translation to translate the document into English.

```ts
npx mark-magic
```

You will see the translated document in the _docs/en/readme.md_ directory.

```md
# Hello World
```

## Next Steps

Next, if you are not satisfied with the quality of the translation, you can use manual proofreading to improve the translation quality.
