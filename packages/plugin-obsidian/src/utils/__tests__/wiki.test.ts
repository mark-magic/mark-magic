import { flatMap, fromMarkdown, Parent, Node, selectAll, toMarkdown, u, Text } from '@liuli-util/markdown-util'
import { readFile } from 'fs/promises'
import { Random } from 'mockjs'
import path from 'path'
import { expect, it } from 'vitest'
import { parseUrl, split, stringifyUrl, WikiLink, wikiLinkFromMarkdown, wikiLinkToMarkdown } from '../wiki'

it('wiki', () => {
  const content = `
Support [[Internal link]]
Support [[Internal link|With custom text]]
Support [[Internal link#heading]]
Support [[Internal link#heading|With custom text]]
Support ![[Document.pdf]]
Support ![[Image.png]]
Support ![[Audio.mp3]]
Support ![[Video.mp4]]
Support ![[Embed note]]
Support ![[Embed note#heading]]
    `.trim()
  const root = fromMarkdown(content, {
    mdastExtensions: [wikiLinkFromMarkdown()],
  })
  expect(selectAll('wiki', root).length).eq(content.split('\n').length)
  const r = toMarkdown(root, { extensions: [wikiLinkToMarkdown()] })
  expect(r.trim()).eq(content)
})

it('parseUrl', () => {
  expect(parseUrl('[[Internal link]]')).deep.eq({
    type: 'wiki',
    embed: false,
    value: '[[Internal link]]',
    url: 'Internal link',
    hash: undefined,
    title: undefined,
  } as WikiLink)
  expect(parseUrl('[[Internal link|With custom text]]')).deep.eq({
    type: 'wiki',
    embed: false,
    value: '[[Internal link|With custom text]]',
    url: 'Internal link',
    hash: undefined,
    title: 'With custom text',
  } as WikiLink)
  expect(parseUrl('[[Internal link#heading]]')).deep.eq({
    type: 'wiki',
    embed: false,
    value: '[[Internal link#heading]]',
    url: 'Internal link',
    hash: 'heading',
    title: undefined,
  } as WikiLink)
  expect(parseUrl('[[Internal link#heading|With custom text]]')).deep.eq({
    type: 'wiki',
    embed: false,
    value: '[[Internal link#heading|With custom text]]',
    url: 'Internal link',
    hash: 'heading',
    title: 'With custom text',
  } as WikiLink)
  expect(parseUrl('![[Document.pdf]]')).deep.eq({
    type: 'wiki',
    embed: true,
    value: '![[Document.pdf]]',
    url: 'Document.pdf',
    hash: undefined,
    title: undefined,
  } as WikiLink)
  expect(parseUrl('![[Image.png]]')).deep.eq({
    type: 'wiki',
    embed: true,
    value: '![[Image.png]]',
    url: 'Image.png',
    hash: undefined,
    title: undefined,
  } as WikiLink)
  expect(parseUrl('![[Audio.mp3]]')).deep.eq({
    type: 'wiki',
    embed: true,
    value: '![[Audio.mp3]]',
    url: 'Audio.mp3',
    hash: undefined,
    title: undefined,
  } as WikiLink)
  expect(parseUrl('![[Video.mp4]]')).deep.eq({
    type: 'wiki',
    embed: true,
    value: '![[Video.mp4]]',
    url: 'Video.mp4',
    hash: undefined,
    title: undefined,
  } as WikiLink)
  expect(parseUrl('![[Embed note]]')).deep.eq({
    type: 'wiki',
    embed: true,
    value: '![[Embed note]]',
    url: 'Embed note',
    hash: undefined,
    title: undefined,
  } as WikiLink)
  expect(parseUrl('![[Embed note#heading]]')).deep.eq({
    type: 'wiki',
    embed: true,
    value: '![[Embed note#heading]]',
    url: 'Embed note',
    hash: 'heading',
    title: undefined,
  } as WikiLink)
})

it('stringifyUrl', () => {
  const list = [
    '[[Internal link]]',
    '[[Internal link|With custom text]]',
    '[[Internal link#heading]]',
    '[[Internal link#heading|With custom text]]',
    '![[Document.pdf]]',
    '![[Image.png]]',
    '![[Audio.mp3]]',
    '![[Video.mp4]]',
    '![[Embed note]]',
    '![[Embed note#heading]]',
  ]
  list.forEach((s) => {
    expect(stringifyUrl(parseUrl(s))).eq(s)
  })
})

it('wiki', () => {
  const root = fromMarkdown(
    `
![[Pasted image 20221011232440.png]]
[[Pasted image 20221011232440.png]]
    `.trim(),
    { mdastExtensions: [wikiLinkFromMarkdown()] },
  )
  flatMap(root, (node) => {
    if (node.type !== 'wiki') {
      return [node]
    }
    const wiki = node as WikiLink
    if (wiki.embed) {
      return [
        u('image', {
          alt: 'Pasted image 20221011232440.png',
          url: `:/test`,
        }),
      ]
    }
    return [
      u('link', {
        url: `:/test`,
        children: [u('text', 'Pasted image 20221011232440.png')],
      }),
    ]
  })
  const r = toMarkdown(root)
  expect(r.trim().split('\n')).deep.eq([
    '![Pasted image 20221011232440.png](:/test)',
    '[Pasted image 20221011232440.png](:/test)',
  ])
})

it('split', () => {
  const r = split(
    `
![[Pasted image 20221011232440.png]]
[[Pasted image 20221011232440.png]]
      `.trim(),
    ['![[Pasted image 20221011232440.png]]', '[[Pasted image 20221011232440.png]]'],
  )
  expect(r).deep.eq(['![[Pasted image 20221011232440.png]]', '\n', '[[Pasted image 20221011232440.png]]'])
})

it('performance', async () => {
  const md = `
# hello

- Helen Perez
- Margaret Rodriguez
  - Christopher Hall
    - Kenneth Hernandez
    - Eric Johnson
      - Christopher Jackson
      - Sandra Young
        - Jose Clark
          - Donna Young
            1. Robert Johnson
            2. Barbara Young
            3. Timothy Gonzalez
                - Jennifer Perez
                  - Jose White
            4. Edward Brown
  `.trim()
  const start = Date.now()
  fromMarkdown(md, {
    mdastExtensions: [wikiLinkFromMarkdown()],
  })
  expect(Date.now() - start).lt(100)
})
