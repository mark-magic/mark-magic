import { DoctranGoogleOptions } from '../config.schema'
import { Translator } from './define'
import { Translator as GoogleTranslator } from 'google-translate-api-x'

export function google(options: DoctranGoogleOptions): Translator {
  return {
    name: 'google',
    async translate(text) {
      const e = new GoogleTranslator({
        from: 'auto',
        to: options.to,
        forceBatch: false,
      })
      return (await e.translate(text)).text
    },
  }
}
