import { describe, expect, it } from 'vitest'
import { bilibiliReadList, renderBilibiliOpus } from '../bilibiliReadList'
import { convert } from '@mark-magic/core'
import * as local from '@mark-magic/plugin-local'
import { initTempPath } from '@liuli-util/test'
import { readdir, writeFile } from 'fs/promises'
import { readJson } from 'fs-extra/esm'
import path from 'pathe'
import { AsyncArray } from '@liuli-util/async'

const tempPath = initTempPath(__filename)

it.skip('bilibiliReadList for rl614127', async () => {
  await convert({
    input: bilibiliReadList({ url: 'https://www.bilibili.com/read/readlist/rl614127' }),
    output: local.output({ path: tempPath }),
  }).on('generate', (it) => {
    console.log(it.content.name)
  })
})

it.skip('bilibiliReadList for rl794874', async () => {
  await convert({
    input: bilibiliReadList({ url: 'https://www.bilibili.com/read/readlist/rl794874' }),
    output: local.output({ path: tempPath }),
  }).on('generate', (it) => {
    console.log(it.content.name)
  })
})

describe('renderBilibiliOpus', () => {
  it('text', () => {
    const r = renderBilibiliOpus([
      {
        para_type: 1,
        text: {
          nodes: [
            {
              node_type: 1,
              word: {
                words: '拯救世界还是拯救一个女孩——这真的有差别吗？你或许拥有难以想象的力量，但总有一些事情依旧艰难。',
              },
            },
          ],
        },
      },
    ])
    expect(r.trim()).eq('拯救世界还是拯救一个女孩——这真的有差别吗？你或许拥有难以想象的力量，但总有一些事情依旧艰难。')
  })
  it('link', () => {
    const r = renderBilibiliOpus([
      {
        para_type: 1,
        text: {
          nodes: [
            {
              node_type: 4,
              link: {
                show_text: 'Puella Magi Adfligo Systema',
                link: 'https://forums.sufficientvelocity.com/threads/2538/',
                link_type: 16,
              },
            },
          ],
        },
      },
    ])
    expect(r.trim()).eq('[Puella Magi Adfligo Systema](https://forums.sufficientvelocity.com/threads/2538/)')
  })
  it('image', () => {
    const r = renderBilibiliOpus([
      {
        para_type: 2,
        pic: {
          pics: [
            {
              url: 'https://i0.hdslb.com/bfs/new_dyn/eac5a4776cab018a92744801d75b5c747138889.png',
              width: 1450,
              height: 498,
              size: 198.7548828125,
            },
          ],
          style: 1,
        },
      },
    ])
    expect(r.trim()).eq('![image](https://i0.hdslb.com/bfs/new_dyn/eac5a4776cab018a92744801d75b5c747138889.png)')
  })
  it('bold', () => {
    const r = renderBilibiliOpus([
      {
        para_type: 1,
        text: {
          nodes: [
            {
              node_type: 1,
              word: {
                words: ' 之后吾辈最喜欢的魔法少女小圆同人，原作已经超过 800 章。讲述了一个女孩许下了控制',
              },
            },
            {
              node_type: 1,
              word: {
                words: '悲伤',
                style: {
                  bold: true,
                },
              },
            },
            {
              node_type: 1,
              word: {
                words:
                  '的愿望，她会如何开始改变魔法少女们悲惨的命运呢？ 这个翻译使用 GPT-4 初翻 + 人工校对，目前没能联系到原作者，任何翻译问题请到 ',
              },
            },
          ],
        },
      },
    ])
    expect(r.trim()).eq(
      '之后吾辈最喜欢的魔法少女小圆同人，原作已经超过 800 章。讲述了一个女孩许下了控制**悲伤**的愿望，她会如何开始改变魔法少女们悲惨的命运呢？ 这个翻译使用 GPT-4 初翻 + 人工校对，目前没能联系到原作者，任何翻译问题请到',
    )
  })
  it('text and link', () => {
    const r = renderBilibiliOpus([
      {
        para_type: 1,
        text: {
          nodes: [
            {
              node_type: 1,
              word: {
                words: '原作 ',
              },
            },
            {
              node_type: 4,
              link: {
                show_text: 'Puella Magi Adfligo Systema',
                link: 'https://forums.sufficientvelocity.com/threads/2538/',
                link_type: 16,
              },
            },
            {
              node_type: 1,
              word: {
                words: '，作者 ',
              },
            },
          ],
        },
      },
    ])
    expect(r.trim()).eq('原作 [Puella Magi Adfligo Systema](https://forums.sufficientvelocity.com/threads/2538/)，作者')
  })
  it('list', () => {
    const r = renderBilibiliOpus([
      {
        para_type: 6,
        format: {
          list_format: {
            level: 1,
            order: 1,
          },
        },
        text: {
          nodes: [
            {
              node_type: 1,
              word: {
                words: '[ ] 许愿吧。',
              },
            },
          ],
        },
      },
    ])
    expect(r.trim()).eq('- [ ] 许愿吧。')
  })
  it('blockquote', () => {
    const r = renderBilibiliOpus([
      {
        para_type: 4,
        text: {
          nodes: [
            {
              node_type: 1,
              word: {
                words: '我想要一个朋友。',
              },
            },
          ],
        },
      },
    ])
    expect(r.trim()).eq('> 我想要一个朋友。')
  })
  it('list ident', () => {
    const r = renderBilibiliOpus([
      {
        para_type: 6,
        format: { list_format: { level: 1, order: 1 } },
        text: {
          nodes: [
            {
              node_type: 1,
              word: { words: '[ ] 介绍自己' },
            },
          ],
        },
      },
      {
        para_type: 6,
        format: { list_format: { level: 2, order: 1 } },
        text: {
          nodes: [
            {
              node_type: 1,
              word: {
                words: '[ ] 填入你的名字。',
              },
            },
          ],
        },
      },
      {
        para_type: 6,
        format: { list_format: { level: 2, order: 2 } },
        text: {
          nodes: [
            {
              node_type: 1,
              word: {
                words: '[ ] 选择你的语气（冷静、友好、开朗等）。',
              },
            },
          ],
        },
      },
      {
        para_type: 6,
        format: { list_format: { level: 2, order: 3 } },
        text: {
          nodes: [
            {
              node_type: 1,
              word: {
                words: '[ ] 决定你想透露多少信息（比如你是否知道她们的名字等）。',
              },
            },
          ],
        },
      },
      {
        para_type: 6,
        format: { list_format: { level: 1, order: 2 } },
        text: {
          nodes: [
            {
              node_type: 1,
              word: { words: '[ ] 离开' },
            },
          ],
        },
      },
      {
        para_type: 6,
        format: { list_format: { level: 2, order: 1 } },
        text: {
          nodes: [
            {
              node_type: 1,
              word: { words: '[ ] 是否道别？' },
            },
          ],
        },
      },
      {
        para_type: 6,
        format: { list_format: { level: 2, order: 2 } },
        text: {
          nodes: [
            {
              node_type: 1,
              word: {
                words: '[ ] 填入你的名字。',
              },
            },
          ],
        },
      },
      {
        para_type: 6,
        format: { list_format: { level: 2, order: 3 } },
        text: {
          nodes: [
            {
              node_type: 1,
              word: {
                words: '[ ] 选择你的语气（冷静、友好、开朗等）。',
              },
            },
          ],
        },
      },
      {
        para_type: 6,
        format: { list_format: { level: 2, order: 4 } },
        text: {
          nodes: [
            {
              node_type: 1,
              word: {
                words: '[ ] 决定你想透露多少信息（比如你是否知道她们的名字等）。',
              },
            },
          ],
        },
      },
      {
        para_type: 6,
        format: { list_format: { level: 1, order: 3 } },
        text: {
          nodes: [
            {
              node_type: 1,
              word: { words: '[ ] 自定义行动' },
            },
          ],
        },
      },
      {
        para_type: 6,
        format: { list_format: { level: 2, order: 1 } },
        text: {
          nodes: [
            {
              node_type: 1,
              word: {
                words: '[ ] 填入你的名字。',
              },
            },
          ],
        },
      },
      {
        para_type: 6,
        format: { list_format: { level: 2, order: 2 } },
        text: {
          nodes: [
            {
              node_type: 1,
              word: {
                words: '[ ] 选择你的语气（冷静、友好、开朗等）。',
              },
            },
          ],
        },
      },
      {
        para_type: 6,
        format: { list_format: { level: 2, order: 3 } },
        text: {
          nodes: [
            {
              node_type: 1,
              word: {
                words: '[ ] 决定你想透露多少信息（比如你是否知道她们的名字等）。',
              },
            },
          ],
        },
      },
    ])
    console.log(r)
    expect(r.trim()).eq(
      [
        '- [ ] 介绍自己',
        '  - [ ] 填入你的名字。',
        '  - [ ] 选择你的语气（冷静、友好、开朗等）。',
        '  - [ ] 决定你想透露多少信息（比如你是否知道她们的名字等）。',
        '- [ ] 离开',
        '  - [ ] 是否道别？',
        '  - [ ] 填入你的名字。',
        '  - [ ] 选择你的语气（冷静、友好、开朗等）。',
        '  - [ ] 决定你想透露多少信息（比如你是否知道她们的名字等）。',
        '- [ ] 自定义行动',
        '  - [ ] 填入你的名字。',
        '  - [ ] 选择你的语气（冷静、友好、开朗等）。',
        '  - [ ] 决定你想透露多少信息（比如你是否知道她们的名字等）。',
      ].join('\n'),
    )
  })
  it('read real data', async () => {
    const list = await readdir(path.resolve(__dirname, './assets/bilibiliReadList'))
    await AsyncArray.forEach(list, async (it) =>
      writeFile(
        path.resolve(tempPath, path.basename(it, '.json') + '.md'),
        renderBilibiliOpus(await readJson(path.resolve(__dirname, './assets/bilibiliReadList', it))),
      ),
    )
  })
})

it.skip('fetch bilibiliReadList', async () => {
  const r = await fetch('https://api.bilibili.com/x/article/view?id=18626917', {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    },
  })
  console.log(await r.text())
})
