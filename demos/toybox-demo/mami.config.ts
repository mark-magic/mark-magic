import { defineConfig, OutputPlugin, Tag } from '@mami/cli'
import * as joplin from '@mami/plugin-joplin'
import * as obsidian from '@mami/plugin-obsidian'
import * as raw from '@mami/plugin-raw'
import * as local from '@mami/plugin-local'
import * as hexo from '@mami/plugin-hexo'
import { writeFile } from 'fs/promises'
import { chain } from 'lodash'
import { groupBy } from 'lodash-es'
import path from 'path'
import { outputCache } from '@mami/utils'

const zipPath = path.resolve(path.resolve(__dirname, './dist/temp-joplin.zip'))
const config: Parameters<typeof joplin.input>[0] = {
  baseUrl: 'http://127.0.0.1:27583',
  token:
    '5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31',
  tag: '',
}

function testPlugin(): OutputPlugin {
  const map: Record<string, Tag> = {}
  return {
    name: 'test',
    async handle(note) {
      note.tags.forEach((item) => (map[item.id] = item))
    },
    async end() {
      const list = Object.values(map)
      // chain(list)
      //   .groupBy()
      //   .filter((v) => v.length > 1)
      //   .value()
      await writeFile(path.resolve(__dirname, 'dist/tags.json'), JSON.stringify(list))
    },
  }
}

export default defineConfig({
  input: [
    // raw.input({ path: zipPath }),
    // joplin.input(config),
    obsidian.input({ root: path.resolve(__dirname, '.temp') }),
  ],
  output: [
    // testPlugin(),
    // raw.output({ path: zipPath }),
    // joplin.output(config),
    // obsidian.output({ root: path.resolve(__dirname, '.temp') }),
    // local.output({
    //   noteRootPath: path.resolve(__dirname, 'dist/assets'),
    //   resourceRootPath: path.resolve(__dirname, 'dist/assets/_resources'),
    // }),
    outputCache(hexo.output({ root: path.resolve(__dirname, 'dist/hexo-output') })),
  ],
  debug: true,
})
