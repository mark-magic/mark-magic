import { fromMarkdown } from '@liuli-util/markdown-util'
import { expect, it } from 'vitest'
import { getTags } from '../getTags'

it('getTags', () => {
  const root = fromMarkdown(
    ` 
---
tags:
  - blog
  - test
---
[[hello world 2]]
  `.trim(),
  )
  const r = getTags(root)
  expect(r.map((item) => item.title)).deep.eq(['blog', 'test'])
})

it('no tags', () => {
  const root = fromMarkdown(
    `
# hello
  `.trim(),
  )
  const r = getTags(root)
  expect(r).empty
})
