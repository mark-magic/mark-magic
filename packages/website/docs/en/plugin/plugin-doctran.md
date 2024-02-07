# plugin-doctran

A transformation plugin that translates documents or novels using Google or OpenAI. It is intended for preliminary translation of light novels or fan fiction, to be subsequently proofread to speed up the process.

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

The translation engine currently supports Google and OpenAI, with OpenAI recommended due to its more natural and fluid translation results.

- google
- openai

### to (google)

Target language for translation, which must be specified in all translation engines.

## google

Only the `to` configuration item is needed, no other configuration items are required.

## openai

### apiKey

You need to configure the OpenAI's apiKey, which you have to create yourself on the [openai platform](https://platform.openai.com/api-keys).
