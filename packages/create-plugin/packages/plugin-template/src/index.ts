import { InputPlugin, OutputPlugin } from '@mark-magic/core'

export function input(): InputPlugin {
  return {
    name: 'plugin-template',
    async *generate() {
      // TODO Generate content
      yield {
        id: 'test',
        name: 'test',
        resources: [],
        path: ['test.md'],
        content: 'test',
        created: Date.now(),
        updated: Date.now(),
      }
    },
  }
}

export function output(): OutputPlugin {
  return {
    name: 'plugin-template',
    async handle(content) {
      // TODO Handle content
      console.log(content)
    },
  }
}
