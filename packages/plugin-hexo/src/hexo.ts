import { AsyncArray } from '@liuli-util/async'
import { mkdirp, writeFile } from '@liuli-util/fs-extra'
import path from 'path'
import type { ConvertConfig, OutputPlugin } from '@mami/cli'
import { fromMarkdown, toMarkdown } from '@liuli-util/markdown-util'
import { addMeta } from './utils/addMeta'
import { convertLinks } from './utils/convertLinks'

export function hexo(options?: { root?: string }): OutputPlugin {
  let config: ConvertConfig, _postsPath: string, resourcePath: string
  return {
    name: 'hexoOutput',
    async start() {
      const root = options?.root ?? path.resolve()
      _postsPath = path.resolve(root, 'source/_posts')
      resourcePath = path.resolve(root, 'source/resources')
      await mkdirp(_postsPath)
      await mkdirp(resourcePath)
    },
    async handle(note) {
      const root = fromMarkdown(note.content)
      addMeta(root, note)
      convertLinks(root, note)
      await writeFile(path.resolve(_postsPath, note.id + '.md'), toMarkdown(root))
      await AsyncArray.forEach(note.resources, async (item) => {
        await writeFile(path.resolve(resourcePath, item.id + path.extname(item.title)), item.raw)
      })
    },
  }
}
