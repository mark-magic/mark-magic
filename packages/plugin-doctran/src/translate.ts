import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { AsyncArray } from '@liuli-util/async'
import { difference } from 'lodash-es'
import { Translator } from './model/define'

export interface Translation {
  (text: string): Promise<string>
}

export async function split(text: string, chunkSize = 4000): Promise<string[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap: 0,
    separators: difference(RecursiveCharacterTextSplitter.getSeparatorsForLanguage('markdown'), [
      '\n\n***\n\n',
      '\n\n---\n\n',
      '\n\n___\n\n',
    ]),
  })
  return await splitter.splitText(text)
}

export async function translate(t: Translator, text: string) {
  const texts = await split(text)
  return (await AsyncArray.map(texts, t.translate)).join('\n\n')
}
