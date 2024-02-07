import { SystemMessagePromptTemplate } from 'langchain/prompts'
import { expect, it } from 'vitest'

it('template', async () => {
  const r = await SystemMessagePromptTemplate.fromTemplate('translate to {to}').format({ to: 'en' })
  expect(r.content).eq('translate to en')
})
