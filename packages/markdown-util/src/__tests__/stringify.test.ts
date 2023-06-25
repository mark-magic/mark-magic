import { expect, it } from 'vitest'
import { toHtml } from '../stringify'
import { Code, select, selectAll } from '../utils'
import { fromMarkdown } from '../parse'
import { Handler, toHast } from 'mdast-util-to-hast'
import { Highlighter, Lang, getHighlighter } from 'shiki'
import { u } from 'unist-builder'
import { fromHtml } from 'hast-util-from-html'

function tokensToHast(lines: any[]) {
  let tree = []

  for (const line of lines) {
    if (line.length === 0) {
      tree.push(u('text', '\n'))
    } else {
      for (const token of line) {
        tree.push(
          u(
            'element',
            {
              tagName: 'span',
              properties: { style: 'color: ' + token.color },
            },
            [u('text', token.content)],
          ),
        )
      }

      tree.push(u('text', '\n'))
    }
  }

  // Remove the last \n
  tree.pop()

  return tree
}

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
    theme: 'github-dark',
    langs: ['javascript', 'typescript'],
  })
  function shikiHandler(high: Highlighter): Handler {
    return (state, node: Code, parent) => {
      const html = high.codeToHtml(node.value, { lang: node.lang as Lang })
      const tree = fromHtml(html)
      // console.log('node', select('element[tagName="pre"]', tree))
      return select('element[tagName="pre"]', tree) as any
    }
  }
  const r = toHtml(root, {
    hast: {
      handlers: {
        code: shikiHandler(high),
      },
    },
  })
  expect(r).include('shiki github-dark')
})
