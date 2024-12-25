# @mark-magic/plugin-local

## 0.19.0

### Minor Changes

- feat(local): support multiple html links in one mdast node

## 0.18.0

### Minor Changes

- feat: support hash link

## 0.14.0

### Minor Changes

- feat: 支持 source 配置，允许手动过滤出需要处理的 markdown 文件

## 0.12.0

### Minor Changes

- chore: update npm publish files config

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.12.0
  - @mark-magic/utils@0.12.0

## 0.11.2

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.11.2
  - @mark-magic/utils@0.11.2

## 0.11.0

### Minor Changes

- feat: 将 rootContentPath/rootResourcePath 缩减为一个 path 配置与输入匹配
- feat(core): 支持错误时抛出错误到上层并且允许手动中断

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.11.0
  - @mark-magic/utils@0.11.0

## 0.10.0

### Minor Changes

- feat: 修改输出插件的默认行为，现在默认不再输出 yaml 元数据

### Patch Changes

- @mark-magic/core@0.10.0
- @mark-magic/utils@0.10.0

## 0.9.4

### Patch Changes

- @mark-magic/core@0.9.4
- @mark-magic/utils@0.9.4

## 0.9.3

### Patch Changes

- fix(plugin-local): 修复重复资源没有正确缓存的错误
- @mark-magic/core@0.9.3
- @mark-magic/utils@0.9.3

## 0.9.2

### Patch Changes

- feat: 支持在扫描时忽略部分内容
- Updated dependencies
  - @mark-magic/core@0.9.2
  - @mark-magic/utils@0.9.2

## 0.9.1

### Patch Changes

- fix: 修改 giscus 的必填项配置
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

## 0.6.1

### Patch Changes

- fix: 修复 local 插件写入资源文件时没有正确处理同名资源的问题

## 0.6.0

### Minor Changes

- feat: 重新实现 plugin-docs，基于 vitepress 而不是 docsify
- fix: 修复没有正确 `path` 字段包含全路径的错误

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.2.0
  - @liuli-util/markdown-util@0.8.0
  - @mark-magic/utils@0.3.0

## 0.5.7

### Patch Changes

- fix: 修复 publish config

## 0.5.6

### Patch Changes

- init publish
- Updated dependencies
  - @liuli-util/markdown-util@0.7.1
  - @mark-magic/utils@0.2.3
  - @mark-magic/core@0.1.1

## 0.5.5

### Patch Changes

- Supports parsing HTML tags in markdown, including img/audio/video.

## 0.5.4

### Patch Changes

- update lib markdown-util

## 0.5.3

### Patch Changes

- fix the problem that resources may have duplicate names

## 0.5.2

### Patch Changes

- refactor hexo/hugo plguin to be local based

## 0.5.1

### Patch Changes

- fix obsidian => joplin

## 0.5.0

### Minor Changes

- modify plugin interface

## 0.3.0

### Minor Changes

- fix: 修复写入文件时没有处理文件名和含有空格的路径的问题

## 0.2.0

### Minor Changes

- Update the configuration items, no longer expose the root option, and use it to specify it in the plugin
- update hooks `config` => `start`

## 0.1.1

### Patch Changes

- fix publish tgz does not contain dist bug

## 1.0.0

### Major Changes

- init publish
