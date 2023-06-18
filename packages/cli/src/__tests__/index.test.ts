import { it, expect } from 'vitest'
import { loadConfig, parseConfig } from '..'
import pathe from 'pathe'

it('loadConfig', async () => {
  const r = await loadConfig(pathe.resolve(__dirname, './assets/to-the-stars'))
  expect(r).not.undefined
})

it('parseConfig', async () => {
  const c = await loadConfig(pathe.resolve(__dirname, './assets/to-the-stars'))
  const config = await parseConfig(c)
  config.forEach((it) => {
    expect(it.input.plugin).not.undefined
    expect(it.output.plugin).not.undefined
  })
})
