# plugin-doctran

A conversion plugin that uses Google or OpenAI to translate documents or novels. It is suitable for the initial translation of light novels or fan fiction.

## transform

```yaml
tasks:
  - name: book
    input:
      name: '@mark-magic/plugin-local'
      config:
        path: './book/en-US'
    transforms:
      - name: '@mark-magic/plugin-doctran'
        config:
          - engine: 'openai'
          - to: 'zh-CN'
          - apiKey: 'xxxxxxx'
    output:
      name: '@mark-magic/plugin-local'
      config:
        rootContentPath: './book/zh-CN'
        rootResourcePath: './book/zh-CN/resources'
```

## engine

The translation engine. Currently supports Google and OpenAI. OpenAI is recommended as its translation results are more natural and fluent.

- google
- openai

## to

The target language for translation.

## apiKey

When configuring the engine to use OpenAI, you need to provide the OpenAI apiKey. You can create one yourself on the [OpenAI platform](https://platform.openai.com/api-keys).
