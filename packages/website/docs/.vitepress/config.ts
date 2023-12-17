import { defineConfig } from 'vitepress'
import {} from 'vitepress/theme'

export default defineConfig({
  title: 'Mark Magic',
  description: '一个基于 markdown 的数据连接与转换工具，解决不同工具之间数据转换以及部分常用工具之间的协调。',
  themeConfig: {
    sidebar: [
      {
        text: '介绍',
        link: '/index',
      },
      {
        text: '小说 => 网站 + EPUB',
        link: '/book',
      },
      {
        text: '笔记 => 博客',
        link: '/blog',
      },
      {
        text: '部署',
        link: '/deploy',
      },
      {
        text: '配置',
        link: '/config',
      },
      {
        text: '使用插件',
        link: '/plugin/',
        items: [
          { text: 'plugin-local', link: '/plugin/plugin-local' },
          { text: 'plugin-epub', link: '/plugin/plugin-epub' },
          { text: 'plugin-docs', link: '/plugin/plugin-docs' },
          { text: 'plugin-joplin', link: '/plugin/plugin-joplin' },
          { text: 'plugin-hexo', link: '/plugin/plugin-hexo' },
        ],
      },
      {
        text: '插件 API',
        link: '/api-plugin',
      },
      // {
      //   text: 'API',
      //   link: '/api',
      // },
    ],
  },
})
