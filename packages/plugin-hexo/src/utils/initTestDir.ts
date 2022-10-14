import { mkdirp, remove } from '@liuli-util/fs-extra'
import { beforeEach, afterEach, isWatchMode } from 'vitest'

export function initTestDir(tempPath: string) {
  beforeEach(async () => {
    await remove(tempPath)
    await mkdirp(tempPath)
  })
  afterEach(async () => {
    if (!isWatchMode()) {
      await remove(tempPath)
    }
  })
}
