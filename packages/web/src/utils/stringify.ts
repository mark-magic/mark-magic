export function stringify(obj: Record<string, string>): string {
  const params = new URLSearchParams()
  Object.entries(obj).forEach(([k, v]) => {
    params.set(k, v)
  })
  return params.toString()
}
