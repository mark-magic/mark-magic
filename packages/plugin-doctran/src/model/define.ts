export interface Translator {
  readonly name: 'google' | 'openai' | 'gemini' | 'claude'
  translate(text: string): Promise<string>
}
