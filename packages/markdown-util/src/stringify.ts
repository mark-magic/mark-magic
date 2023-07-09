import { toHast, Options as HastOptions } from 'mdast-util-to-hast'
import { toHtml as hastToHtml, Options as HtmlOptions } from 'hast-util-to-html'
import { Root } from './utils'

/**
 * 将一段 markdown ast 序列化为 html
 * @param node
 * @returns
 */
export function toHtml(
  node: Root,
  options?: {
    hast?: HastOptions
    html?: HtmlOptions
  },
): string {
  return hastToHtml(toHast(node, options?.hast)!, options?.html)
}

/**
 * 将一段 markdown ast 序列化为 html
 * @depreted 已废弃，请使用 {@link toHtml}
 * @param node
 * @returns
 */
export function stringify(node: Root): string {
  return toHtml(node)
}
