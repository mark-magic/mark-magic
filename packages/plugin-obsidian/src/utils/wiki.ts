import { MdastExtension, flatMap, Text, Node, ToMarkdownExtension, u } from '@liuli-util/markdown-util'

function join<T>(a: T[], sep: T): T[] {
  const r: T[] = []
  a.forEach((v, i) => {
    if (i !== 0) {
      r.push(sep)
    }
    r.push(v)
  })
  return r
}

function split(str: string, matchs: string[]): string[] {
  let r: string[] = [str]
  for (const m of matchs) {
    r = r.flatMap((s) => join(s.split(m), m).filter((s) => s.length > 0))
  }
  return r
}

export interface WikiLink extends Node {
  type: 'wiki'
  embed: boolean
  url: string
  hash?: string
  title?: string
  value: string
}

export function parseUrl(s: string): WikiLink {
  const embed = s.startsWith('!')
  const t = s.slice(embed ? 3 : 2, s.length - 2)
  const head = t.includes('#')
  const r = t.split(/[#|]/)
  return u('wiki', {
    embed,
    value: s,
    url: r[0],
    hash: head ? r[1] : undefined,
    title: head ? r[2] : r[1],
  }) as WikiLink
}
export function stringifyUrl(node: WikiLink): string {
  return node.value
}

export function wikiLinkFromMarkdown(): MdastExtension {
  return {
    transforms: [
      (root) => {
        return flatMap(root, (item) => {
          if (item.type !== 'text') {
            return [item]
          }
          const value = (item as Text).value
          const matchs = value.match(/!?\[\[.+\]\]/g) ?? []
          return split(value, matchs).map((s) => {
            if (!/!?\[\[.+\]\]/.test(s)) {
              return u('text', s) as Text
            }
            return parseUrl(s)
          })
        })
      },
    ],
  }
}

export function wikiLinkToMarkdown(): ToMarkdownExtension {
  return {
    handlers: {
      wiki: stringifyUrl,
    },
  }
}
