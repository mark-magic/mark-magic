# plugin-doctran

A conversion plugin that uses Google or OpenAI to translate documents or novels. Suitable for first-time translations of light novels or fan fiction.

## transform

```yaml
tasks:
  - name: translate
    input:
      name: '@mark-magic/plugin-local'
      config:
        path: './docs'
        ignore:
          - './docs/en/**'
    transforms:
      - name: '@mark-magic/plugin-doctran'
        config:
          engine: 'openai'
          to: 'en'
          apiKey: 'sk-xxxxxx'
    output:
      name: '@mark-magic/plugin-local'
      config:
        path: './docs/en'
```

## engine

Translation engine. Currently supports Google and OpenAI. OpenAI is recommended because its translation results are more natural and fluent.

- google
- openai

## to

Target language for translation.

## apiKey

When the engine is set to 'openai', you need to configure the OpenAI API key. You need to create one yourself on the [OpenAI platform](https://platform.openai.com/api-keys).
