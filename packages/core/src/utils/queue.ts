/**
 * 将异步生成器转换为非惰性的
 * @param a
 */
export async function* queue<T>(a: AsyncGenerator<T>): AsyncGenerator<T> {
  let q: any[] = [],
    end = false
  ;(async () => {
    for await (const i of a) {
      q.push(i)
    }
    end = true
  })()
  while (!end) {
    if (q.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 10))
      continue
    }
    const i = q.shift()
    yield i
  }
}
