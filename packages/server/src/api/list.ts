import joplin from './assets/joplin.schema.json'
import hexo from './assets/hexo.schema.json'

export interface MamiPlugin {
  name: string
  input?: object
  output?: object
}

export function list(type: 'input' | 'output') {
  if (type === 'input') {
    return [joplin]
  }
  if (type === 'output') {
    return [hexo]
  }
  throw new Error('not support type: ' + type)
}
