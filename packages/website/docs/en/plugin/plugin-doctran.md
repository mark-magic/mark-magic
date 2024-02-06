# plugin-doctran

A conversion plugin that uses Google or OpenAI to translate documents or novels. It is suitable for first translations when attempting to translate light novels or fan novels, and can be followed by proofreading to speed up the process.

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

Translation engines currently supported include Google and OpenAI. OpenAI is recommended as its translation results are more natural and fluent.

- google
- openai

### to(google)

The target language for translation, which needs to be specified for all translation engines.

## google

Only the `to` configuration option is required, no other configuration is needed.

## openai

### apiKey

The OpenAI apiKey needs to be configured and can be created on the [openai platform](https://platform.openai.com/api-keys).
