import { InputConfig, NovelInputPlugin, NovelMeta, renderReadme } from './utils'
import parse from 'node-html-parser'
import { fromHtml } from 'hast-util-from-html'
import { toMdast } from 'hast-util-to-mdast'
import { toMarkdown } from '@liuli-util/markdown-util'

/**
 *
 * @param url
 * @example https://www.bilibili.com/read/readlist/rl705094
 * @returns
 */
function extractId(url: string): string {
  const match = url.match(new RegExp('https://www.bilibili.com/read/readlist/rl(\\d+)'))
  if (match == null) {
    throw new Error(`无法从 ${url} 中提取 id`)
  }
  return match[1]
}

function html2md(html: string): string {
  return toMarkdown(toMdast(fromHtml(html, { fragment: true }) as any) as any)
}

function extractReadmeFromHTML(html: string): {
  content: string
} & Omit<NovelMeta, 'id'> {
  const $dom = parse(html)
  const title = $dom.querySelector('.right-side .title')?.textContent.trim()
  if (!title) {
    throw new Error('无法提取标题')
  }
  const htmlContent = $dom.querySelector('.right-side .summary')?.textContent.trim()
  if (!htmlContent) {
    throw new Error('无法提取简介')
  }
  const $creator = $dom.querySelector('.up-info-block .up-name')
  if (!$creator) {
    throw new Error('无法提取作者')
  }
  const creatorName = $creator.textContent.trim()
  const link = $creator.getAttribute('href')
  if (!link) {
    throw new Error('无法提取作者链接')
  }
  const creatorLink = link?.startsWith('https://') ? link : 'https:' + link
  return {
    name: title,
    content: html2md(htmlContent),
    creator: {
      name: creatorName,
      url: creatorLink,
    },
  }
}

function extractChapterFromHTML(html: string): string {
  const $dom = parse(html)
  const htmlContent = $dom.querySelector('#article-content')?.innerHTML
  if (!htmlContent) {
    throw new Error('无法提取简介')
  }
  return html2md(htmlContent)
}

async function fetchChapters(id: string): Promise<{ id: number; title: string; publish_time: number; url: string }[]> {
  return (await (await fetch(`https://api.bilibili.com/x/article/list/web/articles?id=${id}&jsonp=jsonp`)).json()).data
    .articles
}
interface ArticleData {
  opus_id: number
  opus_source: number
  title: string
  content: Content
  pub_info: PublicationInfo
  article: ArticleInfo
  version: VersionInfo
  dyn_id_str: string
  total_art_num: number
}

interface Content {
  paragraphs: Paragraph[]
}

interface Paragraph {
  para_type: number
  text?: TextContent
  pic?: PictureContent
  format?: ParagraphFormat
}

interface TextContent {
  nodes: TextNode[]
}

interface TextNode {
  node_type: number
  word?: Word
  link?: Link
}

interface Word {
  words: string
  style?: TextStyle
}

interface Link {
  show_text: string
  link: string
  link_type: number
  style?: TextStyle
}

interface PictureContent {
  pics: Picture[]
  style: number
}

interface Picture {
  url: string
  width: number
  height: number
  size: number
}

interface TextStyle {
  bold?: boolean
  // 其他可能的样式属性可以在此添加
}

interface PublicationInfo {
  uid: number
  pub_time: number
}

interface ArticleInfo {
  category_id: number
  list_id: number
  cover: Picture[]
}

interface VersionInfo {
  cvid: number
  version_id: number
}

// 新增 ParagraphFormat 接口
interface ParagraphFormat {
  list_format?: ListFormat
}

// 新增 ListFormat 接口
interface ListFormat {
  level: number
  order?: number
}

// 新增 ParagraphFormat 接口
interface ParagraphFormat {
  list_format?: ListFormat
}

// 新增 ListFormat 接口
interface ListFormat {
  level: number
  order?: number
}

/**
 * 渲染 b 站专栏自定义数据格式为 md
 * @param document
 */
export function renderBilibiliOpus(document: Paragraph[]): string {
  let markdown = ''

  for (let i = 0; i < document.length; i++) {
    const paragraph = document[i]
    let paraContent = ''
    switch (paragraph.para_type) {
      case 1: // 文本
        if (paragraph.text) {
          paraContent = renderText(paragraph.text)
        }
        break
      case 2: // 图片
        if (paragraph.pic) {
          paraContent = renderPicture(paragraph.pic)
        }
        break
      case 4: // 段落引用 >
        if (paragraph.text) {
          paraContent = '> ' + renderText(paragraph.text)
        }
        break
      case 6: // 列表
        if (paragraph.text) {
          paraContent = renderListItem(paragraph.text, paragraph.format?.list_format)
        }
        break
      // 更多段落类型的处理可以在此添加
    }
    if (paraContent) {
      markdown += paraContent
      // 检查下一项是否为列表，如果不是或者已经是最后一项，则添加两个换行符
      if (paragraph.para_type === 6 && i + 1 < document.length && document[i + 1].para_type === 6) {
        markdown += '\n'
      } else {
        markdown += '\n\n'
      }
    }
  }

  return markdown
}

function renderListItem(textContent: TextContent, listFormat?: ListFormat): string {
  const listItem = renderText(textContent)

  if (listFormat) {
    const indent = '  '.repeat(listFormat.level - 1)
    // const prefix = listFormat.order ? `${listFormat.order}. ` : '- '
    const prefix = '- '
    return `${indent}${prefix}${listItem}`
  }

  return `- ${listItem}`
}

function renderText(textContent: TextContent): string {
  return textContent.nodes
    .map((node) => {
      switch (node.node_type) {
        case 1: // 文本节点
          if (!node.word) return ''
          let wordStyle = node.word.style
          let word = node.word.words
          if (wordStyle?.bold) {
            word = `**${word}**`
          }
          return word
        case 4: // 链接节点
          return node.link ? `[${node.link.show_text}](${node.link.link})` : ''
        // 更多节点类型的处理可以在此添加
        default:
          return ''
      }
    })
    .join('')
}

function renderPicture(pictureContent: PictureContent): string {
  return pictureContent.pics.map((pic) => `![image](${pic.url})`).join('\n')
}

/**
 * 读取 b 站专栏
 * @returns
 */
export function bilibiliReadList(options: InputConfig): NovelInputPlugin {
  return {
    name: 'bilibili-read-list',
    async *generate() {
      const id = extractId(options.url)
      const html = await fetch(options.url).then((r) => r.text())
      const readme = extractReadmeFromHTML(html)
      yield {
        id: `${id}_readme`,
        name: 'readme',
        content: renderReadme({
          ...readme,
          url: options.url,
        }),
        path: ['readme.md'],
        resources: [],
        created: Date.now(),
        updated: Date.now(),
      }
      const chapters = await fetchChapters(id)
      const len = chapters.length.toString().length
      for (let i = 0; i < chapters.length; i++) {
        const it = chapters[i]
        const name = (i + 1).toString().padStart(len, '0')
        const json = await fetch(`https://api.bilibili.com/x/article/view?id=${it.id}`, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          },
        }).then((r) => r.json())
        const content = json.data.opus
          ? renderBilibiliOpus((json.data.opus as ArticleData).content.paragraphs)
          : html2md(json.data.content)
        yield {
          id: it.id.toString(),
          name,
          content: '# ' + it.title + '\n\n' + content,
          path: [name + '.md'],
          resources: [],
          created: Date.now(),
          updated: Date.now(),
        }
      }
    },
    async getMeta() {
      const html = await fetch(options.url).then((r) => r.text())
      const readme = extractReadmeFromHTML(html)
      const id = extractId(options.url)
      return {
        ...readme,
        id,
      }
    },
    match() {
      // https://www.bilibili.com/read/readlist/rl705094
      return options.url.startsWith('https://www.bilibili.com/read/readlist/')
    },
  }
}
