import { defineUserConfig, defaultTheme } from 'vuepress-vite'
import sidebar from './docs/sidebar.json'

export default defineUserConfig({
  title: 'joplin2vuepress',
  base: '/demo/joplin2vuepress/',
  description: 'This is a vuepress site generated from joplin using @mami/cli',
  theme: defaultTheme({ sidebar }),
})
