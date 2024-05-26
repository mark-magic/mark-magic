import { Translator } from './define'
import { DoctranOpenAIOptions } from '../config.schema'
import { ChatOpenAI } from '@langchain/openai'
import { SystemMessagePromptTemplate } from '@langchain/core/prompts'
import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'

export const PROMPT = `
You are a professional translation engine expert in maintaining Markdown formatting. Please translate the following Markdown text into {to}. Pay special attention to preserving the structure and syntax of Markdown, especially the links and their paths. Keep the links exactly as they are, only translating the link text if needed.
`

export async function translateByChat(
  chat: BaseChatModel,
  text: string,
  options: Pick<DoctranOpenAIOptions, 'to' | 'prompt' | 'entities'>,
): Promise<string> {
  const system = await SystemMessagePromptTemplate.fromTemplate((options.prompt ?? PROMPT).trim()).format({
    to: options.to,
    entities: Object.entries(options.entities ?? {})
      .filter(([k]) => text.includes(k))
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n'),
  })
  const r = await chat.invoke([system, new HumanMessage(text)])
  return r.content as AIMessage['content'] as string
}

export function openai(options: DoctranOpenAIOptions): Translator {
  return {
    name: 'openai',
    async translate(text: string): Promise<string> {
      const chat = new ChatOpenAI({
        openAIApiKey: options.apiKey,
        modelName: options.model ?? 'gpt-3.5-turbo-16k',
        configuration: { baseURL: options.baseUrl },
      })
      return translateByChat(chat, text, options)
    },
  }
}
