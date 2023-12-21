function lowcase(s: string): string {
  return s.slice(0, 1).toLowerCase() + s.slice(1)
}

export function lowcaseObjectKeys(s: Record<string, any>): Record<string, any> {
  const r = {} as Record<string, any>
  for (const [k, v] of Object.entries(s)) {
    r[lowcase(k)] = v
  }
  return r
}
