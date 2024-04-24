import type { Transform, Extension } from 'mdast-util-from-markdown'
import type { Paragraph, Text } from 'mdast'
import { selectAll } from 'unist-util-select'
import { isChineseOrSymbol } from './utils'

/**
 * 清理粗体两侧多余的空格
 * @returns
 */
function clearStrongSpace(): Transform {
  return (root) => {
    selectAll(':has(> strong)', root).forEach((it) => {
      const children = (it as Paragraph).children
      children.forEach((it, i) => {
        if (it.type === 'strong') {
          // 清理后置的空格
          const s = (it.children[0] as Text).value
          if (s) {
            const next = children[i + 1]
            const last = s.slice(s.length - 1)
            if (
              next &&
              next.type === 'text' &&
              next.value.startsWith(' ') &&
              (isChineseOrSymbol(last) || isChineseOrSymbol(next.value[1]))
            ) {
              next.value = next.value.trimStart()
            }
            const prev = children[i - 1]
            if (
              prev &&
              prev.type === 'text' &&
              prev.value.endsWith(' ') &&
              isChineseOrSymbol(prev.value[prev.value.length - 2])
            ) {
              prev.value = prev.value.trimEnd()
            }
          }
        }
      })
    })
    return root
  }
}

/**
 * 清理粗体两侧多余的空格
 * @returns
 */
function clearIntailSpace(): Transform {
  return (root) => {
    selectAll(':has(> emphasis)', root).forEach((it) => {
      const children = (it as Paragraph).children
      children.forEach((it, i) => {
        if (it.type === 'emphasis') {
          // 清理后置的空格
          const s = (it.children[0] as Text).value
          if (s) {
            const next = children[i + 1]
            const last = s.slice(s.length - 1)
            if (next && next.type === 'text' && isChineseOrSymbol(last) && next.value.startsWith(' ')) {
              next.value = next.value.trim()
            }
            const prev = children[i - 1]
            if (
              prev &&
              prev.type === 'text' &&
              prev.value.endsWith(' ') &&
              isChineseOrSymbol(prev.value[prev.value.length - 2])
            ) {
              prev.value = prev.value.trimEnd()
            }
          }
        }
      })
    })
    return root
  }
}

/**
 * 支持解析中文中的符号，主要是处理粗体与斜体的一些问题
 * 下面是解析完成之后再单独处理每一段文本，但更好的方式应该是介入 token 解析层
 * @link 参考 issue: https://github.com/commonmark/commonmark-spec/issues/650
 * @returns
 * @beta
 */
export function cjk(): Extension {
  return {
    transforms: [clearStrongSpace(), clearIntailSpace()],
  }
}
