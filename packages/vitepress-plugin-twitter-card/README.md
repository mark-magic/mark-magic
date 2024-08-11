# vitepress-plugin-twitter-card

A VitePress plugin that adds Twitter card meta tags to your site.

## Installation

```bash
pnpm i vitepress-plugin-twitter-card
```

## Usage

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { twitterCardPlugin } from 'vitepress-plugin-twitter-card'

export default defineConfig({
  plugins: [
    twitterCardPlugin({
      site: 'vitepress', // Your Twitter username
      image: 'https://vitepress.dev/vitepress-logo-large.webp', // URL to the image you want to use
    }),
  ],
})
```

Visit the [Twitter Card Validator](https://cards-dev.twitter.com/validator) to test your site.
