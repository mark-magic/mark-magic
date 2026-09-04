import { lookup } from 'mime-types'
import JSZip from 'jszip'
import mimetype from './template/mimetype?raw'
import { treeReduce } from '@liuli-util/tree'

/**
 * 转义 XML 中的特殊字符，用于文本内容与属性值，避免生成非法的 XHTML
 */
export function escapeXml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export interface MetaData {
  /** 书籍唯一标识 */
  id: string
  /** 书籍标题 */
  title: string
  /** 作者 */
  creator: string
  /** 发布者 */
  publisher: string
  /** 语言 */
  language: string
  /** 封面图片 */
  cover?: string
}

export interface Chapter {
  /** 章节 id */
  id: string
  /** 标题 */
  title: string
  /** 内容 */
  content: string
}

export interface Toc {
  /** 标题 id */
  id: string
  /** 标题 */
  title: string
  /** 章节内容的 id */
  chapterId: string
  /** 子目录，注意，它会被扁平化生成 spine */
  children?: Toc[]
}

export interface Media {
  id: string
  buffer: Buffer
}

export interface GenerateOptions {
  /** 书籍元数据 */
  metadata: MetaData
  /** 文字 */
  text: Chapter[]
  /** 标识符 */
  toc: Toc[]
  /** 图像 */
  media: Media[]
}

interface RenderNavToc extends Omit<Toc, 'id' | 'children'> {
  /** 标题 */
  title: string
  /** 章节内容的 id */
  chapterId: string
  /** 子目录，注意，它会被扁平化生成 spine */
  children?: RenderNavToc[]
}

export function renderNavXML(toc: RenderNavToc[], metadata: Pick<MetaData, 'language'>) {
  const result = treeReduce(
    toc,
    (accumulator, node, childrenResult, path) => {
      const indent = '  '.repeat(path.length + 1)
      const childrenHtml = childrenResult
      return (
        accumulator +
        `\n${indent}<li>\n${indent}  <a href="./${escapeXml(node.chapterId)}.xhtml">${escapeXml(node.title)}</a>` +
        (childrenHtml ? `\n${indent}  <ol>${childrenHtml}\n${indent}  </ol>\n${indent}</li>` : `\n${indent}</li>`)
      )
    },
    '',
    {
      id: 'chapterId',
      children: 'children',
    },
  )
  const lang = escapeXml(metadata.language)

  return `<?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${lang}" lang="${lang}">
    <head>
      <title>Navigation</title>
      <meta charset="utf-8" />
    </head>
    <body>
      <nav xmlns:epub="http://www.idpf.org/2007/ops" epub:type="toc" id="toc">
        <ol>
          ${result}
        </ol>
      </nav>
    </body>
  </html>
  `
}

export class EpubBuilder {
  private renderMetadata(meta: MetaData) {
    return `<metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:identifier id="book-id">${escapeXml(meta.id)}</dc:identifier>
    <dc:title>${escapeXml(meta.title)}</dc:title>
    <dc:creator>${escapeXml(meta.creator)}</dc:creator>
    <dc:publisher>${escapeXml(meta.publisher)}</dc:publisher>
    <dc:language>${escapeXml(meta.language)}</dc:language>
    ${meta.cover ? `<meta name="cover" content="${escapeXml(meta.cover)}" />` : ''}
  </metadata>`
  }

  private renderManifest({ text, media, metadata }: Pick<GenerateOptions, 'text' | 'media' | 'metadata'>) {
    return `<manifest>
    ${text
      .map(
        (item) =>
          `<item id="${escapeXml(item.id)}" href="Text/${escapeXml(
            item.id,
          )}.xhtml" media-type="application/xhtml+xml"/>`,
      )
      .join('\n')}
    ${media
      .map(
        (item) =>
          `<item href="Media/${escapeXml(item.id)}" id="${escapeXml(item.id)}" media-type="${
            lookup(item.id) || 'application/octet-stream'
          }"${item.id === metadata.cover ? ' properties="cover-image"' : ''}/>`,
      )
      .join('\n')}
    <item id="nav" href="Text/nav.xhtml" media-type="application/xhtml+xml" properties="nav" />
  </manifest>`
  }

  private renderNcxSpine(text: Chapter[]) {
    return `<spine toc="nav">
    ${text.map((item) => `<itemref idref="${escapeXml(item.id)}"/>`).join('\n')}
  </spine>`
  }

  private renderContentOpf(list: string[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <package xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id" version="3.0">
      ${list.join('\n')}
      <guide/>
    </package>
    `
  }

  private renderText(text: Chapter) {
    return `<?xml version="1.0" encoding="utf-8"?>
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>${escapeXml(text.title)}</title>
      </head>
      <body>
        <main>
          ${text.content}
        </main>
      </body>
    </html>`
  }

  private init(zip: JSZip) {
    // mimetype 必须是压缩包的第一个条目，且不能被压缩，这是 EPUB 规范的强制要求
    zip.file('mimetype', mimetype, { compression: 'STORE' })
    zip.file(
      'META-INF/container.xml',
      `<?xml version="1.0"?>
    <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
       <rootfiles>
          <rootfile full-path="content.opf" media-type="application/oebps-package+xml"/>
       </rootfiles>
    </container>`,
    )
  }

  gen(options: GenerateOptions): JSZip {
    const zip = new JSZip()
    this.init(zip)
    zip.file('Text/nav.xhtml', renderNavXML(options.toc, options.metadata))
    zip.file(
      'content.opf',
      this.renderContentOpf([
        this.renderMetadata(options.metadata),
        this.renderManifest(options),
        this.renderNcxSpine(options.text),
      ]),
    )
    // 写入图像
    options.media.forEach((it) => zip.file(`Media/${it.id}`, it.buffer))
    // 写入文本
    options.text.forEach((it) => zip.file(`Text/${it.id}.xhtml`, this.renderText(it)))

    return zip
  }
}
