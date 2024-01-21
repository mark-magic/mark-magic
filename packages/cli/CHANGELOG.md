# @mark-magic/cli

## 0.11.0

### Minor Changes

- feat(core): 支持错误时抛出错误到上层并且允许手动中断
- fix: 修复单元测试错误并添加 ci 以便后续及早发现

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.11.0

## 0.10.0

### Patch Changes

- fix(core): 修复在插件抛出 error 时没有终止的错误
- @mark-magic/core@0.10.0

## 0.9.4

### Patch Changes

- style: 改善 cli 的使用体验
  - @mark-magic/core@0.9.4

## 0.9.3

### Patch Changes

- feat(cli): 优化 cli 的体验
  - @mark-magic/core@0.9.3

## 0.9.2

### Patch Changes

- feat: 支持 transform 配置
- chore: 默认不再将插件包含在运行时依赖中
- Updated dependencies
  - @mark-magic/core@0.9.2

## 0.9.1

### Patch Changes

- fix: 修改 giscus 的必填项配置
- Updated dependencies
  - @mark-magic/plugin-local@0.9.1
  - @mark-magic/plugin-docs@0.9.1
  - @mark-magic/plugin-epub@0.9.1
  - @mark-magic/core@0.9.1

## 0.9.0

### Patch Changes

- @mark-magic/core@0.9.0
- @mark-magic/plugin-docs@0.9.0
- @mark-magic/plugin-epub@0.9.0
- @mark-magic/plugin-local@0.9.0

## 0.8.0

### Minor Changes

- chore: 统一版本

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.8.0
  - @mark-magic/plugin-docs@0.8.0
  - @mark-magic/plugin-epub@0.8.0
  - @mark-magic/plugin-local@0.8.0

## 0.7.0

### Minor Changes

- feat: 更新配置的格式，将 mark-magic.config.ts 与 yaml 文件尽量保持一致。
- test: 添加更好的单元测试

### Patch Changes

- Updated dependencies
  - @mark-magic/plugin-docs@0.6.0
  - @mark-magic/plugin-epub@0.5.0

## 0.6.0

### Minor Changes

- feat: 修改 yaml 配置中的 generate 字段为 tasks

## 0.5.0

### Minor Changes

- style: 优化 cli ux

### Patch Changes

- Updated dependencies
  - @mark-magic/plugin-docs@0.5.0
  - @mark-magic/core@0.3.0
  - @mark-magic/plugin-epub@0.4.0
  - @mark-magic/plugin-local@0.7.0

## 0.4.3

### Patch Changes

- fix: 修复 local 插件写入资源文件时没有正确处理同名资源的问题
- Updated dependencies
  - @mark-magic/plugin-docs@0.4.3
  - @mark-magic/plugin-local@0.6.1
  - @mark-magic/plugin-epub@0.3.1

## 0.4.2

### Patch Changes

- fix: 修复 description 没有正确设置的错误
- Updated dependencies
  - @mark-magic/plugin-docs@0.4.2

## 0.4.1

### Patch Changes

- chore: update jsonschema
- Updated dependencies
  - @mark-magic/plugin-docs@0.4.1

## 0.4.0

### Minor Changes

- feat: 生成 rss 支持 ignore 配置

### Patch Changes

- Updated dependencies
  - @mark-magic/plugin-docs@0.4.0

## 0.3.3

### Patch Changes

- chore: republish 0.3.2
- Updated dependencies
  - @mark-magic/plugin-docs@0.3.3

## 0.3.2

### Patch Changes

- fix: 修复安装到 node_modules 下时无法正确生成 rss 的问题
- Updated dependencies
  - @mark-magic/plugin-docs@0.3.2

## 0.3.1

### Patch Changes

- chore: 更新发布配置，显式指定 files
- Updated dependencies
  - @mark-magic/plugin-docs@0.3.1
  - @mark-magic/plugin-epub@0.3.1

## 0.3.0

### Minor Changes

- chore: 更新终端输出

### Patch Changes

- Updated dependencies
  - @mark-magic/plugin-docs@0.3.0
  - @mark-magic/plugin-epub@0.3.0

## 0.2.0

### Minor Changes

- feat: 重新实现 plugin-docs

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.2.0
  - @mark-magic/plugin-docs@0.2.0
  - @mark-magic/plugin-epub@0.2.0
  - @mark-magic/plugin-local@0.6.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @mark-magic/plugin-local@0.5.7
  - @mark-magic/plugin-docs@0.1.2
  - @mark-magic/plugin-epub@0.1.2

## 0.1.1

### Patch Changes

- init publish
- Updated dependencies
  - @mark-magic/plugin-local@0.5.6
  - @mark-magic/plugin-docs@0.1.1
  - @mark-magic/plugin-epub@0.1.1
  - @mark-magic/core@0.1.1
