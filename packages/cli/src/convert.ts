import { PromiseUtil } from './utils/PromiseUtil'

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
  debug?: boolean
}

export interface Events {
  generate?(options: { input: InputPlugin; note: Note }): void
  handle?(options: { input: InputPlugin; output: OutputPlugin; note: Note; time: number }): void
  error?(context: { note: Note; plugin: InputPlugin | OutputPlugin; error: unknown }): void
}

export function convert(options: ConvertConfig) {
  return PromiseUtil.warpOnEvent(async (events: Events) => {
    performance.mark('convert-start')
    const inputs = (options.input ?? []) as InputPlugin[]
    const outputs = (options.output ?? []) as OutputPlugin[]
    if (inputs.length > 0) {
      for (const output of outputs) {
        performance.mark('output-plugin-hook-start-start-' + output.name)
        await output.start?.()
        performance.mark('output-plugin-hook-start-end-' + output.name)
        performance.measure('output-plugin-hook-start-' + output.name, {
          start: 'output-plugin-hook-start-start-' + output.name,
          end: 'output-plugin-hook-start-end-' + output.name,
        })
      }
    }
    for (const input of inputs) {
      const generator = input.generate()
      performance.mark('input-plugin-generate-start-' + input.name)
      for await (const note of generator) {
        performance.mark('input-plugin-generate-end-' + input.name)
        performance.measure('input-plugin-generate-' + input.name, {
          detail: { id: note.id, title: note.title },
          start: 'input-plugin-generate-start-' + input.name,
          end: 'input-plugin-generate-end-' + input.name,
        })
        events.generate?.({ input, note })
        for (const output of outputs) {
          const start = Date.now()
          const startKey = `output-plugin-handle-start-${output.name}-${note.id}`
          performance.mark(startKey)
          try {
            await output.handle(note)
            events.handle?.({ input, output, note, time: Date.now() - start })
          } catch (e) {
            events.error?.({
              note,
              plugin: output,
              error: e,
            })
          } finally {
            const endKey = `output-plugin-handle-end-${output.name}-${note.id}`
            performance.mark(endKey)
            performance.measure(`output-plugin-handle-${output.name}-${note.id}`, {
              detail: { id: note.id, title: note.title },
              start: startKey,
              end: endKey,
            })
            performance.mark('input-plugin-generate-start-' + input.name)
          }
        }
      }
    }
    if (inputs.length > 0) {
      for (const output of outputs) {
        performance.mark('output-plugin-hook-end-start-' + output.name)
        await output.end?.()
        performance.mark('output-plugin-hook-end-end-' + output.name)
        performance.measure('output-plugin-hook-end-' + output.name, {
          start: 'output-plugin-hook-end-start-' + output.name,
          end: 'output-plugin-hook-end-end-' + output.name,
        })
      }
    }
    performance.mark('convert-end')
    performance.measure('convert', { start: 'convert-start', end: 'convert-end' })
    return { performance: performance.getEntriesByType('measure') }
  })
}
