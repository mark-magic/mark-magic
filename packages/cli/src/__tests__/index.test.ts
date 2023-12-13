import { it, expect } from 'vitest'
import { loadConfig, parseYamlConfig } from '../configParser'
import pathe from 'pathe'

it.skip('loadConfig', async () => {
  const r = await loadConfig(pathe.resolve(__dirname, './assets/to-the-stars'))
  expect(r).not.undefined
})

it.skip('parseConfig', async () => {
  const c = await loadConfig(pathe.resolve(__dirname, './assets/to-the-stars'))
  const config = await parseYamlConfig(c)
  config.forEach((it) => {
    expect(it.input).not.undefined
    expect(it.output).not.undefined
  })
})
