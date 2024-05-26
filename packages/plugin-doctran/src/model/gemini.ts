import { ChatVertexAI } from '@langchain/google-vertexai'
import { Translator } from './define'
import { DoctranOpenAIOptions } from '../config.schema'
import { translateByChat } from './openai'

export function gemini(
  options: Pick<DoctranOpenAIOptions, 'apiKey' | 'model' | 'entities' | 'to' | 'prompt'>,
): Translator {
  return {
    name: 'gemini',
    async translate(text: string): Promise<string> {
      const chat = new ChatVertexAI({
        temperature: 1,
        model: options.model ?? 'gemini-1.0-pro',
      })
      return translateByChat(chat, text, options)
    },
  }
}
