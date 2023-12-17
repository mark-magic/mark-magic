# mark-magic

## 简介

一个基于 markdown 的数据连接与转换工具，解决不同工具之间数据转换以及部分常用工具之间的协调。

一些用例

1. 发布一些笔记到网络上，例如从 joplin 笔记工具生成 hexo 博客需要的内容以发布到网络 <https://blog.rxliuli.com/>
2. 发布一部小说到网络上，例如从本地 markdown 文件生成一个小说网站发布，<https://tts.liuli.moe/>
3. 打包小说为 epub 文件，例如将飞向星空打包为 epub，便于下载后离线阅读，<https://github.com/liuli-moe/to-the-stars/releases>

一些之前社区的用例

1. joplin => hugo 生成 blog
2. joplin => jeykll 生成 blog
3. 可能还有其他的...

## 为什么不使用现有的工具

吾辈现在已经使用了许多工具用来处理不同的任务，但它们都是基于 markdown 的，例如

- 使用 joplin 记录笔记
- 使用 hexo 写作 blog
- 使用 vitepress 生成文档网站
- 使用 docusaurus 生成 seo 更友好的小说网站
- 使用 pandoc 生成 epub

真正让吾辈感到痛苦的是使用 docusaurus 时，每个小说都需要配置一堆东西，这非常烦人，所以希望有更好的可以开箱即用的工具。

## 开始使用

接下来给出两个示例

1. [为小说生成网站和 epub 电子档](./book.md)
2. [从笔记中生成博客](./blog.md)
