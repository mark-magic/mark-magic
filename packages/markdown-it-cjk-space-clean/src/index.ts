import { selectAll } from 'unist-util-select'
import { PluginSimple, Token } from 'markdown-it'
import { isChineseOrSymbol } from 'mdast-util-cjk-space-clean/utils'

function clearExtraSpace(tag: 'strong' | 'em'): PluginSimple {
  return (md) => {
    // 挂钩到 'render' 钩子，该钩子在渲染 tokens 为 HTML 之前执行
    md.core.ruler.push(`clear_${tag}_space`, function (state) {
      const tokens = state.tokens
      tokens.forEach((it) => {
        selectAll(`:has(> [tag="${tag}"])`, it).forEach((parent) => {
          const children = (parent as Token).children ?? []
          children.forEach((token, idx) => {
            if (token.tag !== tag) {
              return
            }
            const prevToken = children[idx - 1]
            if (!prevToken) {
              return
            }
            const nextToken = children[idx + 1]
            if (!nextToken) {
              return
            }
            const last = (s: string) => s[s.length - 1]
            if (token.type === `${tag}_open`) {
              // 清理之前的可能存在的空格
              if (
                isChineseOrSymbol(last(prevToken.content.trimEnd())) &&
                last(prevToken.content) === ' ' &&
                isChineseOrSymbol(nextToken.content.trimStart()[0])
              ) {
                prevToken.content = prevToken.content.trimEnd()
              }
              return
            }
            if (token.type === `${tag}_close`) {
              // 清理之后可能存在的空格
              if (
                isChineseOrSymbol(prevToken.content[prevToken.content.length - 1]) &&
                nextToken.content[0] === ' ' &&
                isChineseOrSymbol(nextToken.content.trimStart()[0])
              ) {
                nextToken.content = nextToken.content.trimStart()
              }
              return
            }
          })
        })
      })
    })
  }
}

export function cjk(): PluginSimple {
  return (md) => {
    md.use(clearExtraSpace('strong')).use(clearExtraSpace('em'))
  }
}
