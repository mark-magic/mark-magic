# mdast-util-cjk-space-clean

## 介绍

清理 markdown 中粗体和斜体两侧多余的空格。例如

```md
**真，** 她
```

默认情况下会被渲染为

```html
<p><strong>真，</strong> 她</p>
```

期望渲染的结果是

```html
<p><strong>真，</strong>她</p>
```

由于 markdown 规范对东亚字符支持的问题，导致 `**真，**她` 会错误渲染为 `<p>**真，**她</p>`，参考 GitHub 上的 [相关 issue](https://github.com/commonmark/commonmark-spec/issues/650)

兼容的所有用例参考 <https://github.com/mark-magic/mark-magic/blob/main/packages/mdast-util-cjk-space-clean/src/utils.ts>

## 使用

```sh
pnpm i mdast-util-cjk-space-clean
```

作为 mdast-util-from-markdown 的插件使用

```ts
import { fromMarkdown } from 'mdast-util-from-markdown'
import { cjk } from 'mdast-util-cjk-space-clean'

fromMarkdown('**真，** 她', null, {
  mdastExtensions: [cjk()],
})
```
