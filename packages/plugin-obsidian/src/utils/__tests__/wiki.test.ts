import { fromMarkdown, selectAll, toMarkdown } from '@liuli-util/markdown-util'
import { expect, it } from 'vitest'
import { parseUrl, stringifyUrl, WikiLink, wikiLinkFromMarkdown, wikiLinkToMarkdown } from '../wiki'

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
