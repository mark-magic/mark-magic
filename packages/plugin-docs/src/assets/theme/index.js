import theme from 'vitepress/theme'
import giscusTalk from 'vitepress-plugin-comment-with-giscus'
import { useData, useRoute } from 'vitepress'

export default {
  ...theme,
  enhanceApp(ctx) {
    theme.enhanceApp(ctx)
    // ...
  },
  setup() {
    // Get frontmatter and route
    const { frontmatter } = useData()
    const route = useRoute()

    // Obtain configuration from: https://giscus.app/
    giscusTalk(
      {
        repo: '{{{repo}}}',
        repoId: '{{repoId}}',
        category: '{{category}}', // default: `General`
        categoryId: '{{categoryId}}',
        mapping: '{{mapping}}', // default: `pathname`
        inputPosition: '{{inputPosition}}', // default: `top`
        lang: '{{lang}}', // default: `zh-CN`
        lightTheme: '{{lightTheme}}', // default: `light`
        darkTheme: '{{darkTheme}}', // default: `transparent_dark`
      },
      {
        frontmatter,
        route,
      },
      // Whether to activate the comment area on all pages.
      // The default is true, which means enabled, this parameter can be ignored;
      // If it is false, it means it is not enabled.
      // You can use `comment: true` preface to enable it separately on the page.
      true,
    )
  },
}
