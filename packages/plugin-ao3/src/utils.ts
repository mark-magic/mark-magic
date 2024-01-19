import { toMarkdown, Root } from '@liuli-util/markdown-util'
import { fromHtml } from 'hast-util-from-html'
import { toMdast } from 'hast-util-to-mdast'

export interface InputConfig {
  url: string
  // TODO 此处应该能自动推导出 site 的类型
  site: 'ao3' | 'sufficientvelocity'
}
