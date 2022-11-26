import { DefaultTheme, defineConfigWithTheme } from 'vitepress'

export default defineConfigWithTheme({
  title: 'mami',
  description: 'cross tool document converter',
  themeConfig: {
    nav: [
      {
        text: 'Examples',
        items: [
          { text: 'joplin2hexo', link: 'https://mami.rxliuli.com/demo/joplin2hexo/' },
          { text: 'joplin2hugo', link: 'https://mami.rxliuli.com/demo/joplin2hugo/' },
          { text: 'joplin2docsify', link: 'https://mami.rxliuli.com/demo/joplin2docsify/' },
          { text: 'obsidian2hexo', link: 'https://mami.rxliuli.com/demo/obsidian2hexo/' },
        ],
      },
      {
        text: 'API Reference',
        link: 'https://mami.rxliuli.com/api/',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/rxliuli/mami',
      },
    ],
  } as DefaultTheme.Config,
})
