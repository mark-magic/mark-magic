# @mark-magic/plugin-ao3

## 0.15.1

### Patch Changes

- fix: 更新发布新章节时的参数

## 0.13.0

### Patch Changes

- Updated dependencies
  - mdast-util-cjk-space-clean@0.2.0

## 0.12.6

### Patch Changes

- fix: 修复 ao3/sv 下载的错误，ao3 现在拉取也支持 cookie

## 0.12.3

### Patch Changes

- feat: 更新 markdown ast 的选择器为标准的 css 选择器

## 0.12.0

### Minor Changes

- chore: update npm publish files config

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.12.0
  - @mark-magic/utils@0.12.0

## 0.11.5

### Patch Changes

- fix: 使用另一种策略限制请求速率

## 0.11.4

### Patch Changes

- feat: 限制请求速率

## 0.11.3

### Patch Changes

- feat: 校验配置，如果没有传递则抛出异常

## 0.11.2

### Patch Changes

- feat: 支持同步小说到 ao3 网站上
- feat: 支持新编辑器创建的没有 ssr 的文章
- feat: 支持 spacebattles 网站
- feat(epubhub): 支持了下载时有正确的文件名，并且在生成后自动下载
- feat: 支持下载 bilibili 文集
- feat(epubhub): 支持在线下载 ao3/sv 网站的小说
- feat: 支持生成一个 readme.md，包含书籍的简介或概览之类的
- fix: 修复 ao3 只有一章时无法解析的错误
- Updated dependencies
  - @mark-magic/core@0.11.2
  - @mark-magic/utils@0.11.2

## 0.11.1

### Patch Changes

- fix: 修复输出的文件名按照章节数量计算

## 0.11.0

### Minor Changes

- feat: 为 sv 增加缓存功能
- feat: 基本支持从 sufficientvelocity 下载小说
- refactor: 重构为支持其他同人小说网站做准备
- feat: 改进 ao3 插件，使用 仅请求一次避免速率限制

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.11.0
  - @mark-magic/utils@0.11.0

## 0.10.0

### Patch Changes

- @mark-magic/core@0.10.0
- @mark-magic/utils@0.10.0

## 0.9.4

### Patch Changes

- @mark-magic/core@0.9.4
- @mark-magic/utils@0.9.4

## 0.9.3

### Patch Changes

- @mark-magic/core@0.9.3
- @mark-magic/utils@0.9.3

## 0.9.2

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.9.2
  - @mark-magic/utils@0.9.2

## 0.9.1

### Patch Changes

- @mark-magic/core@0.9.1
- @mark-magic/utils@0.9.1

## 0.9.0

### Patch Changes

- @mark-magic/core@0.9.0
- @mark-magic/utils@0.9.0

## 0.8.0

### Minor Changes

- chore: 统一版本

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.8.0
  - @mark-magic/utils@0.8.0

## 0.7.0

### Minor Changes

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.3.0
  - @mark-magic/utils@0.4.0

## 0.6.0

### Minor Changes

- feat: 实现从 ao3 拉取小说作为输入源，便于构建出来 epub 之类的电子书

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.2.0
  - @liuli-util/markdown-util@0.8.0
  - @mark-magic/utils@0.3.0
