import { lookup } from 'mime-types'
import JSZip from 'jszip'
import mimetype from './template/mimetype?raw'

export interface MetaData {
  id: string
  title: string
  author: string
  language: string
  cover?: string
}

export interface Chapter {
  id: string
  title: string
  content: string
}

export interface Toc {
  id: string
  title: string
  chapterId: string
}

export interface Image {
  id: string
  buffer: Buffer
}

export interface GenerateOptions {
  metadata: MetaData
  text: Chapter[]
  toc: Toc[]
  image: Image[]
}

export class EpubBuilder {
  private renderMetadata(meta: MetaData) {
    return `<metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:identifier opf:scheme="uuid" id="uuid_id">${meta.id}</dc:identifier>
    <dc:title>${meta.title}</dc:title>
    <dc:creator>${meta.author}</dc:creator>
    <dc:language>${meta.language}</dc:language>
    <meta name="cover" content="${meta.cover}"/>
  </metadata>`
  }

  private renderToc(item: Toc) {
    return `<navPoint playOrder="1">
    <navLabel>
      <text>${item.title}</text>
    </navLabel>
    <content src="text/${item.chapterId}.xhtml"/>
  </navPoint>`
  }

  private renderTocXML(title: string, toc: Toc[]) {
    return `<?xml version='1.0' encoding='utf-8'?>
    <ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="zho">
      <docTitle>
        <text>${title}</text>
      </docTitle>
      <navMap>
        ${toc.map(this.renderToc)}
      </navMap>
    </ncx>
    `
  }

  private renderManifest({ text, image }: { text: Chapter[]; image: Image[] }) {
    return `<manifest>
    <item href="toc.ncx" id="ncx" media-type="application/x-dtbncx+xml"/>
    ${text
      .map((item) => `<item id="${item.id}" href="text/${item.id}.xhtml" media-type="application/xhtml+xml"/>`)
      .join('\n')}
    ${image
      .map((item) => `<item href="images/${item.id}" id="${item.id}" media-type="${lookup(item.id)}"/>`)
      .join('\n')}
  </manifest>`
  }

  private renderNcxSpine(text: Chapter[]) {
    return `<spine toc="ncx">
    ${text.map((item) => `<itemref idref="${item.id}"/>`).join('\n')}
  </spine>`
  }

  private renderContentOpf(options: { metadata: string; manifest: string; ncxSpine: string }) {
    return `<?xml version='1.0' encoding='utf-8'?>
    <package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uuid_id" version="2.0">
      ${options.metadata}
      ${options.manifest}
      ${options.ncxSpine}
      <guide/>
    </package>
    `
  }

  private renderText(text: Chapter) {
    return `<?xml version="1.0" encoding="utf-8"?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>${text.title}</title>
      </head>
      <body>
        <main>
          ${text.content}
        </main>
      </body>
    </html>`
  }

  private init(zip: JSZip) {
    zip.file('mimetype', mimetype)
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

  gen({ metadata, text, toc, image }: GenerateOptions): JSZip {
    const zip = new JSZip()
    this.init(zip)
    zip.file('toc.ncx', this.renderTocXML(metadata.title, toc))
    zip.file(
      'content.opf',
      this.renderContentOpf({
        metadata: this.renderMetadata(metadata),
        manifest: this.renderManifest({ text, image }),
        ncxSpine: this.renderNcxSpine(text),
      }),
    )
    // 写入图像
    image.forEach((item) => zip.file(`images/${item.id}`, item.buffer))
    // 写入文本
    text.forEach((item) => zip.file(`text/${item.id}.xhtml`, this.renderText(item)))

    return zip
  }
}
