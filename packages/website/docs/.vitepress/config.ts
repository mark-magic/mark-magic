import { defineConfig } from 'vitepress'
import {} from 'vitepress/theme'

export default defineConfig({
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
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
            text: 'AI 翻译',
            link: '/trans',
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
              { text: 'plugin-doctran', link: '/plugin/plugin-doctran' },
              { text: 'plugin-ao3', link: '/plugin/plugin-ao3' },
              { text: 'plugin-image-download', link: '/plugin/plugin-image-download' },
            ],
          },
          {
            text: '插件 API',
            link: '/api-plugin',
          },
        ],
        nav: [
          {
            text: 'Github',
            link: 'https://github.com/mark-magic/mark-magic',
          },
        ],
        logo: '/logo.png',
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      title: 'Mark Magic',
      description:
        'A markdown-based data connection and conversion tool to solve data conversion between different tools and coordination between some common tools.',
      themeConfig: {
        sidebar: [
          {
            text: 'Introduction',
            link: '/en/index',
          },
          {
            text: 'Novel => Website + EPUB',
            link: '/en/book',
          },
          {
            text: 'Notes => Blog',
            link: '/en/blog',
          },
          {
            text: 'AI Translation',
            link: '/en/trans',
          },
          {
            text: 'Configuration',
            link: '/en/config',
          },
          {
            text: 'Using Plugins',
            link: '/en/plugin/',
            items: [
              { text: 'plugin-local', link: '/en/plugin/plugin-local' },
              { text: 'plugin-epub', link: '/en/plugin/plugin-epub' },
              { text: 'plugin-docs', link: '/en/plugin/plugin-docs' },
              { text: 'plugin-joplin', link: '/en/plugin/plugin-joplin' },
              { text: 'plugin-hexo', link: '/en/plugin/plugin-hexo' },
              { text: 'plugin-doctran', link: '/en/plugin/plugin-doctran' },
              { text: 'plugin-ao3', link: '/en/plugin/plugin-ao3' },
              { text: 'plugin-image-download', link: '/plugin/plugin-image-download' },
            ],
          },
          {
            text: 'Plugin API',
            link: '/en/api-plugin',
          },
        ],
        nav: [
          {
            text: 'Github',
            link: 'https://github.com/mark-magic/mark-magic',
          },
        ],
        logo: '/logo.png',
      },
    },
  },
  ignoreDeadLinks: 'localhostLinks',
})
