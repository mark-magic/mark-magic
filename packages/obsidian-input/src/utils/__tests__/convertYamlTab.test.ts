import { expect, it } from 'vitest'
import { convertYamlTab } from '../convertYamlTab'

it('convertYamlTab', () => {
  const r = convertYamlTab(
    `
---
tags:
\t- blog
\t- test
---
[[hello world 2]]
  `.trim(),
  )
  expect(r).not.includes('\t')
})
