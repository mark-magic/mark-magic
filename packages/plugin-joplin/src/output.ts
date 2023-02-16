import { AsyncArray, concatMap } from '@liuli-util/async'
import { Note, OutputPlugin } from '@mami/cli'
import { Config, config, tagApi, resourceApi, noteApi, folderApi } from 'joplin-api'
import { keyBy, pick } from 'lodash-es'
import { fromMarkdown, Link, Root, toMarkdown, visit, Image } from '@liuli-util/markdown-util'
import path from 'path'
import { mkdirp, remove } from '@liuli-util/fs-extra'
import { fileURLToPath } from 'url'
import { BiMultiMap } from '@mami/utils'
import { ValuesType } from 'utility-types'

async function createTags(note: Note, tags: Map<string, string>) {
  await AsyncArray.forEach(
    note.tags,
    concatMap(async (item) => {
      if (tags.has(item.id)) {
        return
      }
      try {
        const r = await tagApi.create({ title: item.title })
        tags.set(item.id, r.id)
      } catch {}
    }),
  )
}

async function createResources(note: Note, resources: Map<string, string>) {
  const tempPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.temp')
  await mkdirp(tempPath)
  await AsyncArray.forEach(
    note.resources,
    concatMap(async (item) => {
      if (resources.has(item.id)) {
        return
      }
      const r = await resourceApi.create({
        title: item.title,
        data: new Blob([item.raw]),
        filename: item.title,
      })
      resources.set(item.id, r.id)
    }),
  )
  await remove(tempPath)
}

async function createDirs(note: Note, dirs: Map<string, string>): Promise<string> {
  let dir = ''
  for (const item of note.path) {
    const prev = dir
    dir += '/' + item
    // console.log('createDirs', dir, dirs.get(prev))
    if (dirs.has(dir)) {
      continue
    }
    const r = await folderApi.create({ title: item, parent_id: dirs.get(prev)! })
    // console.log('createDirs.return', r.id, dirs)
    dirs.set(dir, r.id)
  }
  return dirs.get(dir)!
}

async function createNote(note: Note, parentId: string): Promise<string> {
  // console.log(note, parentId)
  const r = await noteApi.create({
    title: note.title,
    body: note.content,
    user_created_time: note.createAt,
    user_updated_time: note.updateAt,
    parent_id: parentId,
  })
  return r.id
}
async function bindTags(note: Note, id: string, tags: Map<string, string>) {
  await AsyncArray.forEach(
    note.tags.map((item) => tags.get(item.id)!),
    async (tagId) => {
      try {
        await tagApi.addTagByNoteId(tagId, id)
      } catch {}
    },
  )
}

function formatRelative(s: string): string {
  const prefix = ['./', '../']
  const r = s.replaceAll('\\', '/')
  return encodeURI(prefix.some((i) => r.startsWith(i)) ? r : './' + r)
}

export function convertLinks({
  root,
  note,
  noteMap,
  resourceMap,
}: {
  root: Root
  note: { resources: Pick<ValuesType<Note['resources']>, 'id' | 'title'>[] }
  noteMap: BiMultiMap<string, string>
  resourceMap: BiMultiMap<string, string>
}) {
  const urls: (Image | Link)[] = []
  visit(root, (node) => {
    if (['image', 'link'].includes(node.type) && (node as Link).url.startsWith(':/')) {
      urls.push(node as Link)
    }
  })
  const map = keyBy(note.resources, (item) => item.id)
  let isAfter = false
  urls.forEach((item) => {
    const id = item.url.slice(2)
    const resource = map[id]
    if (resource) {
      item.url = `:/${resourceMap.get(id)}`
    } else {
      if (!noteMap.has(id)) {
        isAfter = true
        return
      }
      item.url = `:/${noteMap.get(id)!}`
    }
  })
  return isAfter
}

export function output(options: Config): OutputPlugin {
  Object.assign(config, pick(options, 'baseUrl', 'token'))
  const tags = new Map<string, string>(),
    dirs = new Map<string, string>(),
    noteMap = new BiMultiMap<string, string>(),
    resourceMap = new BiMultiMap<string, string>(),
    afterList: Note[] = []
  return {
    name: 'joplin',
    async handle(note) {
      // console.log('handle: ', note.title)
      await Promise.all([createTags(note, tags), createResources(note, resourceMap)])
      // console.log('createDirs')
      const parentId = await createDirs(note, dirs)
      // console.log('convert link')
      const root = fromMarkdown(note.content)
      const isAfter = convertLinks({ root, note, noteMap, resourceMap })
      if (isAfter) {
        afterList.push(note)
      }
      // console.log('create note')
      const id = await createNote({ ...note, content: toMarkdown(root) }, parentId)
      noteMap.set(note.id, id)
      // console.log('bind tags')
      await bindTags(note, id, tags)
      // console.log('end')
    },
    async end() {
      await AsyncArray.forEach(afterList, async (note) => {
        const root = fromMarkdown(note.content)
        convertLinks({ note, root, noteMap, resourceMap })
        await noteApi.update({ id: noteMap.get(note.id)!, body: toMarkdown(root) })
      })
    },
  }
}
