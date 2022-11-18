import { fromMarkdown, toMarkdown } from '@liuli-util/markdown-util'
import { expect, it } from 'vitest'
import { convertLinks } from '../convertLinks'

it('convertLinks', () => {
  const root = fromMarkdown(
    `
# hello

[test.mp3](:/4b638fd91af2417e9fd0942c3e04ea0c)
[flower.webm](:/b160280b7d94417bb7f64d5fd1969230)
[1. Welcome to Joplin!](:/b6175f189a4e4c1cbea14c72848c54cb)
[github](https://github.com)
  `.trim(),
  )
  convertLinks({
    root,
    note: {
      resources: [
        { id: '4b638fd91af2417e9fd0942c3e04ea0c', title: 'test.mp3' },
        { id: 'b160280b7d94417bb7f64d5fd1969230', title: 'flower.webm' },
      ],
    },
    baseUrl: '',
  })
  const r = toMarkdown(root)
  expect(r.includes('(/resources/4b638fd91af2417e9fd0942c3e04ea0c.mp3)')).true
  expect(r.includes('(/resources/b160280b7d94417bb7f64d5fd1969230.webm)')).true
  expect(r.includes('(/p/b6175f189a4e4c1cbea14c72848c54cb)')).true
})
