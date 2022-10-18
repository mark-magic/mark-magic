import { PromiseUtil } from './utils/PromiseUtil'
import { queue } from './utils/queue'

export interface Tag {
  id: string
  title: string
}

export interface Resource {
  id: string
  title: string
  raw: Buffer
}

export interface Note {
  id: string
  title: string
  content: string
  createAt: number
  updateAt: number
  tags: Tag[]
  resources: Resource[]
  path: string[]
}

export interface InputPlugin {
  name: string
  generate(): AsyncGenerator<Note>
}
export interface OutputPlugin {
  name: string
  start?(): Promise<void>
  handle(note: Note): Promise<void>
  end?(): Promise<void>
}

export interface ConvertConfig {
  input?: InputPlugin[]
  output?: OutputPlugin[]
}

export interface Events {
  generate?(options: { input: InputPlugin; note: Note }): void
  handle?(options: { input: InputPlugin; output: OutputPlugin; note: Note }): void
}

export function convert(options: ConvertConfig) {
  return PromiseUtil.warpOnEvent(async (events: Events) => {
    const inputs = (options.input ?? []) as InputPlugin[]
    const outputs = (options.output ?? []) as OutputPlugin[]
    if (inputs.length > 0) {
      for (const output of outputs) {
        await output.start?.()
      }
    }
    for (const input of inputs) {
      const generator = queue(input.generate())
      for await (const note of generator) {
        events.generate?.({ input, note })
        for (const output of outputs) {
          events.handle?.({ input, output, note })
          await output.handle(note)
        }
      }
    }
    if (inputs.length > 0) {
      for (const output of outputs) {
        await output.end?.()
      }
    }
  })
}
