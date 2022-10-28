import { AsyncArray, concatMap } from '@liuli-util/async'
import { Note, OutputPlugin } from '@mami/cli'
import { Config, config, tagApi, resourceApi, noteApi, folderApi } from 'joplin-api'
import { pick } from 'lodash-es'
import { fromMarkdown, toMarkdown } from '@liuli-util/markdown-util'
import { convertLinks } from './utils/convertLinks'
import { BiMultiMap } from './utils/BiMultiMap'
import path from 'path'
import { mkdirp, readFile, remove, writeFile } from '@liuli-util/fs-extra'
import { fileURLToPath } from 'url'

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
      const fsPath = path.resolve(tempPath, path.basename(item.title))
      await writeFile(fsPath, item.raw)
      try {
        const r = await resourceApi.create({ title: item.title, data: new Blob([await readFile(fsPath)]) })
        resources.set(item.id, r.id)
      } finally {
        await remove(fsPath)
      }
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
      await Promise.all([createTags(note, tags), createResources(note, resourceMap)])
      const parentId = await createDirs(note, dirs)
      const root = fromMarkdown(note.content)
      const isAfter = convertLinks({ root, note, noteMap, resourceMap })
      if (isAfter) {
        afterList.push(note)
      }
      const id = await createNote({ ...note, content: toMarkdown(root) }, parentId)
      noteMap.set(note.id, id)
      await bindTags(note, id, tags)
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
