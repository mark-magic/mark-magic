import { it, beforeEach, expect } from 'vitest'
import path from 'path'
import { v4 } from 'uuid'
import { initTempPath } from '@liuli-util/test'
import { EpubBuilder, renderNavXML } from '../EpubBuilder'
import { mkdir, readFile, writeFile } from 'fs/promises'
import JSZip from 'jszip'
import { pathExists } from '@liuli-util/fs'

const tempPath = initTempPath(__filename)
let builder: EpubBuilder

beforeEach(async () => {
  builder = new EpubBuilder()
})

async function extractZipToFolder(zip: JSZip, folderPath: string): Promise<void> {
  let promises: (() => Promise<any>)[] = []
  zip.forEach((relativePath, zipEntry) => {
    let outputPath = path.join(folderPath, relativePath)
    if (zipEntry.dir) {
      promises.push(async () => {
        if (!(await pathExists(outputPath))) {
          await mkdir(outputPath, { recursive: true })
        }
      })
    } else {
      promises.push(async () => {
        const dirPath = path.dirname(outputPath)
        if (!(await pathExists(dirPath))) {
          await mkdir(path.dirname(outputPath), { recursive: true })
        }
        await writeFile(outputPath, await zip.file(relativePath)!.async('nodebuffer'))
      })
    }
  })
  await Promise.all(promises.map((it) => it()))
}

it('basic', async () => {
  const zip = builder.gen({
    metadata: {
      id: v4(),
      title: '第一卷-量子纠缠',
      cover: 'cover.jpg',
      creator: 'Hieronym',
      publisher: 'rxliuli',
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
          <image width="1352" height="2000" xlink:href="../Media/cover.jpg" />
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
    media: [
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

  await extractZipToFolder(zip, path.resolve(tempPath, 'dist'))
  await writeFile(path.resolve(tempPath, 'test.epub'), await zip.generateAsync({ type: 'nodebuffer' }))
})

it('multi-level toc', async () => {
  const zip = builder.gen({
    metadata: {
      id: v4(),
      title: '魔法少女小圆 飞向星空',
      cover: 'cover.jpg',
      creator: 'Hieronym',
      publisher: 'rxliuli',
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
          <image width="1352" height="2000" xlink:href="../Media/cover.jpg" />
        </svg>`,
      },
      {
        id: '01-readme',
        title: '第一卷-量子纠缠',
        content: `<p><i>“上帝不掷骰子。”</i></p>
          <p><strong>—— 阿尔伯特・爱因斯坦</strong></p>`,
      },
      {
        id: '01-001',
        title: '第一章-许愿',
        content: `<p>虽然出于伦理方面的考虑，我们必须针对许愿的后果和责任进行一些基本的指导，但此类指导必须要限制在符合人类社会整体利益的程度。教师不得透露 Incubator 系统在教学大纲以外的任何信息。这一限制将持续到学生超出契约年龄为止，通常认为是 20 岁。虽然对学生的关心是可贵的，但保持沉默是您作为一名公民不可推卸的责任。违反这一规定的教师将立即撤职并依法提起公诉……</p>`,
      },
      {
        id: '02-readme',
        title: '第二卷-宇宙膨胀',
        content: `<p><i>“宇宙是如此的广阔而悠远。相形之下，要想评价某个人一生的价值，就只有看他做出了多大的牺牲。”</i></p>
        <p><strong>—— 维维安・罗斯瓦恩，不列颠战役中阵亡的英国皇家空军飞行员</strong></p>`,
      },
      {
        id: '02-017',
        title: '幕间-1-无间迷梦',
        content: `<p>“香港那里肯定是出了什么事情。当地警方确信，有人正在试图介入三合会的活动。在过去的一年里出现了很多死亡或者失踪的底层罪犯，都是三合会背景的人。甚至连三个头目也遭到了类似的下场。中国东部沿海的各个角落都发生过类似的案件，但主要集中的位置还是香港市内，倒也算合乎情理。执法部门对这一结果感到相当满意，虽然他们或许并不赞同这种手法。尽管如此，还是有人私下里在担心着暴力的蔓延。”</p>`,
      },
    ],
    media: [
      {
        id: 'cover.jpg',
        buffer: await readFile(path.resolve(__dirname, 'assets/cover.jpg')),
      },
    ],
    toc: [
      {
        id: v4(),
        chapterId: '01-readme',
        title: '第一卷-量子纠缠',
        children: [
          {
            id: v4(),
            chapterId: '01-001',
            title: '第一章-许愿',
          },
        ],
      },
      {
        id: v4(),
        chapterId: '02-readme',
        title: '第二卷-宇宙膨胀',
        children: [
          {
            id: v4(),
            chapterId: '02-017',
            title: '幕间-1-无间迷梦',
          },
        ],
      },
    ],
  })
  await extractZipToFolder(zip, path.resolve(tempPath, 'dist'))
  await writeFile(path.resolve(tempPath, 'test.epub'), await zip.generateAsync({ type: 'nodebuffer' }))
})

it('tree sidebar renderer', () => {
  const r = renderNavXML([
    {
      chapterId: '01-readme',
      title: '第一卷-量子纠缠',
      children: [
        {
          chapterId: '01-001',
          title: '第一章-许愿',
        },
      ],
    },
    {
      chapterId: '02-readme',
      title: '第二卷-宇宙膨胀',
      children: [
        {
          chapterId: '02-017',
          title: '幕间-1-无间迷梦',
        },
      ],
    },
  ])
  console.log(r)
  expect(r)
    .includes('<a href="Text/01-readme.xhtml">第一卷-量子纠缠</a>')
    .includes('<a href="Text/01-001.xhtml">第一章-许愿</a>')
    .includes('<a href="Text/02-readme.xhtml">第二卷-宇宙膨胀</a>')
    .includes('<a href="Text/02-017.xhtml">幕间-1-无间迷梦</a>')
  expect(r.match(new RegExp('<ol>', 'g'))!.length).eq(3)
})
