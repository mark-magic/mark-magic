import { it } from 'vitest'
import { claude } from '../claude'

const ORIGIN = `
Your eyebrows shoot up. That's... that's an offer and a half.

It'd work too, wouldn't it? Mami will once upon a never have done it, after all. She *is* that good.

But... no. Homura. She trusts you... and she deserves to have that trust repaid.
`.trim()

it.skip('claude', async () => {
  const translator = claude({
    apiKey: import.meta.env.VITE_TEST_CLAUDE_API_KEY,
    model: 'claude-3-sonnet-20240229',
    to: 'zh-CN',
  })
  const r = await translator.translate(ORIGIN)
  console.log(r)
}, 100_000)
