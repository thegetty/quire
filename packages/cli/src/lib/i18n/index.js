import { LocaleService } from './LocaleService.js'
import I18nextCLILanguageDetector from 'i18next-cli-language-detector'
import i18next from 'i18next'

/**
 * i18next configuration
 * @see https://www.i18next.com/overview/configuration-options
 *
 * @todo
 * set debug using cli `--debug` option
 * set resources by loading data files
 */
const configuration = {
  debug: true,
  /**
   * Languages
   */
  fallbackLng: 'en',
  lng: 'en',
  supportedLngs: ['en'],
  /**
   * Namespaces
   */
  defaultNS: 'translation',
  fallbackNS: false,
  ns: 'translation',
  /**
   * Resources
   */
  resources: {
    en: {
      translation: {
        'gradoo': 'blargh',
      }
    },
  },
}

await i18next
  .use(I18nextCLILanguageDetector)
  .init(configuration)

export default new LocaleService(i18next)
