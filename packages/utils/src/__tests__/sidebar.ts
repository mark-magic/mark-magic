import { expect, it } from 'vitest'
import { sortChapter, treeSidebarByPath } from '../sidebar'

it('sortChapter', () => {
  expect(sortChapter([{ path: '001.md' }, { path: 'readme.md' }]).map((it) => it.path)).deep.eq(['readme.md', '001.md'])
  expect(sortChapter([{ path: '01/001.md' }, { path: '01/readme.md' }]).map((it) => it.path)).deep.eq([
    '01/readme.md',
    '01/001.md',
  ])
  expect(sortChapter([{ path: '01/001.md' }, { path: '01/index.md' }]).map((it) => it.path)).deep.eq([
    '01/index.md',
    '01/001.md',
  ])
  expect(
    sortChapter([
      { path: '01/001.md' },
      { path: '01/readme.md' },
      { path: '02/017-幕间-1-无间迷梦.md' },
      { path: '02/readme.md' },
      { path: 'cover' },
    ]).map((it) => it.path),
  ).deep.eq(['cover', '01/readme.md', '01/001.md', '02/readme.md', '02/017-幕间-1-无间迷梦.md'])
})

it('treeSidebarByPath', () => {
  expect(treeSidebarByPath([{ path: '001.md' }, { path: 'readme.md' }])).deep.eq([{ path: '001.md' }])

  expect(
    treeSidebarByPath([
      { path: '01/001.md' },
      { path: '01/readme.md' },
      { path: '02/017-幕间-1-无间迷梦.md' },
      { path: '02/readme.md' },
    ]),
  ).deep.eq([
    { path: '01/readme.md', children: [{ path: '01/001.md' }] },
    { path: '02/readme.md', children: [{ path: '02/017-幕间-1-无间迷梦.md' }] },
  ])
})
