import { mkdirp, remove } from '@liuli-util/fs-extra'
import path from 'path'
import { beforeEach } from 'vitest'

export function formatRelative(s: string): string {
  const prefix = ['./', '../']
  const r = s.replaceAll('\\', '/')
  return encodeURI(prefix.some((i) => r.startsWith(i)) ? r : './' + r)
}
