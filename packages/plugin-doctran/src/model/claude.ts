import { ChatAnthropic } from '@langchain/anthropic'
import { DoctranOpenAIOptions } from '../config.schema'
import { Translator } from './define'
import { translateByChat } from './openai'

export function claude(
  options: Pick<DoctranOpenAIOptions, 'apiKey' | 'model' | 'entities' | 'to' | 'prompt'>,
): Translator {
  return {
    name: 'claude',
    async translate(text: string): Promise<string> {
      const chat = new ChatAnthropic({
        temperature: 1,
        model: options.model ?? 'claude-3-sonnet-20240229',
        apiKey: options.apiKey,
      })
      return translateByChat(chat as any, text, options)
    },
  }
}
