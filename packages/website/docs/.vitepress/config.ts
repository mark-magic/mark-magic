import { DefaultTheme, defineConfigWithTheme } from 'vitepress'

export default defineConfigWithTheme({
  title: 'mami',
  description: 'cross tool document converter',
  themeConfig: {
    nav: [
      {
        text: 'examples',
        items: [
          { text: 'joplin2hexo', link: 'https://mami.rxliuli.com/demo/joplin2hexo/' },
          { text: 'joplin2hugo', link: 'https://mami.rxliuli.com/demo/joplin2hugo/' },
        ],
      },
    ],
  } as DefaultTheme.Config,
})
