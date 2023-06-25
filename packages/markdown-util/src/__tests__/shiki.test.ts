import { expect, it } from 'vitest'
import { getHighlighter } from 'shiki'

it('render', async () => {
  const highlighter = await getHighlighter({
    theme: 'github-dark',
    langs: ['javascript'],
  })
  const code = highlighter.codeToHtml(`console.log('shiki');`, {
    lang: 'javascript',
  })
  expect(code).contain('shiki github-dark')
})
