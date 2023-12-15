import { expect, it } from 'vitest'
import { BiMultiMap } from '../BiMultiMap'

it('基本示例', () => {
  const map = new BiMultiMap<number, string>()
  map.set(1, '1')
  map.set(2, '1')
  map.set(2, '2')
  map.set(1, '3')
  expect(map.get(1)).eq('3')
  expect(map.get(2)).eq('2')
  expect(map.get(3)).undefined
  expect(map.get('1')).undefined
  map.delete(1)
  expect(map.get('1')).undefined
  map.delete(2)
  expect(map.get('2')).undefined
})

it('重复设置', () => {
  const map = new BiMultiMap<number, string>()
  map.set(1, 'a')
  expect(map.get(1)).eq('a')
  expect(map.get('a')).eq(1)
  map.set(2, 'a')
  expect(map.get(1)).eq('a')
  expect(map.get('a')).eq(2)
  map.set(3, 'a')
  expect(map.get(3)).eq('a')
  expect(map.get('a')).eq(3)
  map.delete(1)
  expect(map.get(1)).undefined
})
