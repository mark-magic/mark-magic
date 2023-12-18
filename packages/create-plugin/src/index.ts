import { copy, pathExists, readJson, writeJson } from 'fs-extra/esm'
import path from 'pathe'

export interface CreateOptions {
  root: string
  name: string
  template: 'plugin-template'
}

export async function create(options: CreateOptions) {
  console.log('args: ', options)
  const srcPath = path.resolve(__dirname, '../packages', options.template)
  if (!(await pathExists(srcPath))) {
    throw new Error(`不存在模版 ${options.template}`)
  }
  const distPath = path.resolve(options.root, options.name)
  if (await pathExists(distPath)) {
    throw new Error(`目录已经存在 ${options.name}`)
  }
  await copy(srcPath, distPath)
  const json = await readJson(path.resolve(distPath, 'package.json'))
  json.name = options.name
  await writeJson(path.resolve(distPath, 'package.json'), json, { spaces: 2 })
}
