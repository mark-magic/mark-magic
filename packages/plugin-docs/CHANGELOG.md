# @mark-magic/plugin-docs

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
