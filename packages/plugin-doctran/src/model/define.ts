export interface Translator {
  readonly name: 'google' | 'openai' | 'gemini'
  translate(text: string): Promise<string>
}
