import { mkdirp, remove } from '@liuli-util/fs-extra'
import path from 'pathe'
import { beforeEach } from 'vitest'

/**
 * 初始化测试目录
 * @param __filename
 * @returns
 */
export function initTempPath(__filename: string) {
  const tempPath = path.resolve(path.dirname(__filename), '.temp', path.basename(__filename))
  beforeEach(async () => {
    await remove(tempPath)
    await mkdirp(tempPath)
  })
  return tempPath
}
