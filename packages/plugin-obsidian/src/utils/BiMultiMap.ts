/**
 * 双向 map
 * 主要功能应该有
 * 一次 set 可以自动设置 值 <=> 键 的映射关系
 * 可以通过 key 获取所有与之关联的 value
 * 可以通过 value 获取与之相关联的 key
 * 可以通过 delete key 删除所有仅在这个 key 里面用到的 value
 */
export class BiMultiMap<K, V> {
  private readonly k2vMap = new Map<K | V, V | K>()

  set(k: K, v: V): this
  set(k: V, v: K): this
  set(k: K | V, v: K | V) {
    if (this.has(k) || this.has(v)) {
      this.delete(k)
    }
    this.k2vMap.set(k, v)
    this.k2vMap.set(v, k)
    return this
  }

  get(k: K): V | undefined
  get(k: V): K | undefined
  get(k: K | V): V | K | undefined {
    return this.k2vMap.get(k) as any
  }

  has(k: K | V): boolean {
    return this.k2vMap.has(k)
  }

  delete(k: K | V) {
    if (!this.k2vMap.has(k)) {
      return
    }
    this.k2vMap.delete(this.k2vMap.get(k)!)
    this.k2vMap.delete(k)
  }
}
