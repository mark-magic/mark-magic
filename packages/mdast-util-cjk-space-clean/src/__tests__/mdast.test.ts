import { describe, expect, it } from 'vitest'
import { fromMarkdown, hastToHtml, mdToHast } from '@liuli-util/markdown-util'
import { cjk } from '..'
import { ITALIC_CASE, STRONG_CASE } from '../utils'

describe('strong', () => {
  const render = (s: string) => hastToHtml(mdToHast(fromMarkdown(s, { mdastExtensions: [cjk()] }))!)
  it('render strong', () => {
    const list = STRONG_CASE
    list.forEach((it) => {
      expect(render(it[0])).eq(it[1])
    })
  })
  it('real content', () => {
    expect(render(`“**需要**，”杏子厉声说。“**没人**会就这样不请自来，开始免费发放食物和东西，就因为'想这么做'。”`)).eq(
      `<p>“<strong>需要</strong>，”杏子厉声说。“<strong>没人</strong>会就这样不请自来，开始免费发放食物和东西，就因为'想这么做'。”</p>`,
    )
  })
})

describe('italic', () => {
  const render = (s: string) => hastToHtml(mdToHast(fromMarkdown(s, { mdastExtensions: [cjk()] }))!)
  it('Render italic', () => {
    const list = ITALIC_CASE
    list.forEach((it) => {
      expect(render(it[0])).eq(it[1])
    })
  })
})
