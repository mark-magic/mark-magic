export function trimMarkdown(s: string) {
  const l = s.split('\n').filter((it) => it.trim().length > 0)
  const ident = Math.min(...l.map((v) => v.length - v.trimStart().length))
  return l.map((v) => v.slice(ident)).join('\n')
}
