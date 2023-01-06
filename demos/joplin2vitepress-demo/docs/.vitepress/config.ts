import { defineConfigWithTheme, DefaultTheme } from 'vitepress'
import sidebar from '../sidebar.json'

export default defineConfigWithTheme<DefaultTheme.Config>({
  title: 'joplin2vitepress',
  base: '/demo/joplin2vitepress/',
  description: 'This is a vitepress site generated from joplin using @mami/cli',
  themeConfig: {
    sidebar,
  },
})
