import { toMarkdown, u } from '@liuli-util/markdown-util'
import { fromHtml } from 'hast-util-from-html'
import { toMdast } from 'hast-util-to-mdast'
import { expect, it } from 'vitest'

it('include break', () => {
  const hast = fromHtml(
    `<div class="bbWrapper">Your head swims as you fade in and out of darkness. You retch miserably, bringing up nothing but bile as you struggle to recall-<br>
  <br>
  You almost black out again, but a small hand stops you from tipping over. Weakly, you struggle to a kneeling position, meeting the horrified eyes of a girl who'd been passing by.<br>
  <br>`,
    { fragment: true },
  )
  const mdast = toMdast(hast as any, {
    handlers: {
      br() {
        return u('text', '\n')
      },
    },
  })
  const r = toMarkdown(mdast as any)
  expect(r).eq(
    `Your head swims as you fade in and out of darkness. You retch miserably, bringing up nothing but bile as you struggle to recall-\n\nYou almost black out again, but a small hand stops you from tipping over. Weakly, you struggle to a kneeling position, meeting the horrified eyes of a girl who'd been passing by.\n\n`,
  )
})
