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
  partialBundledLanguages: false,
  resources: {
    en: {
      translation: {
        'gradoo': 'blargh',
      }
    },
  },
  /**
   * Missing Keys
   * @ https://www.i18next.com/overview/configuration-options#missing-keys
   */
  saveMissing: false,
  /**
   * Translation defaults
   * @ https://www.i18next.com/overview/configuration-options#translation-defaults
   */

  /**
   * Plugin options
   * @see https://www.i18next.com/overview/configuration-options#plugin-options
   */

  /**
   * Other
   * @see https://www.i18next.com/overview/configuration-options#others
   */
}
