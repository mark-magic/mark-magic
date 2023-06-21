import pathe from 'pathe'

export function formatRelative(s: string): string {
  const prefix = ['./', '../']
  const r = s.replaceAll('\\', '/')
  return encodeURI(prefix.some((i) => r.startsWith(i)) ? r : './' + r)
}

export const isIndex = (path: string) => ['readme.md', 'index.md'].includes(pathe.basename(path).toLocaleLowerCase())
