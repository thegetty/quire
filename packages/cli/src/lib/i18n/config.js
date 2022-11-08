/**
 * i18next configuration
 * @see https://www.i18next.com/overview/configuration-options
 *
 * @todo
 * set debug using cli `--debug` option
 * load resources from locale data files
 */
export default {
  debug: false,
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
   * @see https://www.i18next.com/overview/configuration-options#missing-keys
   */
  saveMissing: false,
  /**
   * Translation defaults
   * @see https://www.i18next.com/overview/configuration-options#translation-defaults
   */

  /**
   * Plugin options
   * @see https://www.i18next.com/overview/configuration-options#plugin-options
   */

  /**
   * Other
   * @see https://www.i18next.com/overview/configuration-options#others
   *
   * Load resources synchronously (`initImmediate: true`) to ensure that
   * strings loaded from a filesystem backend are available when needed.
   */
  initImmediate: true
}
