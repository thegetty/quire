import { LocaleService } from './LocaleService.js'
import configuration from './config.js'
import i18next from 'i18next'
import I18nextCLILanguageDetector from 'i18next-cli-language-detector'

const service = await i18next
  // .on('initialized', () => {
  //   console.debug('[CLI:i18next] initialized')
  // })
  .use(I18nextCLILanguageDetector)
  .init(configuration)

export default new LocaleService(service)
