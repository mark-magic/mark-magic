# plugin-doctran

A conversion plugin that translates documents or novels using Google or OpenAI, suitable for initial translations when translating light novels or fan fiction, with subsequent proofreading to speed up the process.

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

The translation engine, currently supporting Google and OpenAI, it is recommended to use OpenAI as its translation results are more natural and fluent.

- google
- openai

### to(google)

The target language for translation, which needs to be specified for all translation engines.

## google

Only the `to` configuration item is required, no other configuration items are needed.

## openai

### apiKey

The OpenAI API key needs to be configured, which needs to be created on the [OpenAI Platform](https://platform.openai.com/api-keys) manually.
