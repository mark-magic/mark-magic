import { expect, it } from 'vitest'
import { toHtml } from '../stringify'
import { shikiHandler } from '../utils'
import { fromMarkdown } from '../parse'
import { getHighlighter } from 'shiki'

it('Handler', async () => {
  const root = fromMarkdown(
    `
# hello world

\`\`\`js
console.log('hello world');
\`\`\`
  `.trim(),
  )
  const high = await getHighlighter({
    themes: ['github-dark', 'github-light'],
  })

  const r = toHtml(root, {
    hast: {
      handlers: {
        code: shikiHandler(high),
      },
    },
  })
  expect(r).include('shiki shiki-dark').include('shiki shiki-light')
})
