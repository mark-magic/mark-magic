import data from '../mami-performance.json'
import { chain } from 'lodash-es'

const r = chain(data)
  .filter((item) => item.entryType === 'measure')
  .sortBy((item) => -item.duration)
  .value()
console.log(r.slice(1, 5))
