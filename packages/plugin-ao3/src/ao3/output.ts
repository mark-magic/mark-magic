import { Heading, Root, Text, flatMap, fromMarkdown, hastToHtml, mdToHast, select } from '@liuli-util/markdown-util'
import { OutputPlugin } from '@mark-magic/core'
import dayjs from 'dayjs'
import findCacheDirectory from 'find-cache-dir'
import { mkdirp, pathExists, readJson, writeJson } from 'fs-extra/esm'
import { last } from 'lodash-es'
import { parse } from 'node-html-parser'
import path from 'pathe'

interface Ao3OuputConfig {
  /**
   * 书籍 id，例如 https://archiveofourown.org/works/29943597/chapters/73705791 的 id 是 29943597
   */
  id: string
  /**
   * 在 ao3 网站后的 cookie，用于正确调用需要身份校验的接口
   */
  cookie: string
}

interface ChapterMeta {
  id: string
  name: string
}

export function extractChaptersFromHTML(html: string): ChapterMeta[] {
  const $dom = parse(html)
  const $chapters = $dom.querySelectorAll('#selected_id > option')
  if ($chapters.length === 0) {
    const $link = $dom.querySelector('.chapter > .title > a')
    if (!$link) {
      return []
    }
    const chapterId = $link.getAttribute('href')?.match(/\/chapters\/(\d+)/)?.[1]
    if (!chapterId) {
      throw new Error('无法提取章节标题')
    }
    const title = $link.textContent?.trim().match(/^\d+\. (.*)$/)?.[1]
    if (!title) {
      throw new Error('无法提取章节标题')
    }
    return [
      {
        id: chapterId,
        name: title,
      },
    ]
  }
  return Array.from($chapters).map(($it) => {
    const chapterId = $it.getAttribute('value')
    if (!chapterId) {
      throw new Error('无法提取章节标题')
    }
    const title = $it.textContent?.trim().match(/^\d+\. (.*)$/)?.[1]
    if (!title) {
      throw new Error('无法提取章节标题')
    }
    return {
      id: chapterId,
      name: title,
    } as ChapterMeta
  })
}

interface Ao3Chapter {
  /** 书籍 id */
  bookId: string
  /** ao3 章节 id */
  chapterId: string
  /** 标题 */
  name: string
  /** html 内容 */
  content: string
  /* 创建时间 */
  created: number
  /** 第几张 */
  index: number
}

export async function getUpdateAuthToken(
  options: {
    bookId: string
    chapterId?: string
  } & Pick<Ao3AuthOptions, 'cookie'>,
): Promise<string> {
  const html = await fetch(
    `https://archiveofourown.org/works/${options.bookId}${
      options.chapterId ? `/chapters/${options.chapterId}` : ''
    }/edit`,
    {
      headers: {
        cookie: options.cookie,
      },
    },
  ).then((r) => r.text())
  const authToken = parse(html).querySelector('meta[name="csrf-token"]')?.getAttribute('content')
  if (!authToken) {
    throw new Error('无法找到 csrf-token')
  }
  return authToken
}

export interface Ao3AuthOptions {
  cookie: string
  authenticityToken: string
}

/**
 * 更新 ao3 的单章
 * @param chapter
 * @param options
 */
export async function updateAo3Readme(
  chapter: Pick<Ao3Chapter, 'bookId' | 'name' | 'content'>,
  options: Ao3AuthOptions,
) {
  const url = `https://archiveofourown.org/works/${chapter.bookId}`
  const r = await fetch('https://archiveofourown.org/works/53445904', {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ja-JP;q=0.6,ja;q=0.5',
      'cache-control': 'max-age=0',
      'content-type': 'application/x-www-form-urlencoded',
      'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      cookie: options.cookie,
      Referer: 'https://archiveofourown.org/works/53445904/edit',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: new URLSearchParams({
      _method: 'patch',
      authenticity_token: options.authenticityToken,
      // 'work[rating_string]': 'Teen And Up Audiences',
      // 'work[archive_warning_strings][]': 'Graphic Depictions Of Violence',
      // 'work[fandom_string]': 'Mahou Shoujo Madoka Magika | Puella Magi Madoka Magica',
      // 'work[category_strings][]': 'F/F',
      // 'work[relationship_string]': '',
      // 'work[character_string]': '',
      // 'work[freeform_string]': '',
      // 'work[title]': '魔法少女悲伤系统',
      // 'work[author_attributes][ids][]': '15867060',
      // 'work[author_attributes][byline]': '',
      // TODO 不更新摘要
      // 'work[summary]': '',
      // 'work[notes]': '',
      // 'work[endnotes]': '',
      // 'work[collection_names]': '',
      // 'work[recipients]': '',
      // 'work[parent_work_relationships_attributes][0][url]': '',
      // 'work[parent_work_relationships_attributes][0][title]': '',
      // 'work[parent_work_relationships_attributes][0][author]': '',
      // 'work[parent_work_relationships_attributes][0][language_id]': '',
      // 'work[parent_work_relationships_attributes][0][translation]': '0',
      // 'work[series_attributes][id]': '',
      // 'work[series_attributes][title]': '',
      // 'chapters-options-show': '1',
      // 'work[wip_length]': '?',
      'work[chapter_attributes][title]': chapter.name,
      // 'work[backdate]': '0',
      // 'work[chapter_attributes][published_at(3i)]': '1',
      // 'work[chapter_attributes][published_at(2i)]': '2',
      // 'work[chapter_attributes][published_at(1i)]': '2024',
      // 'work[language_id]': '40',
      // 'work[work_skin_id]': '',
      // 'work[restricted]': '0',
      // 'work[moderated_commenting_enabled]': '0',
      // 'work[comment_permissions]': 'enable_all',
      'work[chapter_attributes][content]': chapter.content,
      post_button: 'Post',
    }),
    method: 'POST',
  })
  if (!r.ok) {
    throw new Error(`无法更新 ao3 章节 ${url}，状态码为 ${r.status}，${r.statusText}`)
  }
  const text = await r.text()
  if (!text.includes(chapter.name)) {
    throw new Error('更新失败 ' + chapter.name)
  }
  return text
}

export async function updateAo3Chapter(chapter: Ao3Chapter, options: { cookie: string; authenticityToken: string }) {
  const url = `https://archiveofourown.org/works/${chapter.bookId}/chapters/${chapter.chapterId}`
  const created = dayjs(chapter.created)
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      authority: 'archiveofourown.org',
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ja-JP;q=0.6,ja;q=0.5',
      'cache-control': 'max-age=0',
      cookie: options.cookie,
      dnt: '1',
      origin: 'https://archiveofourown.org',
      referer: 'https://archiveofourown.org/works/53445904/chapters/135275608/edit',
      'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    },
    body: new URLSearchParams({
      _method: 'patch',
      // 通过 https://archiveofourown.org/works/53445904/chapters/135275608/edit 接口获取
      authenticity_token: options.authenticityToken,
      'chapter[title]': chapter.name,
      'chapter[position]': chapter.index.toString(),
      // 'chapter[wip_length]': '2',
      'chapter[published_at(3i)]': created.get('D').toString(),
      'chapter[published_at(2i)]': (created.get('M') + 1).toString(),
      'chapter[published_at(1i)]': created.get('y').toString(),
      // 'chapter[author_attributes][ids][]': '15867060',
      'chapter[author_attributes][byline]': '',
      'chapter[summary]': '',
      'chapter[notes]': '',
      'chapter[endnotes]': '',
      'chapter[content]': chapter.content,
      post_without_preview_button: 'Post',
    }),
  })
  if (!r.ok) {
    throw new Error(`无法更新 ao3 章节 ${url}，状态码为 ${r.status}，${r.statusText}`)
  }
  const html = (await r.text()) as string
  if (!html.includes(chapter.name)) {
    // await writeFile(path.resolve(__dirname, 'update-error.html'), html)
    throw new Error('更新失败 ' + chapter.name)
  }
  return html
}

function splitTitleAndContent(root: Root): {
  title: string
  content: Root
} {
  const title = select('heading[depth=1]', root) as Heading | undefined
  if (!title) {
    throw new Error('无法找到标题')
  }
  const titleText = select('text', title) as Text | undefined
  if (!titleText) {
    throw new Error('无法找到标题')
  }
  flatMap(root, (it) => {
    if (it === title) {
      return []
    }
    return [it]
  })
  return {
    title: titleText.value,
    content: root,
  }
}

export async function deleteAo3Chapter(chapter: Pick<Ao3Chapter, 'bookId' | 'chapterId'>, options: Ao3AuthOptions) {
  const r = await fetch(`https://archiveofourown.org/works/${chapter.bookId}/chapters/${chapter.chapterId}`, {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ja-JP;q=0.6,ja;q=0.5',
      'cache-control': 'max-age=0',
      'content-type': 'application/x-www-form-urlencoded',
      'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      cookie: options.cookie,
      Referer: 'https://archiveofourown.org/works/53445904/chapters/135275608/edit',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: new URLSearchParams({
      _method: 'delete',
      authenticity_token: options.authenticityToken,
    }),
    method: 'POST',
  })
  if (!r.ok) {
    throw new Error(`无法删除 ao3 章节，状态码为 ${r.status}，${r.statusText}`)
  }
  const html = await r.text()
  return html
}

export async function getAddChapterToken(options: { cookie: string; bookId: string }) {
  const html = await fetch(`https://archiveofourown.org/works/${options.bookId}/chapters/new`, {
    headers: {
      cookie: options.cookie,
    },
  }).then((r) => r.text())
  const authToken = parse(html).querySelector('meta[name="csrf-token"]')?.getAttribute('content')
  if (!authToken) {
    throw new Error('无法找到 csrf-token')
  }
  return authToken
}

export async function addAo3Chapter(
  chapter: Omit<Ao3Chapter, 'chapterId'>,
  options: { cookie: string; authenticityToken: string },
) {
  const created = dayjs(chapter.created)
  const r = await fetch(`https://archiveofourown.org/works/${chapter.bookId}/chapters`, {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ja-JP;q=0.6,ja;q=0.5',
      'cache-control': 'max-age=0',
      'content-type': 'application/x-www-form-urlencoded',
      'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      cookie: options.cookie,
      Referer: 'https://archiveofourown.org/works/53445904/chapters/new',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: new URLSearchParams({
      authenticity_token: options.authenticityToken,
      'chapter[title]': chapter.name,
      'chapter[position]': chapter.index.toString(),
      // 'chapter[wip_length]': '?',
      'chapter[published_at(3i)]': created.get('D').toString(),
      'chapter[published_at(2i)]': (created.get('M') + 1).toString(),
      'chapter[published_at(1i)]': created.get('y').toString(),
      // 'chapter[author_attributes][ids][]': '15867060',
      'chapter[author_attributes][byline]': '',
      'chapter[summary]': '',
      'chapter[notes]': '',
      'chapter[endnotes]': '',
      'chapter[content]': chapter.content,
      post_without_preview_button: 'Post',
    }),
    method: 'POST',
  })
  if (!r.ok) {
    throw new Error(`无法添加 ao3 章节，状态码为 ${r.status}，${r.statusText}`)
  }
  const html = (await r.text()) as string
  if (!html.includes(chapter.name)) {
    throw new Error('添加失败 ' + chapter.name)
  }
  const item = extractChaptersFromHTML(html)[chapter.index - 1]
  if (item.name !== chapter.name) {
    throw new Error('查找到的章节名和期望的不一致')
  }
  return item.id
}

export function ao3(options: Ao3OuputConfig): OutputPlugin {
  let list: ChapterMeta[]
  let i = 0
  let cachePath: string = ''
  const authOptions: Ao3AuthOptions = {
    cookie: options.cookie,
    authenticityToken: '',
  }
  return {
    name: 'ao3',
    async start() {
      if (!options) {
        throw new Error('必须提供配置项')
      }
      if (!options.id) {
        throw new Error('必须提供 id')
      }
      if (!options.cookie) {
        throw new Error('必须提供 cookie')
      }
      const dir = findCacheDirectory({ name: '@mark-magic/plugin-ao3' })
      if (!dir) {
        throw new Error('无法找到缓存目录')
      }
      if (!options.id) {
        throw new Error('必须提供 id')
      }
      options.id = options.id.toString()
      cachePath = path.resolve(dir!, options.id)
      await mkdirp(cachePath)
      const first = await fetch(`https://archiveofourown.org/works/${options.id}`)
      if (!first.ok) {
        throw new Error('无法获取章节列表')
      }
      const html = await first.text()
      list = extractChaptersFromHTML(html)
      authOptions.authenticityToken = await getUpdateAuthToken({
        cookie: options.cookie,
        bookId: options.id,
      })
    },
    async handle(note) {
      if (last(note.path) === 'readme.md') {
        return
      }
      const chapterId = list[i]?.id
      let fsPath = path.resolve(cachePath, (chapterId ?? options.id) + '.json')
      // 查找缓存
      if (chapterId && (await pathExists(fsPath))) {
        const map = (await readJson(fsPath)) as Ao3Chapter
        if (map.content === note.content && map.name === note.name) {
          i++
          console.log('cache hit', note.name)
          return
        }
      }
      const { title, content } = splitTitleAndContent(fromMarkdown(note.content))
      const chapter: Ao3Chapter = {
        bookId: options.id,
        chapterId,
        name: title,
        content: hastToHtml(mdToHast(content)!),
        created: note.created,
        index: i + 1,
      }
      if (!chapterId) {
        // 如果找不到任何章节并且处于第一章，意味着需要更新书籍元数据以更新第一章。如果是第二章及之后，直接添加新章节即可
        if (i === 0) {
          await updateAo3Readme(chapter, authOptions)
        } else {
          const addChapterId = await addAo3Chapter(chapter, authOptions)
          fsPath = path.resolve(cachePath, addChapterId + '.json')
        }
      } else {
        // 如果找到了章节，但只找到了一章，那么还必须更新书籍元数据
        if (list.length === 1 && i === 0) {
          await updateAo3Readme(chapter, authOptions)
        }
        await updateAo3Chapter(chapter, authOptions)
      }
      await writeJson(fsPath, {
        bookId: chapter.bookId,
        chapterId: chapter.chapterId,
        name: note.name,
        content: note.content,
        created: note.created,
        index: i + 1,
      } as Ao3Chapter)
      i++
    },
    async end() {
      const others = list.slice(i + 1)
      if (others.length === 0) {
        return
      }
      if (i === 0) {
        return
      }
      return
      // console.warn('删除多余章节', others)
      for (const { id } of others) {
        await deleteAo3Chapter(
          {
            bookId: options.id,
            chapterId: id,
          },
          authOptions,
        )
      }
    },
  }
}
