import { convert } from '@mami/cli'

export interface ExecuteOptions {
  input: {
    name: string
    config: object
  }
  output: {
    name: string
    config: object
  }
}

export async function execute(options: ExecuteOptions) {
  const { input } = await import(options.input.name)
  const { output } = await import(options.output.name)
  if (!input || !output) {
    throw new Error('input or output is null')
  }
  await convert({
    input: [input(options.input.config)],
    output: [output(options.output.config)],
  })
}
