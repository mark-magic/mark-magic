import FastGlob from 'fast-glob'
import path from 'path'
import { v4 } from 'uuid'

export interface ScanNote {
  id: string
  title: string
  relPath: string
}

export async function scan(root: string): Promise<ScanNote[]> {
  return (
    await FastGlob('**/*.md', {
      cwd: root,
      onlyFiles: true,
      ignore: ['.obsidian'],
    })
  ).map((item) => ({
    id: v4(),
    title: path.basename(item, '.md'),
    relPath: item,
  }))
}
