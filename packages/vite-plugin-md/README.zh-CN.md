# @liuli-util/vite-plugin-md

## 介绍

在代码中 import markdown 文件，就像它是一个普通的 js 文件一样。

## 安装

```bash
pnpm i -D @liuli-util/vite-plugin-md
```

配置

```ts
import { defineConfig } from 'vite'
import { markdown } from '@liuli-util/vite-plugin-md'

export default defineConfig({
  plugins: [markdown({ mode: 'react' })],
})
```

## 使用

### html

```ts
import HTML from './README.md'

console.log(HTML)
```

类型

```ts
// vite-env.d.ts
declare module '*.md' {
  const content: string
  export default content
}
```

### react

使用组件

```tsx
import React from 'react'
import ReactComponent from './README.md'

const App = () => <ReactComponent />
```

类型

```ts
// vite-env.d.ts
declare module '*.md' {
  import { FC } from 'react'
  const component: FC
  export default component
}
```

### vue

使用组件

```vue
<script lang="ts" setup>
import VueComponent from './README.md'
</script>
<template>
  <VueComponent />
</template>
```

类型

```ts
// vite-env.d.ts
declare module '*.md' {
  import { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}
```

## 为什么不使用现有插件

- [@mdx-js/rollup](https://www.npmjs.com/package/@mdx-js/rollup): 绑定 react，不可接受的
- [vite-plugin-md](https://www.npmjs.com/package/vite-plugin-md): 绑定 vue，不可接受的
- [vite-plugin-markdown](https://www.npmjs.com/package/vite-plugin-markdown): 基于 markdown-it 而非 mdast，不可接受的

另外，它们都不能正确处理引用的本地文件。例如

```md
![image](./image.png)
```
