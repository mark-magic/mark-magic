import { copy, pathExists, readJson, writeJson } from 'fs-extra/esm'
import { readFile, writeFile } from 'fs/promises'
import path from 'pathe'

export interface CreateOptions {
  root: string
  name: string
  template: 'plugin-template'
}

export async function create(options: CreateOptions) {
  const srcPath = path.resolve(__dirname, '../packages', options.template)
  if (!(await pathExists(srcPath))) {
    throw new Error(`不存在模版 ${options.template}`)
  }
  const distPath = path.resolve(options.root, options.name)
  await copy(srcPath, distPath, {
    overwrite: true,
    filter: (src) => !(src.endsWith('node_modules') || src.includes('dist')),
  })
  await Promise.all(
    ['package.json', 'CHANGELOG.md'].map(async (it) => {
      const fsPath = path.resolve(distPath, it)
      const s = await readFile(fsPath, 'utf-8')
      await writeFile(fsPath, s.replace('plugin-template', options.name))
    }),
  )
  const json = await readJson(path.resolve(distPath, 'package.json'))
  json.name = path.basename(options.name)
  await writeJson(path.resolve(distPath, 'package.json'), json, { spaces: 2 })
}
