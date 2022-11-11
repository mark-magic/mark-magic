import { start } from '.'
import path from 'path'
import { fileURLToPath } from 'url'

start({
  port: 8080,
  static: path.dirname(fileURLToPath(import.meta.url)),
})
console.log('start: http://localhost:8080')
