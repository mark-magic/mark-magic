import { Translator } from 'google-translate-api-x'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { AsyncArray } from '@liuli-util/async'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { AIMessage, HumanMessage, SystemMessage } from 'langchain/schema'
import { DoctranTransformConfig } from './config.schema'

export interface Translation {
  (text: string): Promise<string>
}

export function createTrans(options: DoctranTransformConfig) {
  if (options.engine === 'google') {
    const e = new Translator({
      from: 'auto',
      to: options.to,
      forceBatch: false,
    })
    return async (text: string) => (await e.translate(text)).text
  }
  const chat = new ChatOpenAI({ openAIApiKey: options.apiKey, modelName: 'gpt-3.5-turbo-16k' })

  return async (text: string) => {
    const r = await chat.invoke([
      new SystemMessage(
        `You are a professional translation engine expert in maintaining Markdown formatting. Please translate the following Markdown text into ${options.to}. Pay special attention to preserving the structure and syntax of Markdown, especially the links and their paths. Keep the links exactly as they are, only translating the link text if needed.`,
      ),
      new HumanMessage(text),
    ])
    return r.content as AIMessage['content'] as string
  }
}

export async function split(text: string, chunkSize = 4000): Promise<string[]> {
  const splitter = RecursiveCharacterTextSplitter.fromLanguage('markdown', {
    chunkSize,
  })
  return await splitter.splitText(text)
}

export async function trans(t: Translation, text: string) {
  const texts = await split(text)
  return (await AsyncArray.map(texts, t)).join('\n\n')
}
