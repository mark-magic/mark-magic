# @mark-magic/plugin-docs

## 0.17.0

### Minor Changes

- feat: 支持全文搜索功能

## 0.16.0

### Minor Changes

- feat: 修复 task list 未能正确渲染的错误

## 0.15.0

### Minor Changes

- Support generate twitter meta

## 0.14.0

### Patch Changes

- Updated dependencies
  - @mark-magic/plugin-local@0.14.0

## 0.13.0

### Minor Changes

- fix: 修复中文 markdown 渲染时粗体和斜体两侧多余空格未清理的错误

### Patch Changes

- Updated dependencies
  - markdown-it-cjk-space-clean@0.2.0

## 0.12.2

### Patch Changes

- fix: 自动根据 logo 配置 favicon

## 0.12.0

### Minor Changes

- chore: update npm publish files config

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.12.0
  - @mark-magic/plugin-local@0.12.0
  - @mark-magic/utils@0.12.0

## 0.11.2

### Patch Changes

- fix(plugin-docs): 先取消 vitepress 的死链检查
- Updated dependencies
  - @mark-magic/core@0.11.2
  - @mark-magic/plugin-local@0.11.2
  - @mark-magic/utils@0.11.2

## 0.11.0

### Minor Changes

- fix: 使用 vitepress 渲染时需要配置 markdown: { breaks: true } 避免 commonmark 奇葩的软换行
- fix: 修复替换配置为字符串时可能包含无法使用 JSON.parse 的字符
- feat: 构建之后删除临时文件
- test: 修改测试默认超时时间
- feat(core): 支持错误时抛出错误到上层并且允许手动中断

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.11.0
  - @mark-magic/plugin-local@0.11.0
  - @mark-magic/utils@0.11.0

## 0.10.0

### Patch Changes

- Updated dependencies
  - @mark-magic/plugin-local@0.10.0
  - @mark-magic/core@0.10.0
  - @mark-magic/utils@0.10.0

## 0.9.4

### Patch Changes

- fix: 修复生成的 rss 中的图片链接不是绝对路径的错误
- fix: 修复生成的 rss 会有灵宽度字符 &ZeroWidthSpace; 的问题
- @mark-magic/core@0.9.4
- @mark-magic/utils@0.9.4
- @mark-magic/plugin-local@0.9.4

## 0.9.3

### Patch Changes

- @mark-magic/core@0.9.3
- @mark-magic/utils@0.9.3
- @mark-magic/plugin-local@0.9.3

## 0.9.2

### Patch Changes

- Updated dependencies
  - @mark-magic/plugin-local@0.9.2
  - @mark-magic/core@0.9.2
  - @mark-magic/utils@0.9.2

## 0.9.1

### Patch Changes

- fix: 修改 giscus 的必填项配置
- Updated dependencies
  - @mark-magic/plugin-local@0.9.1
  - @mark-magic/core@0.9.1
  - @mark-magic/utils@0.9.1

## 0.9.0

### Patch Changes

- @mark-magic/core@0.9.0
- @mark-magic/utils@0.9.0
- @mark-magic/plugin-local@0.9.0

## 0.8.0

### Minor Changes

- chore: 统一版本

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.8.0
  - @mark-magic/plugin-local@0.8.0
  - @mark-magic/utils@0.8.0

## 0.6.0

### Minor Changes

- feat: 将一些字段设置为非必填项，例如 language/base 等

## 0.5.0

### Minor Changes

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.3.0
  - @mark-magic/plugin-local@0.7.0
  - @mark-magic/utils@0.4.0

## 0.4.3

### Patch Changes

- fix: 修复 local 插件写入资源文件时没有正确处理同名资源的问题
- Updated dependencies
  - @mark-magic/plugin-local@0.6.1

## 0.4.2

### Patch Changes

- fix: 修复 description 没有正确设置的错误

## 0.4.1

### Patch Changes

- chore: update jsonschema

## 0.4.0

### Minor Changes

- feat: 生成 rss 支持 ignore 配置

## 0.3.3

### Patch Changes

- chore: republish 0.3.2

## 0.3.2

### Patch Changes

- fix: 修复安装到 node_modules 下时无法正确生成 rss 的问题

## 0.3.1

### Patch Changes

- chore: 更新发布配置，显式指定 files

## 0.3.0

### Minor Changes

- feat: 支持 rss 配置
- fix: 修复无法处理粗体、斜体与东亚字符混排的问题
- fix: 修复无法渲染 `{}` 的问题，上游 vitepress 已知问题，ref: <https://github.com/vuejs/vitepress/issues/629>

## 0.2.0

### Minor Changes

- feat: 重新实现 plugin-docs，基于 vitepress 而不是 docsify

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.2.0
  - @liuli-util/markdown-util@0.8.0
  - @mark-magic/plugin-local@0.6.0
  - @mark-magic/utils@0.3.0
