export async function fromAsync<T>(asyncItems: AsyncIterable<T>): Promise<T[]> {
  const r: T[] = []
  for await (const i of asyncItems) {
    r.push(i)
  }
  return r
}
