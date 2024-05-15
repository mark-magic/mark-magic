# plugin-doctran

转换插件，通过 google 或 openai 来翻译文档或小说，适合尝试翻译轻小说或同人小说时的初翻，后续加以校对以加快速度。

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

翻译引擎，目前支持 google 和 openai，推荐使用 openai，它的翻译结果更加自然通顺。

- google
- openai

### to(google)

翻译目标语言，所有翻译引擎都需要指定。

## google

只有配置项 `to`，不需要其他任何配置项。

## openai

### apiKey

需要配置 openai 的 apiKey，需要自行在 [openai platform](https://platform.openai.com/api-keys) 创建。
