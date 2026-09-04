import { convert } from '@mark-magic/core'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import * as local from '@mark-magic/plugin-local'
import path from 'pathe'
import { output } from '../output'
import { initTempPath } from '@liuli-util/test'
import { fromVirtual, trimMarkdown } from '@mark-magic/utils'
import { EpubOutputConfig } from '../config.schema'
import { mkdir, readFile, readdir, writeFile } from 'fs/promises'
import extract from 'extract-zip'
import { parse } from 'node-html-parser'
import { AsyncArray } from '@liuli-util/async'
import simpleGit from 'simple-git'
import { pathExists } from 'fs-extra'
import { XMLValidator } from 'fast-xml-parser'

const tempPath = initTempPath(__filename)

// TODO 需要改善—，使用虚拟文件而不是不可重现的文件作为测试用例
it.skip('generate', async () => {
  await convert({
    input: local.input({
      path: path.resolve(__dirname, './assets/books/01/'),
    }),
    output: output({
      path: path.resolve(tempPath, './01.epub'),
      id: 'to-the-stars-01',
      title: '第一卷-量子纠缠',
      cover: path.resolve(__dirname, './assets/books/01/assets/cover.png'),
      creator: 'Hieronym',
      publisher: 'rxliuli',
      language: 'zh-CN',
    }),
  })
})

// TODO 需要改善，使用虚拟文件而不是不可重现的文件作为测试用例
it.skip('multi-level', async () => {
  await convert({
    input: local.input({
      path: path.resolve(__dirname, './assets/books/'),
    }),
    output: output({
      path: path.resolve(tempPath, './01.epub'),
      id: 'to-the-stars',
      title: '魔法少女小圆-飞向星空',
      cover: path.resolve(__dirname, './assets/books/01/assets/cover.png'),
      creator: 'Hieronym',
      publisher: 'rxliuli',
      language: 'zh-CN',
    }),
  })
})

const metadata: Omit<EpubOutputConfig, 'path'> = {
  id: 'to-the-stars-01',
  title: '第一卷-量子纠缠',
  creator: 'Hieronym',
  publisher: 'rxliuli',
  language: 'zh-CN',
}

it('no cover', async () => {
  await convert({
    input: fromVirtual([
      {
        id: '01',
        path: '01.md',
        content: '# 第一章',
      },
    ]),
    output: output({
      ...metadata,
      path: path.resolve(tempPath, './01.epub'),
    }),
  })
})

it('cover is not absolute path', async () => {
  await convert({
    input: fromVirtual([
      {
        id: '01',
        path: '01.md',
        content: '# 第一章',
      },
    ]),
    output: output({
      ...metadata,
      path: path.resolve(tempPath, './01.epub'),
      root: path.resolve(__dirname, './assets/books/01/'),
    }),
  })
})

it('cover not exisit', async () => {
  await expect(
    convert({
      input: fromVirtual([
        {
          id: '01',
          path: '01.md',
          content: '# 第一章',
        },
      ]),
      output: output({
        ...metadata,
        cover: './cover.png',
        path: path.resolve(tempPath, './01.epub'),
        root: path.resolve(__dirname, './assets/books/01/'),
      }),
    }),
  ).rejects.toThrowError()
})

it('Should read readme yaml meta', async () => {
  const outputPath = path.resolve(tempPath, './01.epub')
  await convert({
    input: fromVirtual([
      {
        id: 'readme',
        path: 'readme.md',
        content: trimMarkdown(`
        ---
        book:
          id: test 2
          title: test 2
          creator: test 2
          publisher: test 2
          language: test 2
        ---
        # test 2
      `),
      },
    ]),
    output: output({
      path: outputPath,
      id: 'test 1',
      title: 'test 1',
      creator: 'test 1',
      publisher: 'test 1',
      language: 'test 1',
    }),
  })
  await extract(outputPath, { dir: path.resolve(tempPath, 'dist') })
  const $dom = parse(await readFile(path.resolve(tempPath, 'dist/content.opf'), 'utf-8'))
  expect($dom.getElementsByTagName('dc:identifier')[0].textContent).eq('test 2')
  expect($dom.getElementsByTagName('dc:title')[0].textContent).eq('test 2')
  expect($dom.getElementsByTagName('dc:creator')[0].textContent).eq('test 2')
  expect($dom.getElementsByTagName('dc:publisher')[0].textContent).eq('test 2')
  expect($dom.getElementsByTagName('dc:language')[0].textContent).eq('test 2')
})

it('Should read readme cover yaml meta', async () => {
  const outputPath = path.resolve(tempPath, './01.epub')
  await writeFile(
    path.resolve(tempPath, 'readme.md'),
    trimMarkdown(`
  ---
  book:
    cover: ./assets/cover.jpg
  ---
  # test
`),
  )
  await mkdir(path.resolve(tempPath, './assets'))
  await writeFile(path.resolve(tempPath, './assets/cover.jpg'), trimMarkdown('test'))
  await convert({
    input: local.input({
      path: tempPath,
    }),
    output: output({
      path: outputPath,
    }),
  })
  await extract(outputPath, { dir: path.resolve(tempPath, 'dist') })
  const distCoverPath = path.resolve(
    path.resolve(tempPath, 'dist/Media/'),
    (await readdir(path.resolve(tempPath, 'dist/Media/')))[0],
  )
  expect(await readFile(distCoverPath, 'utf-8')).eq('test')
})

it('Should support break line', async () => {
  const outputPath = path.resolve(tempPath, './01.epub')
  await convert({
    input: fromVirtual([
      {
        id: '01',
        path: '01.md',
        content: '# 第一章\n\n第一行\n第二行',
      },
    ]),
    output: output({
      path: outputPath,
      ...metadata,
    }),
  })
  await extract(outputPath, { dir: path.resolve(tempPath, 'dist') })
  const text = await readFile(path.resolve(tempPath, 'dist/Text/01.xhtml'), 'utf-8')
  expect(text.replaceAll('\n', '')).includes('第一行<br />第二行')
})

it('Should escape footnote boolean attributes as valid XHTML', async () => {
  const outputPath = path.resolve(tempPath, './footnote.epub')
  await convert({
    input: fromVirtual([
      {
        id: 'fn',
        path: 'fn.md',
        content: '# 第一章\n\n这是一个脚注[^1]\n\n[^1]: 脚注内容',
      },
    ]),
    output: output({
      path: outputPath,
      ...metadata,
    }),
  })
  const distPath = path.resolve(tempPath, 'dist-footnote')
  await extract(outputPath, { dir: distPath })
  const text = await readFile(path.resolve(distPath, 'Text/fn.xhtml'), 'utf-8')

  // 属性应带有空字符串值，而不是没有值的裸属性
  expect(text).toContain('data-footnote-ref=""')
  expect(text).toContain('data-footnotes=""')
  // 不应该出现无值的裸属性（合法 HTML5，但不合法 XML）
  expect(text).not.toMatch(/\bdata-footnote-ref\b(?!=)/)
  expect(text).not.toMatch(/\bdata-footnotes\b(?!=)/)

  expect(XMLValidator.validate(text)).eq(true)
})

it('Should generate well-formed XML for all xhtml/opf/container.xml files', async () => {
  const outputPath = path.resolve(tempPath, './well-formed.epub')
  await convert({
    input: fromVirtual([
      {
        id: 'fn',
        path: 'fn.md',
        content: '# 第一章\n\n这是一个脚注[^1]\n\n[^1]: 脚注内容',
      },
      {
        id: '02',
        path: '02.md',
        content: '# 第二章\n\n第一行\n第二行',
      },
    ]),
    output: output({
      path: outputPath,
      ...metadata,
    }),
  })
  const distPath = path.resolve(tempPath, 'dist-well-formed')
  await extract(outputPath, { dir: distPath })

  const files = await readdir(distPath, { recursive: true })
  const xmlFiles = files.filter((it) => /\.(xhtml|opf)$/.test(it) || it.endsWith('container.xml'))
  expect(xmlFiles.length).greaterThan(0)
  for (const file of xmlFiles) {
    const content = await readFile(path.resolve(distPath, file), 'utf-8')
    expect(XMLValidator.validate(content), `${file} should be well-formed XML`).eq(true)
  }
})

it('Should escape special characters (& and <) in title while staying well-formed XML', async () => {
  const outputPath = path.resolve(tempPath, './special-chars.epub')
  await convert({
    input: fromVirtual([
      {
        id: 'sp',
        path: 'sp.md',
        content: '# 标题 & <特殊字符>\n\n正文内容',
      },
    ]),
    output: output({
      path: outputPath,
      ...metadata,
      id: 'id & <special>',
      title: '书名 & <special>',
    }),
  })
  const distPath = path.resolve(tempPath, 'dist-special-chars')
  await extract(outputPath, { dir: distPath })

  const contentOpf = await readFile(path.resolve(distPath, 'content.opf'), 'utf-8')
  expect(contentOpf).toContain('<dc:title>书名 &amp; &lt;special&gt;</dc:title>')
  expect(XMLValidator.validate(contentOpf)).eq(true)

  const navXhtml = await readFile(path.resolve(distPath, 'Text/nav.xhtml'), 'utf-8')
  expect(navXhtml).toContain('标题 &amp; &lt;特殊字符&gt;')
  expect(XMLValidator.validate(navXhtml)).eq(true)

  const chapterXhtml = await readFile(path.resolve(distPath, 'Text/sp.xhtml'), 'utf-8')
  expect(chapterXhtml).toContain('<title>标题 &amp; &lt;特殊字符&gt;</title>')
  expect(XMLValidator.validate(chapterXhtml)).eq(true)
})

describe.skip('Should render pmas', async () => {
  const outputPath = path.resolve(tempPath, './01.epub')
  let srcPath: string
  beforeEach(async () => {
    srcPath = path.resolve('/Users/rxliuli/code/web/pmas/books/zh-CN/')
    await convert({
      input: local.input({ path: srcPath }),
      output: output({
        path: outputPath,
        ...metadata,
      }),
    })
    await extract(outputPath, { dir: path.resolve(tempPath, 'dist') })
  })
  it('渲染之后不会有 **', async () => {
    const errorList = await AsyncArray.flatMap(await readdir(path.resolve(tempPath, 'dist/Text')), async (it) => {
      const s = await readFile(path.resolve(tempPath, 'dist/Text', it), 'utf-8')
      if (!s.includes('**')) {
        return []
      }
      return /^.*\*\*.*$/m.exec(s) ?? []
    })
    expect(errorList).deep.eq([])
  })
  it('渲染之后粗体两侧不会有多余的空格', async () => {
    const errorList = await AsyncArray.flatMap(await readdir(path.resolve(tempPath, 'dist/Text')), async (it) => {
      const s = await readFile(path.resolve(tempPath, 'dist/Text', it), 'utf-8')
      if (!s.includes(' <strong>') && !s.includes('</strong> ')) {
        return []
      }
      return [...(/^(?!.*\/>) <strong>.*$/gm.exec(s) ?? []), ...(/^(?!.*\/>).*<\/strong> .*$/gm.exec(s) ?? [])]
    })
    expect(errorList).deep.eq([])
  })
  it('渲染之后不会有 _', async () => {
    const errorList = await AsyncArray.flatMap(await readdir(path.resolve(tempPath, 'dist/Text')), async (it) => {
      const $dom = parse(await readFile(path.resolve(tempPath, 'dist/Text', it), 'utf-8'))
      $dom.querySelectorAll('a').forEach((it) => it.remove())
      const s = $dom.innerText
      if (!s.includes('_')) {
        return []
      }
      return /^.*_.*$/m.exec(s) ?? []
    })
    expect(errorList).deep.eq([])
  })
  it('渲染之后斜体两侧不会有多余的空格', async () => {
    const errorList = await AsyncArray.flatMap(await readdir(path.resolve(tempPath, 'dist/Text')), async (it) => {
      const s = await readFile(path.resolve(tempPath, 'dist/Text', it), 'utf-8')
      if (!s.includes(' <em>') && !s.includes('</em> ')) {
        return []
      }
      return [...(/^.* <em>.*$/m.exec(s) ?? []), ...(/^.*<\/em> .*$/m.exec(s) ?? [])]
    })
    expect(errorList).deep.eq([])
  })
})
