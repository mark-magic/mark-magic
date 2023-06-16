import { it, beforeEach } from 'vitest'
import path from 'path'
import { v4 } from 'uuid'
import { initTempPath } from '@liuli-util/test'
import { EpubBuilder } from '../EpubBuilder'
import { readFile, writeFile } from 'fs/promises'

const tempPath = initTempPath(__filename)
let builder: EpubBuilder

beforeEach(async () => {
  builder = new EpubBuilder()
})

it('gen', async () => {
  const zip = builder.gen({
    metadata: {
      id: v4(),
      title: '第一卷-量子纠缠',
      cover: 'cover.jpg',
      author: 'Hieronym',
      language: 'zh-CN',
    },
    text: [
      {
        id: 'cover',
        title: 'cover',
        content: `<svg
          xmlns="http://www.w3.org/2000/svg"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          version="1.1"
          viewBox="0 0 1352 2000"
          width="100%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <image width="1352" height="2000" xlink:href="../images/cover.jpg" />
        </svg>`,
      },
      {
        id: 'ch0001',
        title: '引言',
        content: `<p><i>“上帝不掷骰子。”</i></p>
          <p><strong>—— 阿尔伯特・爱因斯坦</strong></p>`,
      },
      {
        id: 'ch0002',
        title: '第一章 许愿',
        content: `<p>虽然出于伦理方面的考虑，我们必须针对许愿的后果和责任进行一些基本的指导，但此类指导必须要限制在符合人类社会整体利益的程度。教师不得透露 Incubator 系统在教学大纲以外的任何信息。这一限制将持续到学生超出契约年龄为止，通常认为是 20 岁。虽然对学生的关心是可贵的，但保持沉默是您作为一名公民不可推卸的责任。违反这一规定的教师将立即撤职并依法提起公诉……</p>`,
      },
    ],
    image: [
      {
        id: 'cover.jpg',
        buffer: await readFile(path.resolve(__dirname, 'assets/cover.jpg')),
      },
    ],
    toc: [
      {
        id: v4(),
        title: '第一章 许愿',
        chapterId: 'ch0002',
      },
    ],
  })
  await writeFile(path.resolve(tempPath, 'test.epub'), await zip.generateAsync({ type: 'nodebuffer' }))
})
